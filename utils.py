# -*- coding: utf-8 -*-
import os
from datetime import date, timedelta
from flask import Flask, render_template, jsonify, request, redirect, url_for
from utils import (
    get_dataframes, compute_kpis, compute_origem_conversao, compute_profissao_canal,
    compute_analise_regional, compute_insights_ia, compute_projecao_resultados,
    last_sync_info, format_currency, format_number, format_percent
)

app = Flask(__name__)

# -------------------- Filtros Jinja --------------------
@app.template_filter("moeda_ptbr")
def moeda_ptbr(v):
    return format_currency(v)

@app.template_filter("numero_ptbr")
def numero_ptbr(v):
    return format_number(v)

@app.template_filter("percentual_ptbr")
def percentual_ptbr(v):
    return format_percent(v)

# -------------------- Safe namespace para 'dados'/'extras' --------------------
class SafeNS(dict):
    def __getattr__(self, name):
        if name.startswith("__") and name.endswith("__"):
            raise AttributeError
        val = self.get(name, "")
        if isinstance(val, dict):
            val = SafeNS(val)
        return val
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__
    def __html__(self):
        return ""

# -------------------- Rotas --------------------
@app.route("/")
def home():
    return redirect(url_for("visao_geral"))

@app.route("/visao-geral")
def visao_geral():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    kpis = compute_kpis(dfs)

    # Período padrão: últimos 28 dias
    fim = date.today()
    ini = fim - timedelta(days=27)

    dados = SafeNS({
        "data_inicio": ini.strftime("%d/%m/%Y"),
        "data_fim": fim.strftime("%d/%m/%Y"),
        "dias_campanha": 28,
        "conversao": {
            "receita_estimada_curso": 0
        }
    })

    # <<< NOVO: objeto 'extras' esperado pelo template >>>
    extras = SafeNS({
        "percentual_orcamento_formatado": "0,0%",
        "orcamento_total_formatado": "R$ —",
        "orcamento_utilizado_formatado": "R$ —",
        "orcamento_restante_formatado": "R$ —",
    })

    return render_template(
        "visao_geral_atualizada.html",
        kpis=kpis,
        dados=dados,
        extras=extras,          # <<< passa 'extras' para o template
        last_sync=last_sync_info()
    )

@app.route("/origem-conversao")
def origem_conversao():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    tabela, funil = compute_origem_conversao(dfs)
    return render_template(
        "origem_conversao_atualizada.html",
        tabela=tabela.to_dict(orient="records"),
        funil=funil,
        last_sync=last_sync_info()
    )

@app.route("/profissao-canal")
def profissao_canal():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    tabela = compute_profissao_canal(dfs)
    return render_template(
        "profissao_canal_atualizada.html",
        tabela=tabela.to_dict(orient="records"),
        last_sync=last_sync_info()
    )

@app.route("/analise-regional")
def analise_regional():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    estados, regioes = compute_analise_regional(dfs)
    return render_template(
        "analise_regional_atualizada.html",
        estados=estados.to_dict(orient="records"),
        regioes=regioes.to_dict(orient="records"),
        last_sync=last_sync_info()
    )

@app.route("/insights-ia")
def insights_ia():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    insights = compute_insights_ia(dfs)
    return render_template("insights_ia_atualizada.html", insights=insights, last_sync=last_sync_info())

@app.route("/projecao-resultados")
def projecao_resultados():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    projecao, premissas = compute_projecao_resultados(dfs)
    return render_template(
        "projecao_resultados_atualizada.html",
        projecao=projecao.to_dict(orient="records"),
        premissas=premissas,
        last_sync=last_sync_info()
    )

@app.route("/health")
def health():
    return jsonify({"status": "ok", "last_sync": last_sync_info()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
