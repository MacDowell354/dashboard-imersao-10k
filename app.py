# app.py
import os
from datetime import datetime
from flask import Flask, render_template, request

# -----------------------------
# Filtros Jinja
# -----------------------------
def moeda_ptbr(value):
    """Formata número como moeda brasileira: R$ 1.234,56 (tolera None/strings)."""
    try:
        v = float(value or 0)
    except Exception:
        v = 0.0
    s = f"{v:,.2f}"
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"

def pct_br(value, ndigits=0):
    """Formata percentual no padrão brasileiro. Ex.: 0.1234 -> 12,34%"""
    try:
        v = float(value or 0) * 100
    except Exception:
        v = 0.0
    try:
        nd = int(ndigits or 0)
    except Exception:
        nd = 0
    s = f"{v:.{nd}f}".replace(".", ",")
    return f"{s}%"

# -----------------------------
# App
# -----------------------------
app = Flask(__name__)

# Disponibiliza datetime nos templates
app.jinja_env.globals.update(datetime=datetime)

# Registra filtros
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["pct_br"] = pct_br

# -----------------------------
# Contexto seguro p/ templates
# -----------------------------
def _dados_padrao():
    """Estrutura mínima com TODAS as chaves usadas nos templates, com defaults seguros."""
    return {
        # Visão Geral
        "roas_geral": 0.0,
        "meta_cpl": 0.0,

        # Canais (usados em várias abas)
        "canais": {
            "facebook":   {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
            "instagram":  {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
            "youtube":    {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
            "email":      {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},  # apareceu em erro
            "google_ads": {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},  # segurança extra
        },

        # Profissões (usadas em /profissao-canal e /insights-ia)
        "profissoes": {
            "psicologo":      {"total": 0, "percentual": 0.0},
            "fisioterapeuta": {"total": 0, "percentual": 0.0},
            "professor":      {"total": 0, "percentual": 0.0},
            "outra":          {"total": 0, "percentual": 0.0},
        },
    }

def carregar_dados_visao_geral():
    """
    Retorna um contexto completo e à prova de falhas para renderização dos templates.
    (Depois você pode preencher esses valores com a planilha sem quebrar nada.)
    """
    dados = _dados_padrao()

    # 'extras' é referenciado na Visão Geral
    extras = {
        "percentual_cpl_formatado": "-",  # string segura, até virmos com valor real
    }

    return {
        "dados": dados,
        "extras": extras,
        "current_path": request.path,  # usado no _nav.html
    }

# -----------------------------
# Rotas
# -----------------------------
@app.route("/")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())

@app.route("/origem-conversao")
def origem_conversao():
    return render_template("origem_conversao_atualizada.html", **carregar_dados_visao_geral())

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html", **carregar_dados_visao_geral())

@app.route("/insights-ia")
def insights_ia():
    return render_template("insights_ia_atualizada.html", **carregar_dados_visao_geral())

# -----------------------------
# Main (dev local)
# -----------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
