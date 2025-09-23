# -*- coding: utf-8 -*-
from __future__ import annotations

import os
import re
from datetime import datetime
from typing import Dict, Any

import pandas as pd

# -------------------- Parsing numérico robusto (pt-BR e en-US) --------------------
def _to_float_safe(v) -> float:
    if v is None:
        return 0.0
    if isinstance(v, (int, float)):
        try:
            # trata NaN como 0
            return float(0.0 if pd.isna(v) else v)
        except Exception:
            return float(v)

    s = str(v).strip()
    if s == "":
        return 0.0

    # Remove símbolos comuns de moeda/espacos
    s = re.sub(r"[^\d,.\-]", "", s)

    # Caso com '.' e ',' -> assume pt-BR: '.' milhar, ',' decimal
    if "." in s and "," in s:
        s = s.replace(".", "").replace(",", ".")
    else:
        # Só vírgula: decimal em pt-BR
        if "," in s and "." not in s:
            s = s.replace(",", ".")
        # Só ponto: pode ser milhar (ex.: '9.500')
        elif s.count(".") == 1:
            left, right = s.split(".")
            if len(right) == 3 and right.isdigit():
                # Provável milhar
                s = left + right

    try:
        return float(s)
    except Exception:
        # fallback agressivo
        s2 = re.sub(r"[^0-9.\-]", "", s)
        if s2.count(".") > 1:
            head = s2[:-1].replace(".", "")
            s2 = head + s2[-1]
        try:
            return float(s2)
        except Exception:
            return 0.0

# -------------------- Formatações pt-BR --------------------
def format_number(v) -> str:
    n = int(round(_to_float_safe(v)))
    return f"{n:,}".replace(",", ".")

def format_currency(v, prefix: str = "R$ ") -> str:
    x = _to_float_safe(v)
    inteiro = int(abs(x))
    cent = int(round((abs(x) - inteiro) * 100))
    s = f"{inteiro:,}".replace(",", ".") + "," + f"{cent:02d}"
    return f"-{prefix}{s}" if x < 0 else f"{prefix}{s}"

def format_percent(v, with_sign: bool = False, decimals: int = 1) -> str:
    x = _to_float_safe(v)
    # Se vier em razão (0..1), vira percent; se já for percent (ex.: 43), mantém
    if abs(x) <= 1.5:
        x *= 100.0
    s = f"{x:.{decimals}f}".replace(".", ",") + "%"
    if with_sign:
        if x > 0:
            s = "+" + s
        elif x < 0:
            s = "–" + s  # en-dash
    return s

def last_sync_info() -> str:
    return datetime.now().strftime("%d/%m/%Y %H:%M:%S")

# -------------------- Carregamento de dados com cache --------------------
_CACHE: Dict[str, pd.DataFrame] = {}

def _read_csv_if_exists(path: str) -> pd.DataFrame:
    if os.path.exists(path):
        try:
            return pd.read_csv(path)
        except Exception:
            return pd.DataFrame()
    return pd.DataFrame()

def get_dataframes(force_refresh: bool = False) -> Dict[str, pd.DataFrame]:
    """
    Lê datasets de ./data (se existirem). Usa cache simples em memória.
    Aceita force_refresh=True para recarregar.
    Esperados (opcional): leads.csv, investimentos.csv, receitas.csv
    """
    global _CACHE
    if _CACHE and not force_refresh:
        return _CACHE

    base = os.environ.get("DATA_DIR", "data")
    dfs: Dict[str, pd.DataFrame] = {
        "leads": _read_csv_if_exists(os.path.join(base, "leads.csv")),
        "investimentos": _read_csv_if_exists(os.path.join(base, "investimentos.csv")),
        "receitas": _read_csv_if_exists(os.path.join(base, "receitas.csv")),
    }

    _CACHE = dfs
    return dfs

# -------------------- KPIs mínimos robustos --------------------
def _sum_cols(df: pd.DataFrame, colnames: list[str]) -> float:
    if df is None or df.empty:
        return 0.0
    for c in colnames:
        if c in df.columns:
            return float(pd.to_numeric(df[c], errors="coerce").fillna(0).sum())
    # se não achar col conhecida, tenta qualquer coluna numérica
    num = df.select_dtypes(include=["number"])
    return float(num.sum().sum()) if not num.empty else 0.0

def compute_kpis(dfs: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
    leads_df = dfs.get("leads", pd.DataFrame())
    inv_df = dfs.get("investimentos", pd.DataFrame())
    rec_df = dfs.get("receitas", pd.DataFrame())

    # LEADS: prioridade por colunas usuais; senão, usa contagem de linhas.
    leads_total = 0.0
    if not leads_df.empty:
        for col in ("leads", "qtde", "qtd", "quantidade"):
            if col in leads_df.columns:
                leads_total = float(pd.to_numeric(leads_df[col], errors="coerce").fillna(0).sum())
                break
        else:
            leads_total = float(len(leads_df))

    investimento_total = _sum_cols(inv_df, ["investimento", "valor", "spend", "gasto"])
    receita_total = _sum_cols(rec_df, ["receita", "faturamento", "revenue", "valor"])

    cpl_meta = 15.0  # meta default; altere se tiver fonte de dados
    cpl_medio = (investimento_total / leads_total) if leads_total > 0 else 0.0
    roas = (receita_total / investimento_total) if investimento_total > 0 else 0.0

    # variação do CPL vs meta (formato pronto p/ frontend)
    perc_cpl = (
        format_percent((cpl_medio / cpl_meta) - 1.0, with_sign=True)
        if cpl_meta > 0 else "0%"
    )

    return {
        "leads_total": leads_total,
        "investimento_total": investimento_total,
        "cpl_medio": cpl_medio,
        "cpl_meta": cpl_meta,
        "roas": roas,
        "perc_cpl": perc_cpl,
    }
