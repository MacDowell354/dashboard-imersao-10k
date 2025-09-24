from flask import Flask, render_template, jsonify
from datetime import datetime
import requests
import json
import threading
import time
import os

from utils import (
    validar_dados_dashboard,
    calcular_percentual_seguro,
    formatar_percentual,
    log_dados_dashboard,
    formatar_moeda_ptbr,
    formatar_numero_ptbr,
    formatar_percentual_ptbr,
    criar_filtros_jinja,
    aplicar_formatacao_ptbr
)

app = Flask(__name__)

# Registrar filtros personalizados para formatação PT-BR
filtros_ptbr = criar_filtros_jinja()
for nome, filtro in filtros_ptbr.items():
    app.jinja_env.filters[nome] = filtro

# ======================
# ROTAS DO DASHBOARD
# ======================

@app.route("/")
def home():
    return render_template("dashboard.html")

@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html")

@app.route("/insights-ia")
def insights_ia():
    return render_template("insights_ia_atualizada.html")

@app.route("/projecao-resultados")
def projecao_resultados():
    return render_template("projecao_resultados_atualizada.html")

@app.route("/analise-regional")
def analise_regional():
    return render_template("analise_regional_atualizada.html")

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html")

@app.route("/vendas")
def vendas():
    return render_template("vendas.html")

@app.route("/origem-conversao")
def origem_conversao():
    return render_template("origem_conversao_atualizada.html")


# =====================
# EXECUÇÃO LOCAL
# =====================
if __name__ == "__main__":
    app.run(debug=True)
