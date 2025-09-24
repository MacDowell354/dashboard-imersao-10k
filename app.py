# app.py
from __future__ import annotations

import os
from datetime import datetime
from typing import Dict, Any

from flask import Flask, render_template, request

app = Flask(__name__)

# =========================================================
# Filtros Jinja usados nos templates
# =========================================================
def moeda_ptbr(valor) -> str:
    try:
        v = float(valor or 0)
    except (TypeError, ValueError):
        v = 0.0
    s = f"{v:,.2f}"
    # 1.000.000,00
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")

def numero_ptbr(valor) -> str:
    try:
        v = float(valor or 0)
    except (TypeError, ValueError):
        v = 0.0
    s = f"{v:,.0f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ",")

def pct(valor, digits: int = 1) -> str:
    try:
        v = float(valor or 0)
    except (TypeError, ValueError):
        v = 0.0
    txt = f"{v:.{digits}f}%"
    return txt.replace(".", ",")

app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr
app.jinja_env.filters["pct"] = pct

# =========================================================
# Estruturas padrão (evitam 'Undefined' nos templates)
# =========================================================
def _safe_div(a, b) -> float:
    try:
        a = float(a or 0)
        b = float(b or 0)
        return a / b if b else 0.0
    except (TypeError, ValueError):
        return 0.0

def _skeleton_dados() -> Dict[str, Any]:
    canal_zero = {"leads": 0, "investimento": 0.0, "cpl": 0.0, "roas": 0.0, "percentual": 0.0}
    prof_zero = {"total": 0, "percentual": 0.0}
    reg_zero  = {"percentual": 0.0}

    return {
        # metas/visão geral
        "meta_cpl": 15.0,
        "orcamento_total": 0.0,
        "investimento_total": 0.0,
        "roas_geral": 0.0,

        # projeção/vendas
        "meta_leads": 0,
        "taxa_conversao": 2.0,          # %
        "ticket_curso": 297.0,
        "ticket_mentoria": 1500.0,
        "perc_vendas_mentoria": 10.0,   # %

        # canais
        "canais": {
            "facebook":  canal_zero.copy(),
            "instagram": canal_zero.copy(),
            "youtube":   canal_zero.copy(),
            "google":    canal_zero.copy(),
            "email":     canal_zero.copy(),
        },

        # profissões (todas que os templates citam)
        "profissoes": {
            "dentista":       prof_zero.copy(),
            "psicologo":      prof_zero.copy(),
            "fisioterapeuta": prof_zero.copy(),
            "nutricionista":  prof_zero.copy(),
            "medico":         prof_zero.copy(),
            "outra":          prof_zero.copy(),
        },

        # regiões/estados
        "regioes": {
            "sudeste":      reg_zero.copy(),
            "sul":          reg_zero.copy(),
            "nordeste":     reg_zero.copy(),
            "centro_oeste": reg_zero.copy(),
            "norte":        reg_zero.copy(),
        },
        "estados": {
            "SP": {"total": 0}, "RJ": {"total": 0}, "MG": {"total": 0}, "ES": {"total": 0},
            "PR": {"total": 0}, "RS": {"total": 0}, "SC": {"total": 0},
            "BA": {"total": 0}, "PE": {"total": 0}, "CE": {"total": 0},
            "DF": {"total": 0},
        },
    }

def _make_extras(dados: Dict[str, Any]) -> Dict[str, Any]:
    orc_usado_pct = _safe_div(dados.get("investimento_total", 0), dados.get("orcamento_total", 0)) * 100
    return {
        "periodo": "01/09/2025 - 23/09/2025",
        "dias": 23,
        "status": "Campanha Ativa",
        "ultima_atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "percentual_cpl_formatado": pct(orc_usado_pct, 1),
        "orcamento_usado_pct": orc_usado_pct,
    }

def _ctx() -> Dict[str, Any]:
    # >>> Se quiser puxar da planilha, preencha 'dados' aqui. <<<
    dados = _skeleton_dados()
    extras = _make_extras(dados)
    return {"dados": dados, "extras": extras}

# Mantém compatibilidade com chamadas antigas
def carregar_dados_visao_geral() -> Dict[str, Any]:
    return _ctx()

# =========================================================
# Injeções globais (sempre disponíveis no template)
# =========================================================
@app.context_processor
def inject_globals():
    # se alguma rota esquecer de mandar 'extras', este aqui garante o mínimo
    base = _ctx()
    return {
        "current_path": request.path,
        "extras": base["extras"],
        # NÃO injetamos 'dados' aqui pra não pisar em dados reais quando houver.
    }

# =========================================================
# Rotas
# =========================================================
@app.route("/")
@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())

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

@app.route("/healthz")
def healthz():
    return {"ok": True, "ts": datetime.now().isoformat()}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
