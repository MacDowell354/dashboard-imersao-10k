# app.py
from flask import Flask, render_template, request, url_for
from utils import get_dataframes, compute_kpis, last_sync_info, moeda_ptbr, numero_ptbr

app = Flask(__name__)

# Filtros Jinja usados nos templates
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr

# Deixa o path atual disponível no template (_nav.html)
@app.context_processor
def inject_current_path():
    return {"current_path": request.path}

def _ctx():
    """Cria um contexto único para todas as abas."""
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    dados, extras = compute_kpis(dfs)
    ts = last_sync_info()
    return {"dados": dados, "extras": extras, "timestamp": ts, "last_sync": ts}

@app.route("/")
def home():
    return render_template("visao_geral_atualizada.html", **_ctx())

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

@app.route("/projecao-resultados")
def projecao_resultados():
    return render_template("projecao_resultados_atualizada.html", **_ctx())

@app.route("/analise-regional")
def analise_regional():
    return render_template("analise_regional_atualizada.html", **_ctx())

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html", **_ctx())

@app.route("/vendas")
def vendas():
    return render_template("vendas.html", **_ctx())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=False)
