
# -*- coding: utf-8 -*-
import os, io, json, re, time, math, requests
from datetime import datetime
from typing import Dict, Tuple, List
import pandas as pd

# =========================
# CONFIGURAÇÕES CENTRAIS
# =========================
SHEET_ID = os.getenv("CHT22_SHEET_ID", "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT")
GVIZ_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={{sheet}}"
CACHE_SECONDS = int(os.getenv("CHT22_CACHE_SECONDS", "300"))

_TAB_MAP = {
    # slug -> nomes possíveis na planilha
    "visao_geral": ["Visão Geral", "Visao Geral", "visao_geral", "overview"],
    "origem_conversao": ["Origem e Conversão", "Origem e Conversao", "origem_conversao", "origem"],
    "profissao_canal": ["Profissão x Canal", "Profissao x Canal", "profissao_canal"],
    "analise_regional": ["Análise Regional", "Analise Regional", "analise_regional", "regional"],
    "insights_ia": ["Insights de IA", "Insights IA", "insights_ia"],
    "projecao_resultados": ["Projeção de Resultado", "Projecao de Resultado", "projecao_resultados"],
}

_ALIAS = {
    "data": ["data", "date", "dia", "Data"],
    "canal": ["canal", "origem", "source", "Canal"],
    "profissao": ["profissao", "profissão", "especialidade", "Profissão"],
    "regiao": ["regiao", "região", "Região"],
    "estado": ["estado", "uf", "Estado"],
    "leads": ["leads", "contatos", "cadastros", "Leads"],
    "conversoes": ["conversoes", "conversões", "vendas", "fechamentos", "Conversões"],
    "receita": ["receita", "faturamento", "valor", "Receita"],
    "custo": ["custo", "investimento", "ads_cost", "Custo"],
}

_cache = {"dfs": None, "ts": 0, "last_ok": None}

def last_sync_info():
    if _cache["last_ok"]:
        return _cache["last_ok"].strftime("%d/%m/%Y %H:%M")
    return "—"

def _find_col(df, key):
    for col in df.columns:
        low = str(col).strip().lower()
        if low in [a.lower() for a in _ALIAS.get(key, [])]:
            return col
    return None

def _download_sheet(sheet_names: List[str]) -> pd.DataFrame:
    err = {}
    for name in sheet_names:
        try:
            url = GVIZ_URL.format(sheet=name)
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            df = pd.read_csv(io.BytesIO(resp.content))
            if not df.empty:
                return df
        except Exception as e:
            err[name] = str(e)
    # nenhum encontrado
    return pd.DataFrame()

def get_dataframes(force_refresh: bool=False) -> Dict[str, pd.DataFrame]:
    now = time.time()
    if (not force_refresh) and _cache["dfs"] is not None and now - _cache["ts"] < CACHE_SECONDS:
        return _cache["dfs"]

    dfs = {}
    for slug, names in _TAB_MAP.items():
        df = _download_sheet(names)
        dfs[slug] = df

    _cache["dfs"] = dfs
    _cache["ts"] = now
    _cache["last_ok"] = datetime.now()
    return dfs

# ===============
# FORMATAÇÃO PT-BR
# ===============
def format_number_ptbr(x):
    try:
        return f"{int(x):,}".replace(",", ".")
    except:
        try:
            return f"{float(x):,.0f}".replace(",", "X").replace(".", ",").replace("X", ".")
        except:
            return str(x)

def format_percent_ptbr(v):
    try:
        return f"{100*float(v):.1f}%".replace(".", ",")
    except:
        return "—"

def format_currency_ptbr(v):
    try:
        return "R$ " + f"{float(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except:
        return "R$ —"

# =================
# CÁLCULOS / KPIs
# =================
def _as_date_series(df, col):
    s = pd.to_datetime(df[col], errors="coerce")
    return s

def compute_kpis(dfs: Dict[str, pd.DataFrame]):
    base = dfs.get("visao_geral") if dfs else None
    if base is None or base.empty:
        return {
            "leads_total": "0",
            "conversoes_total": "0",
            "taxa_conversao": "0,0%",
            "receita_total": "R$ —",
            "cpl": "R$ —",
        }
    # tentar detectar colunas
    leads_col = _find_col(base, "leads") or base.columns[0]
    conv_col  = _find_col(base, "conversoes") or base.columns[min(1, len(base.columns)-1)]
    receita_col = _find_col(base, "receita")
    custo_col = _find_col(base, "custo")

    leads = pd.to_numeric(base[leads_col], errors="coerce").fillna(0).sum()
    convs = pd.to_numeric(base[conv_col], errors="coerce").fillna(0).sum()
    receita = pd.to_numeric(base[receita_col], errors="coerce").fillna(0).sum() if receita_col in base.columns else 0
    custo = pd.to_numeric(base[custo_col], errors="coerce").fillna(0).sum() if custo_col in base.columns else None

    taxa = (convs / leads) if leads > 0 else 0
    cpl = (custo / leads) if (custo is not None and leads > 0) else None

    return {
        "leads_total": format_number_ptbr(leads),
        "conversoes_total": format_number_ptbr(convs),
        "taxa_conversao": format_percent_ptbr(taxa),
        "receita_total": format_currency_ptbr(receita),
        "cpl": format_currency_ptbr(cpl) if cpl is not None else "R$ —",
    }

def compute_origem_conversao(dfs: Dict[str, pd.DataFrame]):
    df = dfs.get("origem_conversao")
    if df is None or df.empty:
        return pd.DataFrame(), {
            "leads": 0, "conversoes": 0, "taxa": "0,0%"
        }
    canal = _find_col(df, "canal") or df.columns[0]
    leads = _find_col(df, "leads")
    convs = _find_col(df, "conversoes")

    # somar por canal
    grp = df.groupby(canal).agg(
        leads=(leads if leads else df.columns[1], "sum"),
        conversoes=(convs if convs else df.columns[min(2, len(df.columns)-1)], "sum")
    ).reset_index()

    grp["taxa"] = grp.apply(lambda r: (r["conversoes"]/r["leads"]) if r["leads"]>0 else 0, axis=1)
    grp["taxa_fmt"] = grp["taxa"].apply(format_percent_ptbr)
    grp["leads_fmt"] = grp["leads"].apply(format_number_ptbr)
    grp["conversoes_fmt"] = grp["conversoes"].apply(format_number_ptbr)

    funil = {
        "leads": int(grp["leads"].sum()),
        "conversoes": int(grp["conversoes"].sum()),
        "taxa": format_percent_ptbr( (grp["conversoes"].sum() / grp["leads"].sum()) if grp["leads"].sum() > 0 else 0 )
    }

    # tabela ordenada por conversões
    grp = grp[[canal, "leads_fmt", "conversoes_fmt", "taxa_fmt"]].rename(columns={canal: "canal"})
    return grp, funil

def compute_profissao_canal(dfs: Dict[str, pd.DataFrame]):
    df = dfs.get("profissao_canal")
    if df is None or df.empty:
        return pd.DataFrame()
    prof = _find_col(df, "profissao") or df.columns[0]
    canal = _find_col(df, "canal") or df.columns[min(1, len(df.columns)-1)]
    convs = _find_col(df, "conversoes")

    grp = df.groupby([prof, canal]).agg(conversoes=(convs if convs else df.columns[-1], "sum")).reset_index()
    grp = grp.sort_values("conversoes", ascending=False)
    grp["conversoes_fmt"] = grp["conversoes"].apply(format_number_ptbr)
    return grp.rename(columns={prof: "profissao", canal: "canal"})[["profissao","canal","conversoes_fmt"]]

def compute_analise_regional(dfs: Dict[str, pd.DataFrame]):
    df = dfs.get("analise_regional")
    if df is None or df.empty:
        return pd.DataFrame(), pd.DataFrame()
    estado = _find_col(df, "estado") or df.columns[0]
    regiao = _find_col(df, "regiao")
    leads = _find_col(df, "leads")
    convs = _find_col(df, "conversoes")

    by_estado = df.groupby(estado).agg(
        leads=(leads if leads else df.columns[min(1,len(df.columns)-1)], "sum"),
        conversoes=(convs if convs else df.columns[min(2,len(df.columns)-1)], "sum"),
    ).reset_index()
    by_estado["taxa"] = by_estado.apply(lambda r: (r["conversoes"]/r["leads"]) if r["leads"]>0 else 0, axis=1)
    by_estado["leads_fmt"] = by_estado["leads"].apply(format_number_ptbr)
    by_estado["conversoes_fmt"] = by_estado["conversoes"].apply(format_number_ptbr)
    by_estado["taxa_fmt"] = by_estado["taxa"].apply(format_percent_ptbr)
    by_estado = by_estado.rename(columns={estado: "estado"})[["estado","leads_fmt","conversoes_fmt","taxa_fmt"]]

    if regiao and regiao in df.columns:
        by_regiao = df.groupby(regiao).agg(
            leads=(leads if leads else df.columns[min(1,len(df.columns)-1)], "sum"),
            conversoes=(convs if convs else df.columns[min(2,len(df.columns)-1)], "sum"),
        ).reset_index()
        by_regiao["taxa"] = by_regiao.apply(lambda r: (r["conversoes"]/r["leads"]) if r["leads"]>0 else 0, axis=1)
        by_regiao["leads_fmt"] = by_regiao["leads"].apply(format_number_ptbr)
        by_regiao["conversoes_fmt"] = by_regiao["conversoes"].apply(format_number_ptbr)
        by_regiao["taxa_fmt"] = by_regiao["taxa"].apply(format_percent_ptbr)
        by_regiao = by_regiao.rename(columns={regiao: "regiao"})[["regiao","leads_fmt","conversoes_fmt","taxa_fmt"]]
    else:
        by_regiao = pd.DataFrame(columns=["regiao","leads_fmt","conversoes_fmt","taxa_fmt"])

    return by_estado, by_regiao

def compute_insights_ia(dfs: Dict[str, pd.DataFrame]):
    # Heurísticas simples de insights (sem dependência externa)
    insights = []
    k = compute_kpis(dfs)
    insights.append(f"Taxa de conversão geral: {k['taxa_conversao']} com {k['conversoes_total']} fechamentos sobre {k['leads_total']} leads.")

    tabela, funil = compute_origem_conversao(dfs)
    if not tabela.empty:
        top = tabela.sort_values("conversoes_fmt", ascending=False).head(1).to_dict(orient="records")[0]
        insights.append(f"Melhor canal em fechamentos: {top['canal']} (conversões {top['conversoes_fmt']}).")
        insights.append(f"Funil geral indica taxa de {funil['taxa']} do topo (leads {funil['leads']}) ao fundo (conversões {funil['conversoes']}).")

    prof = compute_profissao_canal(dfs)
    if not prof.empty:
        linha = prof.iloc[0]
        insights.append(f"Profissão com maior conversão por canal: {linha['profissao']} no canal {linha['canal']} (conversões {linha['conversoes_fmt']}).")

    return insights

def compute_projecao_resultados(dfs: Dict[str, pd.DataFrame]):
    # Projeção simples: manter taxa de conversão média e crescer leads +X%
    base = dfs.get("visao_geral")
    if base is None or base.empty:
        return pd.DataFrame(columns=["mes","leads","conversoes","receita"]), {"crescimento_leads":"10%", "ticket_medio":"R$ —"}

    leads_col = _find_col(base, "leads") or base.columns[0]
    conv_col  = _find_col(base, "conversoes") or base.columns[min(1, len(base.columns)-1)]
    receita_col = _find_col(base, "receita")

    leads = pd.to_numeric(base[leads_col], errors="coerce").fillna(0).sum()
    convs = pd.to_numeric(base[conv_col], errors="coerce").fillna(0).sum()
    taxa = (convs / leads) if leads>0 else 0
    receita_total = pd.to_numeric(base[receita_col], errors="coerce").fillna(0).sum() if receita_col in base.columns else 0
    ticket = (receita_total / convs) if convs>0 else 0

    crescimento = 0.10  # 10%
    meses = ["M+1","M+2","M+3"]
    rows = []
    for i, m in enumerate(meses, start=1):
        leads_proj = int(leads * ((1 + crescimento) ** i) / 3)  # distribuir por 3 meses
        convs_proj = int(leads_proj * taxa)
        receita_proj = convs_proj * ticket
        rows.append({"mes": m,
                     "leads": format_number_ptbr(leads_proj),
                     "conversoes": format_number_ptbr(convs_proj),
                     "receita": format_currency_ptbr(receita_proj)})

    premissas = {
        "crescimento_leads": "10%",
        "taxa_conversao_base": format_percent_ptbr(taxa),
        "ticket_medio": format_currency_ptbr(ticket),
    }
    return pd.DataFrame(rows), premissas
