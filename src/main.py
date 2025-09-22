#!/usr/bin/env python3
"""
Main entry point for Dashboard CHT22
"""

import sys
import os
from datetime import datetime
import requests
import json
import threading
import time
from flask import Flask, render_template, jsonify

# Adicionar o diretório pai ao path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Importar utils
from utils import (validar_dados_dashboard, calcular_percentual_seguro, formatar_percentual, 
                  log_dados_dashboard, formatar_moeda_ptbr, formatar_numero_ptbr, 
                  formatar_percentual_ptbr, criar_filtros_jinja, aplicar_formatacao_ptbr)

app = Flask(__name__, template_folder=os.path.join(parent_dir, 'templates'), 
            static_folder=os.path.join(parent_dir, 'static'))

# Registrar filtros personalizados para formatação PT-BR
filtros_ptbr = criar_filtros_jinja()
for nome, filtro in filtros_ptbr.items():
    app.jinja_env.filters[nome] = filtro

# Configuração da sincronização
SHEET_ID = "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT"
BASE_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq"
SYNC_INTERVAL = 300  # 5 minutos

# Dados básicos do dashboard
DADOS_DASHBOARD_RAW = {
    'dias_campanha': 27,
    'data_inicio': '25/08/2025',
    'data_fim': '20/09/2025',
    'total_leads': 9474,
    'cpl_medio': 15.57,
    'investimento_total': 149759.71,
    'roas_geral': 2.07,
    'meta_leads': 9000,
    'meta_cpl': 15.00,
    'orcamento_total': 200000.00,
    
    # Dados por canal
    'canais': {
        'facebook': {'leads': 7802, 'percentual': 82.3, 'cpl': 17.01, 'investimento': 132722.78, 'roas': 2.59},
        'instagram': {'leads': 930, 'percentual': 9.8, 'cpl': 0.00, 'investimento': 0, 'roas': float('inf')},
        'youtube': {'leads': 628, 'percentual': 6.6, 'cpl': 25.50, 'investimento': 16012.37, 'roas': 1.73},
        'google': {'leads': 55, 'percentual': 0.6, 'cpl': 18.63, 'investimento': 1024.56, 'roas': 2.37},
        'email': {'leads': 35, 'percentual': 0.4, 'cpl': 0.00, 'investimento': 0, 'roas': float('inf')}
    },
    
    # Dados de conversão
    'conversao': {
        'taxa_conversao': 0.70,
        'ticket_medio_curso': 6300.00,
        'ticket_medio_mentoria': 20000.00,
        'percentual_mentorias': 30.0,
        'vendas_estimadas': 66,
        'receita_estimada_curso': 415800,
        'receita_estimada_mentoria': 396000
    },
    
    # Projeções
    'projecao': {
        'performance_real': {
            'leads': 9474, 'cpl': 15.81, 'investimento': 149759.71,
            'vendas_curso': 66, 'receita_curso': 415800,
            'vendas_mentoria': 20, 'receita_mentoria': 400000,
            'receita_total': 815800, 'roas_curso': 2.07
        },
        'projecao_28_dias': {
            'leads': 9948, 'cpl': 18.50, 'investimento': 184000,
            'vendas_curso': 70, 'receita_curso': 441000,
            'vendas_mentoria': 21, 'receita_mentoria': 420000,
            'receita_total': 861000, 'roas_curso': 2.39
        }
    }
}

# Validar dados
DADOS_DASHBOARD = validar_dados_dashboard(DADOS_DASHBOARD_RAW)

@app.route('/')
def index():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', 
                         aba_ativa='visao-geral', 
                         dados=dados_formatados,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/origem-conversao')
def origem_conversao():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', 
                         aba_ativa='origem-conversao', 
                         dados=dados_formatados,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/profissao-canal')
def profissao_canal():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', 
                         aba_ativa='profissao-canal', 
                         dados=dados_formatados,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/analise-regional')
def analise_regional():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', 
                         aba_ativa='analise-regional', 
                         dados=dados_formatados,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/insights-ia')
def insights_ia():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', 
                         aba_ativa='insights-ia', 
                         dados=dados_formatados,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/projecao-resultados')
def projecao_resultados():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', 
                         aba_ativa='projecao-resultados', 
                         dados=dados_formatados,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/api/dados')
def api_dados():
    return jsonify(DADOS_DASHBOARD)

@app.route('/api/status')
def api_status():
    return jsonify({
        'status': 'online',
        'ultima_atualizacao': datetime.now().strftime('%H:%M:%S'),
        'total_leads': DADOS_DASHBOARD['total_leads'],
        'cpl_medio': DADOS_DASHBOARD['cpl_medio'],
        'dias_campanha': DADOS_DASHBOARD['dias_campanha']
    })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
