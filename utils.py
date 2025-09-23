# -*- coding: utf-8 -*-
import os, io, time, requests
import pandas as pd
from datetime import datetime

SHEET_ID = os.getenv("CHT22_SHEET_ID", "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT")
GVIZ_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={{sheet}}"
CACHE_SECONDS = int(os.getenv("CHT22_CACHE_SECONDS", "300"))

_tab_map = {
    "visao_geral": ["RESULTADOS"],
    "origem_conversao": ["BASE"],
    "profissao_canal": [" Base Prof Estado"],
    "analise_regional_regiao": ["Regiao"],
    "analise_regional_estado": ["Estado"],
}

_cache = {"dfs": None, "ts": 0, "last_ok": None}

def last_sync_info():
    if _cache["last_ok"]:
        return _cache["last_ok"].strftime("%d/%m/%Y %H:%M")
    return "—"

def _download_sheet(sheet_name: str) -> pd.DataFrame:
    try:
        url = GVIZ_URL.format(sheet=sheet_name)
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        df = pd.read_csv(io.BytesIO(resp.content))
        return df
    except Exception:
        return pd.DataFrame()

def get_dataframes(force_refresh=False):
    now = time.time()
    if not force_refresh and _cache["dfs"] is not None and now - _cache["ts"] < CACHE_SECONDS:
        return _cache["dfs"]

    dfs = {}
    for slug, names in _tab_map.items():
        for n in names:
            df = _download_sheet(n)
            if not df.empty:
                dfs[slug] = df
                break
    _cache["dfs"] = dfs
    _cache["ts"] = now
    _cache["last_ok"] = datetime.now()
    return dfs

# Helpers de formatação robustos
def format_number(v):
    if pd.isnull(v):
        return "0"
    try:
        if isinstance(v, str):
            v = v.replace(".", "").replace(",", ".")
        return f"{int(float(v)):,}".replace(",", ".")
    except Exception:
        return str(v)

def format_currency(v):
    if pd.isnull(v):
        return "R$ —"
    try:
        if isinstance(v, str):
            v = v.replace(".", "").replace(",", ".")
        v = float(v)
        return "R$ " + f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return f"R$ {v}"

def format_percent(v):
    if pd.isnull(v):
        return "—"
    try:
        if isinstance(v, str):
            v = v.replace(".", "").replace(",", ".")
        v = float(v)
        return f"{100*v:.1f}%".replace(".", ",")
    except Exception:
        return f"{v}%"

# Cálculos simplificados
def compute_kpis(dfs):
    df = dfs.get("visao_geral")
    if df is None or df.empty:
        return {"leads_total": "0", "cpl": "R$ —", "investimento": "R$ —", "roas": "—"}
    leads = df.iloc[0,1] if len(df.columns) > 1 else 0
    cpl = df.iloc[1,1] if len(df) > 1 else 0
    investimento = df.iloc[2,1] if len(df) > 2 else 0
    return {
        "leads_total": format_number(leads),
        "cpl": format_currency(cpl),
        "investimento": format_currency(investimento),
        "roas": "2.24"  # Placeholder até integrar coluna correta
    }

def compute_origem_conversao(dfs):
    df = dfs.get("origem_conversao", pd.DataFrame())
    return df, {"leads": 0, "conversoes": 0, "taxa": "—"}

def compute_profissao_canal(dfs):
    df = dfs.get("profissao_canal", pd.DataFrame())
    return df if not df.empty else pd.DataFrame()

def compute_analise_regional(dfs):
    return dfs.get("analise_regional_estado", pd.DataFrame()), dfs.get("analise_regional_regiao", pd.DataFrame())

def compute_insights_ia(dfs):
    return ["Insights automáticos baseados nos dados processados."]

def compute_projecao_resultados(dfs):
    proj = pd.DataFrame([{"mes": "M+1", "leads": "1000", "conversoes": "200", "receita": "R$ 50.000"}])
    premissas = {"crescimento_leads": "10%", "ticket_medio": "R$ 250"}
    return proj, premissas
