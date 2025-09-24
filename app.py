# app.py
import os
from datetime import datetime
from flask import Flask, render_template, request

# -----------------------------
# Helpers / Filtros do Jinja
# -----------------------------
def moeda_ptbr(value):
    """Formata número como moeda brasileira: R$ 1.234,56 (tolera None/strings)."""
    try:
        v = float(value or 0)
    except Exception:
        v = 0.0
    # formata como 1,234.56 e troca separadores para pt-BR
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

# Disponibiliza datetime dentro dos templates Jinja (corrige o erro 'datetime is undefined')
app.jinja_env.globals.update(datetime=datetime)

# Registra filtros usados nos templates (corrige 'No filter named moeda_ptbr')
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["pct_br"] = pct_br

# -----------------------------
# Carga de dados (mínima e à prova de falhas)
# -----------------------------
def carregar_dados_visao_geral():
    """
    Retorna o contexto mínimo necessário para a Visão Geral sem quebrar templates.
    Você pode substituir aqui pela leitura real da planilha quando quiser.
    """
    # 'dados' pode conter o que você já usa nos templates. Mantemos vazio aqui pra não interferir.
    dados = {}

    # 'extras' é usado na Visão Geral (evita 'extras is undefined' que apareceu no log)
    extras = {
        # Ajuste se quiser um valor real – aqui fica só um placeholder seguro
        "percentual_cpl_formatado": "-",
    }

    # Mantém compatibilidade com _nav.html que usa 'current_path'
    ctx = {
        "dados": dados,
        "extras": extras,
        "current_path": request.path,
    }
    return ctx

# -----------------------------
# Rotas
# -----------------------------
@app.route("/")
def visao_geral():
    # Renderiza a Visão Geral com contexto seguro
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())

@app.route("/origem-conversao")
def origem_conversao():
    # Mantemos o mesmo contexto básico para não quebrar navegação
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
