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


def _read_all_sheets_from_xlsx_bytes(content: bytes) -> Dict[str, pd.DataFra]()
