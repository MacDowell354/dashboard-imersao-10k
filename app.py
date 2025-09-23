# app.py  — versão unificada das rotas e contexto
# -----------------------------------------------
from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from typing import Any, Dict

import math
import re

from flask import Flask, render_template, request

# Importa utilitários do projeto (se não estiverem disponíveis em algum deploy,
# o app mantém defaults para não quebrar as páginas)
try:
    from utils import get_dataframes, compute_kpis  # type: ignore
except Exception:  # pragma: no cover
    get_dataframes = None  # type: ignore
    compute_kpis = None  # type: ignore


app = Flask(__name__)


# =========================
# Filtros Jinja (formatação)
# =========================

def _to_number(val: Any) -> float:
    """
    Converte valores como '9.500' ou '1,23' para float de forma tolerante.
    """
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    if not s:
        return 0.0
    # remove separador de milhar (.) e troca vírgula por ponto
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


def moeda_ptbr(value: Any) -> str:
    """
    Formata moeda no padrão brasileiro: R$ 1.234,56
    Aceita float/int ou strings como '1234.56', '1.234,56', etc.
    """
    n = _to_number(value)
    negativo = n < 0
    n = abs(n)
    inteiro = int(math.floor(n))
    centavos = int(round((n - inteiro) * 100))
    # formata milhar com ponto
    inteiro_format = f"{inteiro:,}".replace(",", ".")
    return f"{'-' if negativo else ''}R$ {inteiro_format},{centavos:02d}"


def numero_ptbr(value: Any) -> str:
    """
    Formata número inteiro com separador de milhar: 12.345
    """
    n = int(round(_to_number(value)))
    return f"{n:,}".replace(",", ".")


app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr


# ==============================
# Defaults seguros para o layout
# ==============================

DEFAULT_DADOS: Dict[str, Any] = {
    # Período/campanha
    "dias_campanha": 0,
    "data_inicio": "01/09/2025",
    "data_fim": "23/09/2025",

    # Leads e metas
    "total_leads": 0,
    "total_leads_formatado": "0",
    "meta_leads": 0,
    "meta_leads_formatado": "0",

    # CPL
    "cpl_medio": 0.0,
    "cpl_medio_formatado": "R$ 0,00",
    "meta_cpl": 15.0,
    "meta_cpl_formatado": "R$ 15,00",

    # Orçamento/investimento
    "orcamento_total": 0.0,
    "orcamento_total_formatado": "R$ 0,00",
    "investimento_total": 0.0,
    "investimento_total_formatado": "R$ 0,00",

    # ROAS
    "roas_geral": 0.0,

    # Conversão/vendas
    "conversao": {
        "taxa_conversao": 2.0,  # %
        "vendas_estimadas": 0,
        "ticket_medio_curso": 297.0,
        "receita_estimada_curso": 0.0,
        "percentual_mentorias": 10,  # %
        "ticket_medio_mentoria": 1500.0,
        "receita_estimada_mentoria": 0.0,
    },

    # Canais — todos os usados nos templates precisam existir aqui
    "canais": {
        "facebook":  {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
        "youtube":   {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
        "instagram": {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
        # ✅ item necessário para não quebrar origem_conversao_atualizada.html
        "google":    {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
    },

    # Engajamento/social
    "engajamento": {
        "seguidores_instagram": 0,
        "taxa_crescimento_instagram": 0,
        "seguidores_youtube": 0,
        "taxa_crescimento_youtube": 0,
    },

    # Distribuição regional (para analise_regional_atualizada.html)
    "regioes": {
        "sudeste":      {"percentual": 0.0, "leads_formatado": "0"},
        "sul":          {"percentual": 0.0, "leads_formatado": "0"},
        "nordeste":     {"percentual": 0.0, "leads_formatado": "0"},
        "centro_oeste": {"percentual": 0.0, "leads_formatado": "0"},
        "norte":        {"percentual": 0.0, "leads_formatado": "0"},
    },
}

def _pct(a: Any, b: Any, default_when_zero_b: float = 0.0) -> float:
    x = _to_number(a)
    y = _to_number(b)
    if y == 0:
        return default_when_zero_b
    return (x / y) * 100.0


def _fmt_pct(val: float) -> str:
    # Usa 1 casa decimal e vírgula
    return f"{val:.1f}".replace(".", ",") + "%"


def _deep_update(base: Dict[str, Any], extra: Dict[str, Any]) -> Dict[str, Any]:
    out = deepcopy(base)
    for k, v in extra.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_update(out[k], v)
        else:
            out[k] = v
    return out


# ============================
# Contexto único para as views
# ============================

def _ctx() -> Dict[str, Any]:
    """
    Monta o contexto usado por TODAS as páginas.
    - Tenta carregar dataframes e KPIs reais via utils (se disponível).
    - Garante defaults para não quebrar templates.
    """
    dados = deepcopy(DEFAULT_DADOS)

    # Tenta ler dados reais (se utils existir)
    dfs = None
    if callable(get_dataframes):
        try:
            # assinatura sem kwargs para evitar erros de compatibilidade
            dfs = get_dataframes()  # type: ignore
        except Exception:
            dfs = None

    if callable(compute_kpis) and dfs is not None:
        try:
            kpis = compute_kpis(dfs)  # type: ignore
        except Exception:
            kpis = {}
    else:
        kpis = {}

    # Se o seu compute_kpis já retorna estrutura pronta para os templates,
    # você pode fazer um merge profundo aqui. Mantemos os defaults para
    # qualquer chave ausente, evitando 500 em produção.
    if isinstance(kpis, dict) and kpis:
        # Integra alguns campos comuns (se existirem no retorno)
        m: Dict[str, Any] = {}

        # Exemplos de mapeamento leve (não obrigatório — mantém se existir):
        for key in [
            "total_leads", "total_leads_formatado",
            "meta_leads", "meta_leads_formatado",
            "cpl_medio", "cpl_medio_formatado",
            "meta_cpl", "meta_cpl_formatado",
            "orcamento_total", "orcamento_total_formatado",
            "investimento_total", "investimento_total_formatado",
            "roas_geral",
            # estruturas aninhadas
            "conversao", "canais", "engajamento", "regioes",
            "dias_campanha", "data_inicio", "data_fim",
        ]:
            if key in kpis:
                m[key] = kpis[key]

        dados = _deep_update(dados, m)

    # -------- EXTRAS derivados para o layout --------
    extras = {}

    # % orçamento usado
    pct_orc = _pct(dados.get("investimento_total"), dados.get("orcamento_total"), 0.0)
    extras["percentual_orcamento"] = pct_orc
    extras["percentual_orcamento_formatado"] = _fmt_pct(pct_orc)

    # % de leads vs meta (se meta 0, convencionamos 100%)
    meta_leads = _to_number(dados.get("meta_leads"))
    pct_leads = _pct(dados.get("total_leads"), meta_leads, 100.0 if meta_leads == 0 else 0.0)
    extras["percentual_leads"] = pct_leads
    extras["percentual_leads_formatado"] = _fmt_pct(pct_leads)

    # % do CPL vs meta (se meta 0, 0%)
    meta_cpl = _to_number(dados.get("meta_cpl"))
    pct_cpl = _pct(dados.get("cpl_medio"), meta_cpl, 0.0)
    extras["percentual_cpl"] = pct_cpl
    extras["percentual_cpl_formatado"] = _fmt_pct(pct_cpl)

    # Timestamp para "Última atualização"
    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    return {
        "dados": dados,
        "extras": extras,
        "kpis": kpis,
        "timestamp": timestamp,
    }


# ==========
# Rotas / UI
# ==========

@app.route("/")
def home() -> str:
    # Redireciona mentalmente para a visão geral (render direto)
    return render_template("visao_geral_atualizada.html", **_ctx())


@app.route("/visao-geral")
def visao_geral() -> str:
    return render_template("visao_geral_atualizada.html", **_ctx())


@app.route("/dashboard")
def dashboard() -> str:
    return render_template("dashboard_atualizado.html", **_ctx())


@app.route("/insights-ia")
def insights_ia() -> str:
    return render_template("insights_ia_atualizada.html", **_ctx())


@app.route("/origem-conversao")
def origem_conversao() -> str:
    return render_template("origem_conversao_atualizada.html", **_ctx())


@app.route("/profissao-canal")
def profissao_canal() -> str:
    return render_template("profissao_canal_atualizada.html", **_ctx())


@app.route("/projecao-resultados")
def projecao_resultados() -> str:
    return render_template("projecao_resultados_atualizada.html", **_ctx())


@app.route("/analise-regional")
def analise_regional() -> str:
    return render_template("analise_regional_atualizada.html", **_ctx())


@app.route("/vendas")
def vendas() -> str:
    # wrapper de vendas_content.html
    return render_template("vendas.html", **_ctx())


# -----------
# Main (WSGI)
# -----------

if __name__ == "__main__":  # pragma: no cover
    # Útil para rodar localmente: python app.py
    app.run(host="0.0.0.0", port=10000, debug=True)
