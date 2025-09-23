# app.py
from flask import Flask, render_template, request
from utils import (
    get_dataframes,
    compute_context,
    moeda_ptbr,
    numero_ptbr,
    last_sync_info,
)

app = Flask(__name__)

# registra filtros do Jinja
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr

def _contexto():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    dados, extras = compute_context(dfs)
    return dict(dados=dados, extras=extras, timestamp=last_sync_info())

@app.route("/")
@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **_contexto())

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard_atualizado.html", **_contexto())

@app.route("/insights-ia")
def insights_ia():
    return render_template("insights_ia_atualizada.html", **_contexto())

@app.route("/origem-conversao")
def origem_conversao():
    return render_template("origem_conversao_atualizada.html", **_contexto())

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html", **_contexto())

@app.route("/projecao-resultados")
def projecao_resultados():
    return render_template("projecao_resultados_atualizada.html", **_contexto())

@app.route("/analise-regional")
def analise_regional():
    return render_template("analise_regional_atualizada.html", **_contexto())

@app.route("/vendas")
def vendas():
    # wrapper que inclui vendas_content.html
    return render_template("vendas.html", **_contexto())

if __name__ == "__main__":
    # Para rodar localmente (Render usa gunicorn/wsgi.py)
    app.run(host="0.0.0.0", port=10000, debug=False)
