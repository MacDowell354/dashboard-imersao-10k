# -*- coding: utf-8 -*-
from __future__ import annotations

import io
import os
from datetime import datetime
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
import requests

# ------------------------------------------------------------
# Config
# ------------------------------------------------------------
DEFAULT_SHEET_ID = os.getenv("SHEETS_DOC_ID", "")

LOCAL_XLSX_CANDIDATES = [
    "./data/dados.xlsx",
    "./data/base.xlsx",
    "./dados.xlsx",
    "./base.xlsx",
]

# ------------------------------------------------------------
# Estado simples de sincronização e cache
# ------------------------------------------------------------
_LAST_SYNC = {"when": None, "source": None, "status": "never", "error": None}
_DFS_CACHE: Dict[str, pd.DataFrame] | None = None

def last_sync_info() -> Dict[str, str]:
    if not _LAST_SYNC["when"]:
        return {"when": "-", "source": "-", "status": "never", "error": ""}
    return {
        "when": _LAST_SYNC["when"],
        "source": _LAST_SYNC.get("source") or "-",
        "status": _LAST_SYNC.get("status") or "ok",
        "error": _LAST_SYNC.get("error") or "",
    }

# ------------------------------------------------------------
# Helpers pt-BR
# ------------------------------------------------------------
def _to_float_safe(v) -> float:
    if v is None or (isinstance(v, float) and (np.isnan(v))):
        return 0.0
    if isinstance(v, (int, float, np.integer, np.floating)):
        try:
            return float(v)
        except Exception:
            return 0.0
    s = str(v).strip()
    s = s.replace("R$", "").replace(" ", "")
    s = s.replace(".", "").replace(",", ".")  # 9.500 -> 9500 ; 12,34 -> 12.34
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
    n = _to_float_safe(v)
    s = f"{n:,.2f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")

def format_number(v) -> str:
    n = _to_int_safe(v)
    s = f"{n:,}"
    return s.replace(",", ".")

def format_percent(v, with_sign: bool = True) -> str:
    if v is None:
        return "0%"
    f = _to_float_safe(v)
    # aceita 0.12 ou 12 para 12%
    if f <= 1.0:
        f = f * 100.0
    sign = ""
    if with_sign and f != 0:
        sign = "+" if f > 0 else "−"
        f = abs(f)
    return f"{sign}{f:.0f}%"

# ------------------------------------------------------------
# Leitura planilha (Google Sheets público -> .xlsx) + fallback local
# ------------------------------------------------------------
def _download_gsheet_xlsx(doc_id: str) -> bytes:
    url = f"https://docs.google.com/spreadsheets/d/{doc_id}/export?format=xlsx"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.content

def _read_all_sheets_from_bytes(xlsx_bytes: bytes) -> Dict[str, pd.DataFrame]:
    xl = pd.ExcelFile(io.BytesIO(xlsx_bytes))
    dfs: Dict[str, pd.DataFrame] = {}
    for name in xl.sheet_names:
        df = xl.parse(name)
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

def get_dataframes(force_refresh: bool = False) -> Dict[str, pd.DataFrame]:
    global _DFS_CACHE

    # Cache simples na memória (invalida se force_refresh=True)
    if not force_refresh and _DFS_CACHE is not None:
        return _DFS_CACHE

    # 1) Google Sheets
    if DEFAULT_SHEET_ID:
        try:
            raw = _download_gsheet_xlsx(DEFAULT_SHEET_ID)
            dfs = _read_all_sheets_from_bytes(raw)
            _LAST_SYNC.update(
                when=datetime.utcnow().isoformat(),
                source=f"gsheet:{DEFAULT_SHEET_ID}",
                status="ok",
                error=None,
            )
            _DFS_CACHE = dfs
            return dfs
        except Exception as e:
            _LAST_SYNC.update(
                when=datetime.utcnow().isoformat(),
                source=f"gsheet:{DEFAULT_SHEET_ID}",
                status="error",
                error=str(e),
            )

    # 2) Local
    local = _try_local_xlsx()
    if local is not None:
        _DFS_CACHE = local
        return local

    # 3) Vazio (não quebra)
    _DFS_CACHE = {}
    return {}

# ------------------------------------------------------------
# KPIs
# ------------------------------------------------------------
def _find_sheet_by_candidates(dfs: Dict[str, pd.DataFrame], names: List[str]):
    lower_keys = {k.lower(): k for k in dfs.keys()}
    for candidate in names:
        for k_lower, real_key in lower_keys.items():
            if candidate.lower() in k_lower:
                return real_key, dfs[real_key]
    return None

def compute_kpis(dfs: Dict[str, pd.DataFrame]) -> Dict[str, str]:
    leads = 0
    investimento = 0.0
    cpl_meta_val = 15.0
    roas_val = 1.0
    perc_cpl_val = 0.0

    # 1) Tenta aba de KPIs
    kpi_hit = _find_sheet_by_candidates(dfs, ["kpi", "resumo", "geral"])
    if kpi_hit:
        _, dfk = kpi_hit

        def pick(df: pd.DataFrame, hints: List[str]):
            for c in df.columns:
                c_norm = str(c).strip().lower()
                for h in hints:
                    if h in c_norm:
                        return df[c].iloc[0]
            return None

        v_leads     = pick(dfk, ["lead", "qtd", "total"])
        v_inv       = pick(dfk, ["invest", "gasto", "spend", "custo total"])
        v_cpl_meta  = pick(dfk, ["meta cpl", "cpl meta"])
        v_roas      = pick(dfk, ["roas"])
        v_perc_cpl  = pick(dfk, ["percentual cpl", "% cpl", "var cpl"])

        leads = _to_int_safe(v_leads) if v_leads is not None else 0
        investimento = _to_float_safe(v_inv) if v_inv is not None else 0.0
        cpl_meta_val = _to_float_safe(v_cpl_meta) if v_cpl_meta is not None else cpl_meta_val
        roas_val = _to_float_safe(v_roas) if v_roas is not None else roas_val
        perc_cpl_val = _to_float_safe(v_perc_cpl) if v_perc_cpl is not None else perc_cpl_val

    # 2) Inferências simples
    if leads == 0:
        hit = _find_sheet_by_candidates(dfs, ["lead", "cadastro"])
        if hit:
            _, dfl = hit
            leads = len(dfl.index)

    if investimento == 0:
        hit = _find_sheet_by_candidates(dfs, ["invest", "mídia", "gasto", "ads", "facebook", "google"])
        if hit:
            _, dfi = hit
            for col in dfi.columns:
                if any(x in str(col).lower() for x in ["invest", "spend", "gasto", "custo"]):
                    investimento += _to_float_safe(dfi[col].sum())

    cpl_medio_val = (investimento / leads) if leads > 0 else 0.0
    if perc_cpl_val == 0.0 and cpl_meta_val > 0:
        perc_cpl_val = (cpl_medio_val / cpl_meta_val) - 1.0

    return {
        "leads_total": format_number(leads),
        "cpl_medio": format_currency(cpl_medio_val),
        "cpl_meta": format_currency(cpl_meta_val),
        "investimento_total": format_currency(investimento),
        "roas": f"{_to_float_safe(roas_val):.2f}",
        "perc_cpl": format_percent(perc_cpl_val, with_sign=True),
    }
