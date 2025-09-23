# -*- coding: utf-8 -*-
from __future__ import annotations

import io
import os
import re
import time
from datetime import date, datetime, timedelta
from typing import Dict, Tuple, List

import numpy as np
import pandas as pd
import requests

# ------------------------------------------------------------
# Config
# ------------------------------------------------------------
# ID público da planilha (padrão do seu link compartilhado)
DEFAULT_SHEET_ID = os.getenv(
    "SHEETS_DOC_ID",
    "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT",
)

# Caminhos locais alternativos (se você preferir subir um .xlsx no repo)
LOCAL_XLSX_CANDIDATES = [
    "./data/dados.xlsx",
    "./data/base.xlsx",
    "./dados.xlsx",
    "./base.xlsx",
]


# ------------------------------------------------------------
# Estado simples de sincronização
# ------------------------------------------------------------
_LAST_SYNC = {
    "when": None,
    "source": None,
    "status": "never",
    "error": None,
}


def last_sync_info() -> Dict[str, str]:
    """Retorna dicionário com informação da última sincronização."""
    if not _LAST_SYNC["when"]:
        return {
            "when": "-",
            "source": _LAST_SYNC.get("source") or "-",
            "status": "never",
            "error": _LAST_SYNC.get("error") or "",
        }
    return {
        "when": _LAST_SYNC["when"],
        "source": _LAST_SYNC.get("source") or "-",
        "status": _LAST_SYNC.get("status") or "ok",
        "error": _LAST_SYNC.get("error") or "",
    }


# ------------------------------------------------------------
# Helpers de parse/format em pt-BR
# ------------------------------------------------------------
def _to_float_safe(v) -> float:
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return 0.0
    if isinstance(v, (int, float, np.integer, np.floating)):
        try:
            return float(v)
        except Exception:
            return 0.0
    s = str(v).strip()
    s = s.replace("R$", "").replace(" ", "")
    s = s.replace(".", "").replace(",", ".")  # pt-BR -> ponto decimal
    try:
        return float(s)
    except Exception:
        return 0.0


def _to_int_safe(v) -> int:
    f = _to_float_safe(v)
    try:
        return int(round(f))
    except Exception:
        return 0


def format_currency(v) -> str:
    """Formata em 'R$ 12.345,67' (tolerante a str/float/None)."""
    n = _to_float_safe(v)
    # 2 casas, separador milhar ".", decimal ","
    s = f"{n:,.2f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")


def format_number(v) -> str:
    """Inteiro com separador de milhar pt-BR ('12.345')."""
    n = _to_int_safe(v)
    s = f"{n:,}"
    return s.replace(",", ".")


def format_percent(v, with_sign: bool = True) -> str:
    """Aceita 0.05 (5%) ou 5 (5%)."""
    if v is None:
        return "0%"
    f = _to_float_safe(v)
    # Se vier como 5, tratamos como já em percent; se vier como 0.05, multiplicamos
    if f <= 1.0:
        f = f * 100.0
    sign = ""
    if with_sign and f != 0:
        sign = "+" if f > 0 else "−"
        f = abs(f)
    return f"{sign}{f:.0f}%"


# ------------------------------------------------------------
# Leitura da planilha
# ------------------------------------------------------------
def _download_gsheet_xlsx(doc_id: str) -> bytes:
    """Baixa .xlsx público de um Google Sheets compartilhado."""
    url = f"https://docs.google.com/spreadsheets/d/{doc_id}/export?format=xlsx"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.content


def _read_all_sheets_from_bytes(xlsx_bytes: bytes) -> Dict[str, pd.DataFrame]:
    xl = pd.ExcelFile(io.BytesIO(xlsx_bytes))
    dfs: Dict[str, pd.DataFrame] = {}
    for name in xl.sheet_names:
        try:
            df = xl.parse(name)
        except Exception:
            df = pd.DataFrame()
        # normaliza colunas
        df.columns = [str(c).strip() for c in df.columns]
        dfs[name] = df
    return dfs


def _try_local_xlsx() -> Dict[str, pd.DataFrame] | None:
    for path in LOCAL_XLSX_CANDIDATES:
        if os.path.exists(path):
            try:
                xl = pd.ExcelFile(path)
                dfs = {}
                for name in xl.sheet_names:
                    df = xl.parse(name)
                    df.columns = [str(c).strip() for c in df.columns]
                    dfs[name] = df
                _LAST_SYNC.update(
                    when=datetime.utcnow().isoformat(),
                    source=f"local:{path}",
                    status="ok",
                    error=None,
                )
                return dfs
            except Exception as e:
                _LAST_SYNC.update(
                    when=datetime.utcnow().isoformat(),
                    source=f"local:{path}",
                    status="error",
                    error=str(e),
                )
                return None
    return None


def get_dataframes() -> Dict[str, pd.DataFrame]:
    """
    Lê todos os sheets e retorna dict: {nome_da_aba: DataFrame}.
    Usa Google Sheets (público) por padrão; se falhar, tenta arquivos locais.
    NUNCA importa app.py (evita loop).
    """
    # 1) Google Sheets público (se possível)
    try:
        raw = _download_gsheet_xlsx(DEFAULT_SHEET_ID)
        dfs = _read_all_sheets_from_bytes(raw)
        _LAST_SYNC.update(
            when=datetime.utcnow().isoformat(),
            source=f"gsheet:{DEFAULT_SHEET_ID}",
            status="ok",
            error=None,
        )
        return dfs
    except Exception as e:
        _LAST_SYNC.update(
            when=datetime.utcnow().isoformat(),
            source=f"gsheet:{DEFAULT_SHEET_ID}",
            status="error",
            error=str(e),
        )
    # 2) Local fallback
    local = _try_local_xlsx()
    if local is not None:
        return local
    # 3) Vazio (mas não quebra o app)
    return {}


# ------------------------------------------------------------
# KPIs principais
# ------------------------------------------------------------
def _find_sheet_by_candidates(dfs: Dict[str, pd.DataFrame], names: List[str]) -> tuple[str, pd.DataFrame] | None:
    lower_keys = {k.lower(): k for k in dfs.keys()}
    for candidate in names:
        for k_lower, real_key in lower_keys.items():
            if candidate.lower() in k_lower:
                return real_key, dfs[real_key]
    return None


def compute_kpis(dfs: Dict[str, pd.DataFrame]) -> Dict[str, str]:
    """
    Retorna um dict de strings já formatadas para o template.
    Chaves esperadas no front:
      - leads_total
      - cpl_medio
      - cpl_meta
      - investimento_total
      - roas
      - perc_cpl
    """
    leads = 0
    investimento = 0.0
    cpl_meta_val = 15.0
    roas_val = 1.0
    perc_cpl_val = 0.0

    # 1) Tenta sheet de KPIs
    kpi_hit = _find_sheet_by_candidates(dfs, ["kpi", "kpIs", "resumo", "geral"])
    if kpi_hit:
        _, dfk = kpi_hit
        # Procura por colunas amigáveis
        def pick(df: pd.DataFrame, cols: List[str]):
            for c in df.columns:
                c_norm = str(c).strip().lower()
                for target in cols:
                    if target in c_norm:
                        return df[c].iloc[0]
            return None

        v_leads = pick(dfk, ["lead", "qtd", "total"])
        v_inv = pick(dfk, ["invest", "gasto", "spend", "custo total"])
        v_cpl_meta = pick(dfk, ["meta cpl", "cpl meta"])
        v_roas = pick(dfk, ["roas"])
        v_perc_cpl = pick(dfk, ["percentual cpl", "% cpl", "var cpl"])

        leads = _to_int_safe(v_leads) if v_leads is not None else 0
        investimento = _to_float_safe(v_inv) if v_inv is not None else 0.0
        cpl_meta_val = _to_float_safe(v_cpl_meta) if v_cpl_meta is not None else cpl_meta_val
        roas_val = _to_float_safe(v_roas) if v_roas is not None else roas_val
        perc_cpl_val = _to_float_safe(v_perc_cpl) if v_perc_cpl is not None else perc_cpl_val

    # 2) Se ainda vazio, tenta inferir de outras abas (Leads e Investimentos)
    if leads == 0:
        hit = _find_sheet_by_candidates(dfs, ["lead", "cadastro"])
        if hit:
            _, dfl = hit
            leads = len(dfl.index)

    if investimento == 0:
        hit = _find_sheet_by_candidates(dfs, ["invest", "mídia", "gasto", "ads", "facebook", "google"])
        if hit:
            _, dfi = hit
            # Soma colunas comuns de gasto
            for col in dfi.columns:
                if any(x in str(col).lower() for x in ["invest", "spend", "gasto", "custo"]):
                    investimento += _to_float_safe(dfi[col].sum())

    # 3) Derivados
    cpl_medio_val = (investimento / leads) if leads > 0 else 0.0
    if perc_cpl_val == 0.0 and cpl_meta_val > 0:
        perc_cpl_val = (cpl_medio_val / cpl_meta_val) - 1.0  # exibe depois como %

    # 4) String format para template
    kpis = {
        "leads_total": format_number(leads),
        "cpl_medio": format_currency(cpl_medio_val),
        "cpl_meta": format_currency(cpl_meta_val),
        "investimento_total": format_currency(investimento),
        "roas": f"{_to_float_safe(roas_val):.2f}",
        "perc_cpl": format_percent(perc_cpl_val, with_sign=True),
    }
    return kpis


# ------------------------------------------------------------
# Abas: Origem & Conversão por Canal
# ------------------------------------------------------------
def compute_origem_conversao(dfs: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Retorna (tabela_origem, funil_conversao_por_canal)
    Ambos DataFrames não devem quebrar se faltar coluna.
    """
    # Tabela origem
    tab = pd.DataFrame(columns=["Canal", "Leads", "Investimento", "CPL"])
    hit = _find_sheet_by_candidates(dfs, ["origem", "canal", "fonte"])
    if hit:
        _, df = hit
        # heurística comum
        canal_col = None
        for c in df.columns:
            cl = str(c).lower()
            if any(x in cl for x in ["canal", "origem", "fonte", "utm_source"]):
                canal_col = c
                break
        if canal_col is None and len(df.columns) > 0:
            canal_col = df.columns[0]

        leads_col = next((c for c in df.columns if "lead" in str(c).lower()), None)
        invest_col = next((c for c in df.columns if any(x in str(c).lower() for x in ["invest", "spend", "gasto"])), None)

        if canal_col:
            g = df.groupby(canal_col, dropna=False)
            leads_s = g[leads_col].sum() if leads_col in df.columns else g.size()
            invest_s = g[invest_col].sum() if invest_col in df.columns else 0
            tab = pd.DataFrame({
                "Canal": leads_s.index.astype(str),
                "Leads": leads_s.values,
                "Investimento": invest_s if isinstance(invest_s, np.ndarray) else np.array([_to_float_safe(0)] * len(leads_s)),
            })
            tab["CPL"] = tab.apply(lambda r: (r["Investimento"] / r["Leads"]) if r["Leads"] else 0, axis=1)
            tab = tab.sort_values("Leads", ascending=False, ignore_index=True)

    # Funil por canal (placeholder robusto)
    funil = pd.DataFrame(columns=["Canal", "Captação", "Qualificados", "Vendas"])
    if not tab.empty:
        funil = tab[["Canal", "Leads"]].copy()
        funil.rename(columns={"Leads": "Captação"}, inplace=True)
        # heurísticas simples para não quebrar
        funil["Qualificados"] = (funil["Captação"] * 0.35).astype(int)
        funil["Vendas"] = (funil["Captação"] * 0.05).astype(int)

    # Formatação para exibir em templates (se você renderiza como texto)
    # Caso os templates esperem números já formatados, converta onde necessário no HTML.

    return tab, funil


# ------------------------------------------------------------
# Abas: Profissão por Canal
# ------------------------------------------------------------
def compute_profissao_canal(dfs: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """
    Agrupa por Profissão e Canal, retornando uma tabela ordenada.
    """
    hit = _find_sheet_by_candidates(dfs, ["profiss", "ocup", "cargo"])
    if not hit:
        # Tenta reaproveitar a de origem
        hit = _find_sheet_by_candidates(dfs, ["origem", "canal", "fonte"])
    if not hit:
        return pd.DataFrame(columns=["Profissão", "Canal", "Leads"])

    _, df = hit
    prof_col = next((c for c in df.columns if any(x in str(c).lower() for x in ["profiss", "ocup", "cargo"])), None)
    canal_col = next((c for c in df.columns if any(x in str(c).lower() for x in ["canal", "origem", "fonte"])), None)

    if prof_col is None:
        prof_col = "Profissão"
        df[prof_col] = "Não informado"
    if canal_col is None:
        canal_col = "Canal"
        df[canal_col] = "Desconhecido"

    out = df.groupby([prof_col, canal_col], dropna=False).size().reset_index(name="Leads")
    out.rename(columns={prof_col: "Profissão"}, inplace=True)
    out = out.sort_values(["Leads"], ascending=False, ignore_index=True)
    return out


# ------------------------------------------------------------
# Abas: Análise Regional
# ------------------------------------------------------------
def compute_analise_regional(dfs: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Retorna (por_estado, por_regiao).
    Detecta colunas como 'estado', 'uf', 'região'.
    """
    hit = _find_sheet_by_candidates(dfs, ["regional", "estado", "uf", "regi"])
    if not hit:
        # fallback: qualquer aba com 'estado'/'uf'
        for name, df in dfs.items():
            if any(x in " ".join(df.columns).lower() for x in ["estado", "uf", "regi"]):
                hit = (name, df)
                break
    if not hit:
        return (
            pd.DataFrame(columns=["UF", "Leads"]),
            pd.DataFrame(columns=["Região", "Leads"]),
        )

    _, df = hit
    uf_col = next((c for c in df.columns if any(x == str(c).strip().lower() for x in ["uf", "estado"])), None)
    reg_col = next((c for c in df.columns if "regi" in str(c).strip().lower()), None)

    if uf_col is None:
        por_estado = pd.DataFrame(columns=["UF", "Leads"])
    else:
        por_estado = df.groupby(uf_col, dropna=False).size().reset_index(name="Leads")
        por_estado.rename(columns={uf_col: "UF"}, inplace=True)
        por_estado = por_estado.sort_values("Leads", ascending=False, ignore_index=True)

    if reg_col is None:
        por_regiao = pd.DataFrame(columns=["Região", "Leads"])
    else:
        por_regiao = df.groupby(reg_col, dropna=False).size().reset_index(name="Leads")
        por_regiao.rename(columns={reg_col: "Região"}, inplace=True)
        por_regiao = por_regiao.sort_values("Leads", ascending=False, ignore_index=True)

    return por_estado, por_regiao


# ------------------------------------------------------------
# Abas: Insights de IA (regra simples, sem ML)
# ------------------------------------------------------------
def compute_insights_ia(dfs: Dict[str, pd.DataFrame]) -> List[Dict[str, str]]:
    kpis = compute_kpis(dfs)
    insights: List[Dict[str, str]] = []

    cpl_str = kpis.get("cpl_medio", "R$ 0,00")
    cpl_val = _to_float_safe(cpl_str)
    cpl_meta_str = kpis.get("cpl_meta", "R$ 0,00")
    cpl_meta_val = _to_float_safe(cpl_meta_str)

    if cpl_meta_val > 0:
        gap = (cpl_val / cpl_meta_val) - 1.0
        if gap > 0.05:
            insights.append({
                "titulo": "CPL acima da meta",
                "texto": f"O CPL médio ({format_currency(cpl_val)}) está {format_percent(gap)} acima da meta ({cpl_str}). Reavalie campanhas com baixo volume e alto custo."
            })
        else:
            insights.append({
                "titulo": "CPL dentro da meta",
                "texto": f"O CPL médio ({format_currency(cpl_val)}) está dentro da meta ({cpl_meta_str}). Mantenha as otimizações atuais."
            })

    # Origem com pior CPL (heurística)
    tab, _ = compute_origem_conversao(dfs)
    if not tab.empty and "CPL" in tab.columns:
        worst = tab.sort_values("CPL", ascending=False).iloc[0]
        insights.append({
            "titulo": "Canal com pior CPL",
            "texto": f"O canal '{worst['Canal']}' tem CPL {format_currency(worst['CPL'])}. Considere pausar criativos de baixo CTR e testar novas audiências."
        })

    # Região mais quente
    estados, regioes = compute_analise_regional(dfs)
    if not regioes.empty:
        top = regioes.iloc[0]
        insights.append({
            "titulo": "Região com mais leads",
            "texto": f"A região '{top['Região']}' lidera em volume. Direcione orçamento incremental para ampliar presença."
        })

    if not insights:
        insights.append({
            "titulo": "Sem dados suficientes",
            "texto": "Não encontrei dados suficientes para gerar insights. Verifique se as abas da planilha estão preenchidas."
        })
    return insights


# ------------------------------------------------------------
# Abas: Projeção de Resultado (simples)
# ------------------------------------------------------------
def compute_projecao_resultados(dfs: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, Dict[str, str]]:
    """
    Projeta até o fim do mês com base na média diária observada.
    Retorna (df_proj, premissas)
    """
    hoje = date.today()
    inicio = hoje.replace(day=1)
    dias_passados = (hoje - inicio).days + 1
    dias_mes = (inicio.replace(month=inicio.month % 12 + 1, day=1) - timedelta(days=1)).day

    k = compute_kpis(dfs)
    leads_atual = _to_int_safe(k.get("leads_total"))
    inv_atual = _to_float_safe(k.get("investimento_total"))

    media_leads_dia = (leads_atual / dias_passados) if dias_passados > 0 else 0
    media_inv_dia = (inv_atual / dias_passados) if dias_passados > 0 else 0.0

    dias_futuros = dias_mes - dias_passados
    proj_leads = int(round(leads_atual + media_leads_dia * dias_futuros))
    proj_inv = inv_atual + media_inv_dia * dias_futuros

    df_proj = pd.DataFrame({
        "Métrica": ["Leads atuais", "Leads projetados M+0", "Investimento atual", "Investimento projetado M+0"],
        "Valor": [leads_atual, proj_leads, inv_atual, proj_inv],
        "Valor_fmt": [format_number(leads_atual), format_number(proj_leads), format_currency(inv_atual), format_currency(proj_inv)]
    })

    premissas = {
        "periodo": f"{inicio.strftime('%d/%m/%Y')} - {hoje.strftime('%d/%m/%Y')}",
        "dias_passados": str(dias_passados),
        "dias_mes": str(dias_mes),
        "media_leads_dia": format_number(media_leads_dia),
        "media_inv_dia": format_currency(media_inv_dia),
    }
    return df_proj, premissas
