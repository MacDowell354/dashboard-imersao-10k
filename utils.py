# app.py
from __future__ import annotations

import os
from datetime import datetime
from typing import Dict, Any

from flask import Flask, render_template, request

app = Flask(__name__)

# ----------------------------
# Filtros Jinja (moeda/numero/pct)
# ----------------------------
def moeda_ptbr(valor) -> str:
    try:
        v = float(valor or 0)
    except (TypeError, ValueError):
        v = 0.0
    s = f"{v:,.2f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")

def numero_ptbr(valor) -> str:
    try:
        v = float(valor or 0)
    except (TypeError, ValueError):
        v = 0.0
    s = f"{v:,.0f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")

def pct(valor, digits: int = 1) -> str:
    try:
        v = float(valor or 0)
    except (TypeError, ValueError):
        v = 0.0
    fmt = f"{{:.{digits}f}}%".format(v)
    return fmt.replace(".", ",")

app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr
app.jinja_env.filters["pct"] = pct

# ----------------------------
# Injeção global p/ _nav.html e datas
# ----------------------------
@app.context_processor
def inject_globals():
    return {
        "current_path": request.path,
    }

# ----------------------------
# Helpers
# ----------------------------
def _safe_div(a, b) -> float:
    try:
        a = float(a or 0)
        b = float(b or 0)
        return a / b if b != 0 else 0.0
    except (TypeError, ValueError):
        return 0.0

def _skeleton_dados() -> Dict[str, Any]:
    """Estrutura completa esperada pelos templates, com valores-padrão seguros."""
    canal_zero = {"leads": 0, "investimento": 0.0, "cpl": 0.0, "roas": 0.0, "percentual": 0.0}
    prof_zero = {"total": 0, "percentual": 0.0}
    reg_zero  = {"percentual": 0.0}

    return {
        # KPIs gerais
        "meta_cpl": 15.0,
        "orcamento_total": 0.0,
        "investimento_total": 0.0,
        "roas_geral": 0.0,

        # Metas/conversão/vendas
        "meta_leads": 0,
        "taxa_conversao": 2.0,  # %
        "ticket_curso": 297.0,
        "ticket_mentoria": 1500.0,
        "perc_vendas_mentoria": 10.0,  # %

        # Canais
        "canais": {
            "facebook": canal_zero.copy(),
            "instagram": canal_zero.copy(),
            "youtube": canal_zero.copy(),
            "google": canal_zero.copy(),
            "email": canal_zero.copy(),
        },

        # Profissões
        "profissoes": {
            "dentista": prof_zero.copy(),
            "psicologo": prof_zero.copy(),
            "fisioterapeuta": prof_zero.copy(),
            "nutricionista": prof_zero.copy(),
            "medico": prof_zero.copy(),
            "outra": prof_zero.copy(),
        },

        # Regiões e estados (apenas alguns para não quebrar loops)
        "regioes": {
            "sudeste": reg_zero.copy(),
            "sul": reg_zero.copy(),
            "nordeste": reg_zero.copy(),
            "centro_oeste": reg_zero.copy(),
            "norte": reg_zero.copy(),
        },
        "estados": {
            "SP": {"total": 0},
            "RJ": {"total": 0},
            "MG": {"total": 0},
            "ES": {"total": 0},
            "PR": {"total": 0},
            "RS": {"total": 0},
            "SC": {"total": 0},
            "BA": {"total": 0},
            "PE": {"total": 0},
            "CE": {"total": 0},
            "DF": {"total": 0},
        },
    }

def _extras_from(dados: Dict[str, Any]) -> Dict[str, Any]:
    orc_usado_pct = _safe_div(dados.get("investimento_total", 0), dados.get("orcamento_total", 0)) * 100.0
    return {
        "periodo": "01/09/2025 - 23/09/2025",
        "dias": 23,
        "status": "Campanha Ativa",
        "ultima_atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        # usado por visao_geral.html
        "percentual_cpl_formatado": pct(orc_usado_pct, 1),  # ex.: "76,7%"
        "orcamento_usado_pct": orc_usado_pct,
    }

def _ctx() -> Dict[str, Any]:
    """
    Contexto único para todas as páginas.
    Se no futuro você carregar valores reais da planilha, é só popular `dados`
    antes de montar `extras` – o resto dos templates continua funcionando.
    """
    dados = _skeleton_dados()

    # >>> Lugar certo para sobrepor 'dados' com números reais da planilha, se/quando desejar <<<
    # Exemplo (quando tiver o dicionário com valores da planilha):
    # dados["orcamento_total"] = planilha["orcamento_total"]
    # dados["canais"]["facebook"]["investimento"] = planilha["invest_fb"]
    # ... etc.

    extras = _extras_from(dados)
    return {"dados": dados, "extras": extras}

# ----------------------------
# Rotas
# ----------------------------
@app.route("/")
@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard_atualizado.html", **_ctx())

@app.route("/origem-conversao")
def origem_conversao():
    return render_template("origem_conversao_atualizada.html", **_ctx())

@app.route("/insights-ia")
def insights_ia():
    return render_template("insights_ia_atualizada.html", **_ctx())

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html", **_ctx())

@app.route("/projecao-resultados")
def projecao_resultados():
    return render_template("projecao_resultados_atualizada.html", **_ctx())

@app.route("/analise-regional")
def analise_regional():
    return render_template("analise_regional_atualizada.html", **_ctx())

@app.route("/vendas")
def vendas():
    return render_template("vendas.html", **_ctx())

# Healthcheck opcional
@app.route("/healthz")
def healthz():
    return {"ok": True, "ts": datetime.now().isoformat()}

# --------------
# WSGI
# --------------
if __name__ == "__main__":
    # Execução local
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
