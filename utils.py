# -*- coding: utf-8 -*-
"""
Módulo utilitário do Dashboard CHT22.
- NÃO importe este módulo dentro dele mesmo (evita import circular).
- Fornece carregamento de dados, formatações e cálculos usados pelo app.
"""

import os
import io
from datetime import datetime, date, timedelta
from typing import Dict, Tuple, List, Any, Optional

import pandas as pd
import numpy as np
import requests


# ==============================
# Config & Cache
# ==============================
_CACHE: Dict[str, Any] = {"dfs": None, "loaded_at": None, "source": None}


# ==============================
# Helpers de parsing / formatação
# ==============================
def _strip_str(x: Any) -> str:
    if x is None or (isinstance(x, float) and pd.isna(x)):
        return ""
    return str(x).strip()


def _to_float(x: Any) -> float:
    """Converte valores em pt-BR para float.
    Aceita: "9.500", "1.234,56", "R$ 12.345,67", "5%", 12_345.67, etc."""
    if x is None:
        return np.nan
    if isinstance(x, (int, float, np.number)) and not pd.isna(x):
        return float(x)
    s = _strip_str(x)

    if s == "":
        return np.nan

    # Remove moeda / espaços
    s = s.replace("R$", "").replace(" ", "")

    # Percentual
    if s.endswith("%"):
        s = s[:-1]
        # Troca milhar/decimal pt-BR
        s = s.replace(".", "").replace(",", ".")
        try:
            return float(s) / 100.0
        except Exception:
            return np.nan

    # Número normal pt-BR
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except Exception:
        return np.nan


def _safe_int(x: Any) -> int:
    v = _to_float(x)
    if pd.isna(v):
        return 0
    return int(round(float(v)))


def format_number(v: Any) -> str:
    """Formata integer com milhar em pt-BR: 12345 -> '12.345'"""
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return "0"
    n = _safe_int(v)
    return f"{n:,}".replace(",", ".")


def format_currency(v: Any) -> str:
    """Formata moeda pt-BR: 12345.6 -> 'R$ 12.345,60'"""
    val = _to_float(v)
    if pd.isna(val):
        val = 0.0
    s = f"{val:,.2f}"
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"


def format_percent(v: Any, with_sign: bool = True) -> str:
    """Formata percentual pt-BR. Aceita 0.05 ou 5 (%)"""
    val = _to_float(v)
    if pd.isna(val):
        val = 0.0
    # Se já veio em 5 (e não 0.05), interpreta como 5%
    if abs(val) > 1:
        pct = val
    else:
        pct = val * 100.0
    sign = "+" if (with_sign and pct > 0) else ""
    s = f"{pct:,.0f}".replace(",", ".")
    return f"{sign}{s}%"


def last_sync_info() -> Dict[str, Any]:
    ts = _CACHE.get("loaded_at")
    src = _CACHE.get("source") or "desconhecido"
    return {
        "when": (ts.isoformat() if isinstance(ts, datetime) else None),
        "source": src,
    }


# ==============================
# Carregamento de dados
# ==============================
def _gsheet_export_xlsx_url() -> Optional[str]:
    gsid = os.getenv("GSHEET_ID", "").strip()
    if gsid:
        return f"https://docs.google.com/spreadsheets/d/{gsid}/export?format=xlsx"
    url = os.getenv("GSHEET_XLSX_URL", "").strip()
    if url:
        return url
    return None


def _read_all_sheets_from_xlsx_bytes(content: bytes) -> Dict[str, pd.DataFrame]:
    try:
        dfs = pd.read_excel(io.BytesIO(content), sheet_name=None, engine="openpyxl")
        # Normaliza nomes das abas
        return {str(k).strip(): v for k, v in dfs.items()}
    except Exception:
        return {}


def _read_data() -> Dict[str, pd.DataFrame]:
    """
    Tenta nesta ordem:
      1) Google Sheets via export XLSX (se GSHEET_ID/GSHEET_XLSX_URL estiver setado)
      2) Arquivo local (DATA_XLSX_PATH) ou defaults conhecidos.
    """
    # 1) Google Sheets export XLSX
    url = _gsheet_export_xlsx_url()
    if url:
        try:
            r = requests.get(url, timeout=30)
            r.raise_for_status()
            dfs = _read_all_sheets_from_xlsx_bytes(r.content)
            if dfs:
                _CACHE["source"] = "google_sheets"
                return dfs
        except Exception:
            pass

    # 2) Arquivo local
    local_candidates = [
        os.getenv("DATA_XLSX_PATH", "").strip(),
        "/app/data.xlsx",
        "/app/data/base.xlsx",
        "/app/Base de Dados Para o Dash IA CHT22 (1).xlsx",
        "/app/data/dados.xlsx",
    ]
    for path in [p for p in local_candidates if p]:
        if os.path.exists(path):
            try:
                dfs = pd.read_excel(path, sheet_name=None, engine="openpyxl")
                _CACHE["source"] = os.path.basename(path)
                return {str(k).strip(): v for k, v in dfs.items()}
            except Exception:
                continue

    # Sem dados
    _CACHE["source"] = "empty"
    return {}


def get_dataframes(force_refresh: bool = False) -> Dict[str, pd.DataFrame]:
    """Carrega e faz cache leve dos dataframes de todas as abas."""
    if not force_refresh and _CACHE.get("dfs") is not None:
        return _CACHE["dfs"]

    dfs = _read_data()
    _CACHE["dfs"] = dfs
    _CACHE["loaded_at"] = datetime.utcnow()
    return dfs


# ==============================
# Cálculos de KPIs
# ==============================
def _lookup_metric(df: pd.DataFrame, metric_names: List[str]) -> Any:
    """Procura valor por nome de métrica (coluna/linha), tolerante a layout."""
    if df is None or df.empty:
        return np.nan

    # Caso tipo tabela 2 colunas: "Métrica" | "Valor"
    cols_lower = [str(c).strip().lower() for c in df.columns]
    metric_col_idx = None
    value_col_idx = None

    for i, c in enumerate(cols_lower):
        if c in {"metrica", "métrica", "indicador", "kpi", "nome"}:
            metric_col_idx = i
        if c in {"valor", "value", "resultado"}:
            value_col_idx = i

    if metric_col_idx is not None and value_col_idx is not None:
        for _, row in df.iterrows():
            name = _strip_str(row.iloc[metric_col_idx]).lower()
            if any(name == m.lower() for m in metric_names):
                return row.iloc[value_col_idx]

    # Tenta por colunas com os nomes das métricas
    for m in metric_names:
        if m.lower() in cols_lower:
            try:
                col = df.iloc[:, cols_lower.index(m.lower())]
                # Pega primeira célula não nula
                val = col.dropna().iloc[0] if not col.dropna().empty else np.nan
                return val
            except Exception:
                pass

    return np.nan


def compute_kpis(dfs: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
    """Retorna dict com strings já formatadas para exibição."""
    # Heurísticas de onde podem estar os KPIs
    candidate_tabs = ["KPIs", "KPI", "Resumo", "RESUMO", "Visão Geral", "Dados", "Base", "Dashboard"]

    df_kpis = None
    for tab in candidate_tabs:
        if tab in dfs:
            df_kpis = dfs[tab]
            break
        # tenta por case-insensitive
        for key in dfs.keys():
            if key.strip().lower() == tab.strip().lower():
                df_kpis = dfs[key]
                break
        if df_kpis is not None:
            break

    # Extrai métricas se existir aba
    leads = _to_float(_lookup_metric(df_kpis, ["Total Leads", "Leads", "leads_total"]))
    investimento = _to_float(_lookup_metric(df_kpis, ["Investimento", "Gasto", "Spend"]))
    cpl_meta = _to_float(_lookup_metric(df_kpis, ["Meta CPL", "CPL Meta"]))
    cpl_medio = _to_float(_lookup_metric(df_kpis, ["CPL Médio", "CPL", "Custo por Lead"]))
    roas = _to_float(_lookup_metric(df_kpis, ["ROAS", "Return on Ad Spend"]))

    # Fallbacks calculados
    if pd.isna(leads):
        # procura qualquer aba com leads por linha
        for name, df in dfs.items():
            try:
                # se tem coluna 'lead' ou 'id' assume contagem de linhas
                if isinstance(df, pd.DataFrame) and len(df) and df.shape[0] > 0:
                    leads = float(len(df))
                    break
            except Exception:
                pass
    if pd.isna(investimento) and not pd.isna(cpl_medio) and not pd.isna(leads) and leads > 0:
        investimento = cpl_medio * leads
    if pd.isna(cpl_medio) and not pd.isna(investimento) and not pd.isna(leads) and leads > 0:
        cpl_medio = investimento / max(leads, 1)
    if pd.isna(cpl_meta):
        cpl_meta = 0.0
    if pd.isna(roas) and not pd.isna(investimento) and investimento > 0:
        roas = 1.0  # neutro, caso não exista

    # Percentual de variação do CPL vs meta
    if cpl_meta and cpl_meta != 0 and not pd.isna(cpl_medio):
        pct_cpl = (cpl_medio - cpl_meta) / cpl_meta
    else:
        pct_cpl = 0.0

    # Sanitiza números absurdos (ex.: '45894' vindo como CPL) — mantém o app no ar
    if not pd.isna(cpl_medio) and cpl_medio > 200:
        cpl_medio = min(cpl_medio, 200)

    return {
        "leads_total": format_number(leads),
        "cpl_medio": format_currency(cpl_medio),
        "meta_cpl": format_currency(cpl_meta),
        "investimento_total": format_currency(investimento),
        "roas": f"{_to_float(roas):.2f}" if not pd.isna(roas) else "—",
        "percentual_cpl": format_percent(pct_cpl, with_sign=True),
    }


# ==============================
# Outras páginas: origens, profissões, região, IA, projeção
# ==============================
def compute_origem_conversao(dfs: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Retorna:
      - tabela por origem/canal com métricas básicas
      - funil resumido (dict)
    Tolerante a falta de colunas/abas.
    """
    # Tenta achar aba provável
    origem_df = None
    for key in dfs.keys():
        if any(x in key.lower() for x in ["origem", "canal", "fonte", "source", "utm"]):
            origem_df = dfs[key].copy()
            break

    if origem_df is None or origem_df.empty:
        # Default seguro
        tabela = pd.DataFrame([
            {"origem": "Google Ads", "leads": 0, "cpl": 0.0},
            {"origem": "Meta Ads", "leads": 0, "cpl": 0.0},
        ])
        funil = {"impressoes": 0, "cliques": 0, "leads": 0, "vendas": 0, "taxa_conv": "0%"}
        return tabela, funil

    # Normaliza possíveis colunas
    cols = {c.lower(): c for c in origem_df.columns}
    origem_col = cols.get("origem") or cols.get("canal") or cols.get("fonte") or list(origem_df.columns)[0]
    leads_col = None
    for name in ["leads", "qtd_leads", "total_leads"]:
        if name in cols:
            leads_col = cols[name]
            break

    inv_col = None
    for name in ["investimento", "gasto", "spend", "custo"]:
        if name in cols:
            inv_col = cols[name]
            break

    tabela = origem_df.copy()
    tabela.rename(columns={origem_col: "origem"}, inplace=True)
    if leads_col and leads_col in tabela:
        tabela.rename(columns={leads_col: "leads"}, inplace=True)
    else:
        tabela["leads"] = 0

    if inv_col and inv_col in tabela:
        tabela["investimento"] = tabela[inv_col].apply(_to_float)
    else:
        tabela["investimento"] = 0.0

    tabela["cpl"] = tabela.apply(
        lambda r: (r["investimento"] / r["leads"]) if r["leads"] else 0.0, axis=1
    )

    # Funil simples
    funil = {
        "impressoes": 0,
        "cliques": 0,
        "leads": int(tabela["leads"].sum()),
        "vendas": 0,
        "taxa_conv": format_percent(0.0, with_sign=False),
    }
    return tabela, funil


def compute_profissao_canal(dfs: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Tabela por profissão x canal (default vazio se não houver dados)."""
    for key, df in dfs.items():
        if any(x in key.lower() for x in ["profissao", "profissão", "ocupacao", "ocupação"]):
            return df.copy()
    return pd.DataFrame(columns=["profissao", "canal", "leads", "cpl"])


def compute_analise_regional(dfs: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Retorna (estados, regioes) com métricas. Defaults vazios caso não existam."""
    estados = pd.DataFrame(columns=["uf", "leads", "cpl"])
    regioes = pd.DataFrame(columns=["regiao", "leads", "cpl"])
    for key, df in dfs.items():
        lk = key.lower()
        if "estado" in lk or "uf" in lk:
            estados = df.copy()
        if "regiao" in lk or "região" in lk:
            regioes = df.copy()
    return estados, regioes


def compute_insights_ia(dfs: Dict[str, pd.DataFrame]) -> List[Dict[str, str]]:
    """Lista de insights (texto). Mantém seguro se não houver dados."""
    return [
        {"titulo": "Aquisição eficiente", "descricao": "CPL atual dentro da meta em canais principais."},
        {"titulo": "Oportunidade regional", "descricao": "Aumentar orçamento em estados com CPL < média."},
    ]


def compute_projecao_resultados(dfs: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Projeções simples a partir do investimento atual."""
    # Tenta encontrar investimento/leads
    kpis = compute_kpis(dfs)
    investimento = _to_float(kpis.get("investimento_total", 0))
    cpl = _to_float(kpis.get("cpl_medio", 0))

    if pd.isna(investimento):
        investimento = 0.0
    if pd.isna(cpl) or cpl <= 0:
        cpl = 1.0

    # Projeção básica para próximos 7 dias
    dias = list(range(1, 8))
    leads_proj = [int((investimento / cpl) * (d / 7.0)) for d in dias]
    df = pd.DataFrame({"dia": dias, "leads_projetados": leads_proj})

    premissas = {
        "cpl_considerado": format_currency(cpl),
        "investimento_base": format_currency(investimento),
        "janela_dias": 7,
    }
    return df, premissas
