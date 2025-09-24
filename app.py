from flask import Flask, render_template, request
import os
import json
from utils import (
    carregar_dados_visao_geral,
    carregar_dados_origem_conversao,
    carregar_dados_profissao_canal,
    carregar_dados_analise_regional,
    carregar_dados_insights_ia,
    carregar_dados_projecao_resultados,
    carregar_dados_vendas
)

app = Flask(__name__)

# ✅ Torna 'current_path' disponível para todos os templates
@app.context_processor
def inject_current_path():
    return {"current_path": request.path}

# ROTA PRINCIPAL - VISÃO GERAL
@app.route("/")
def visao_geral():
    ctx = carregar_dados_visao_geral()
    return render_template("visao_geral_atualizada.html", **ctx)

# ROTA - ORIGEM CONVERSÃO
@app.route("/origem-conversao")
def origem_conversao():
    ctx = carregar_dados_origem_conversao()
    return render_template("origem_conversao_atualizada.html", **ctx)

# ROTA - PROFISSÃO X CANAL
@app.route("/profissao-canal")
def profissao_canal():
    ctx = carregar_dados_profissao_canal()
    return render_template("profissao_canal_atualizada.html", **ctx)

# ROTA - ANÁLISE REGIONAL
@app.route("/analise-regional")
def analise_regional():
    ctx = carregar_dados_analise_regional()
    return render_template("analise_regional_atualizada.html", **ctx)

# ROTA - INSIGHTS IA
@app.route("/insights-ia")
def insights_ia():
    ctx = carregar_dados_insights_ia()
    return render_template("insights_ia_atualizada.html", **ctx)

# ROTA - PROJEÇÃO RESULTADOS
@app.route("/projecao-resultados")
def projecao_resultados():
    ctx = carregar_dados_projecao_resultados()
    return render_template("projecao_resultados_atualizada.html", **ctx)

# ROTA - VENDAS
@app.route("/vendas")
def vendas():
    ctx = carregar_dados_vendas()
    return render_template("vendas.html", **ctx)

# ROTA DE TESTE (opcional)
@app.route("/ping")
def ping():
    return "Dashboard online ✅"

# EXECUÇÃO LOCAL (Render ignora)
if __name__ == "__main__":
    app.run(debug=True)
