# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template, jsonify, request, redirect, url_for
from utils import (
    get_dataframes, compute_kpis, compute_origem_conversao, compute_profissao_canal,
    compute_analise_regional, compute_insights_ia, compute_projecao_resultados,
    last_sync_info
)

app = Flask(__name__)

@app.route("/")
def home():
    # Redireciona direto para a aba Visão Geral
    return redirect(url_for("visao_geral"))

@app.route("/visao-geral")
def visao_geral():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    kpis = compute_kpis(dfs)
    return render_template("visao_geral_atualizada.html", kpis=kpis, last_sync=last_sync_info())

@app.route("/origem-conversao")
def origem_conversao():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    tabela, funil = compute_origem_conversao(dfs)
    return render_template("origem_conversao_atualizada.html",
                           tabela=tabela.to_dict(orient="records"),
                           funil=funil,
                           last_sync=last_sync_info())

@app.route("/profissao-canal")
def profissao_canal():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    tabela = compute_profissao_canal(dfs)
    return render_template("profissao_canal_atualizada.html",
                           tabela=tabela.to_dict(orient="records"),
                           last_sync=last_sync_info())

@app.route("/analise-regional")
def analise_regional():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    estados, regioes = compute_analise_regional(dfs)
    return render_template("analise_regional_atualizada.html",
                           estados=estados.to_dict(orient="records"),
                           regioes=regioes.to_dict(orient="records"),
                           last_sync=last_sync_info())

@app.route("/insights-ia")
def insights_ia():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    insights = compute_insights_ia(dfs)
    return render_template("insights_ia_atualizada.html", insights=insights, last_sync=last_sync_info())

@app.route("/projecao-resultados")
def projecao_resultados():
    dfs = get_dataframes(force_refresh=bool(request.args.get("refresh")))
    projecao, premissas = compute_projecao_resultados(dfs)
    return render_template("projecao_resultados_atualizada.html",
                           projecao=projecao.to_dict(orient="records"),
                           premissas=premissas,
                           last_sync=last_sync_info())

@app.route("/health")
def health():
    return jsonify({"status": "ok", "last_sync": last_sync_info()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
