from flask import Flask, render_template, jsonify
from datetime import datetime
import os

app = Flask(__name__)

# Dados estáticos otimizados (sem sincronização automática para melhor performance)
DADOS_DASHBOARD = {
    'dias_campanha': 21,
    'total_leads': 7713,
    'cpl_medio': 15.57,
    'investimento_total': 120114.64,
    'roas_geral': 2.24,
    'meta_leads': 9000,
    'meta_cpl': 15.00,
    'orcamento_total': 140000.00,
    
    # Dados por canal
    'canais': {
        'facebook': {'leads': 6404, 'percentual': 83.0, 'cpl': 16.56, 'roas': 2.66},
        'instagram': {'leads': 740, 'percentual': 9.6, 'cpl': 0.00, 'roas': 0},
        'youtube': {'leads': 468, 'percentual': 6.1, 'cpl': 28.15, 'roas': 1.58},
        'google': {'leads': 49, 'percentual': 0.6, 'cpl': 19.04, 'roas': 2.52}
    },
    
    # Dados de profissões
    'profissoes': {
        'dentista': {'total': 1754, 'percentual': 22.7},
        'outra': {'total': 1417, 'percentual': 18.4},
        'psicologo': {'total': 1058, 'percentual': 13.7},
        'medico': {'total': 1009, 'percentual': 13.1},
        'fisioterapeuta': {'total': 639, 'percentual': 8.3},
        'nutricionista': {'total': 449, 'percentual': 5.8},
        'psicoterapeuta': {'total': 206, 'percentual': 2.7},
        'fonoaudiologo': {'total': 120, 'percentual': 1.6},
        'veterinario': {'total': 90, 'percentual': 1.2}
    }
}

# Filtros Jinja2 para formatação PT-BR
@app.template_filter('moeda_ptbr')
def moeda_ptbr(valor):
    try:
        return f"R$ {valor:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
    except:
        return f"R$ {valor}"

@app.template_filter('numero_ptbr')
def numero_ptbr(valor):
    try:
        return f"{valor:,.0f}".replace(',', '.')
    except:
        return str(valor)

@app.template_filter('percentual_ptbr')
def percentual_ptbr(valor):
    try:
        return f"{valor:.1f}%".replace('.', ',')
    except:
        return f"{valor}%"

# Função para calcular percentual seguro
def calcular_percentual(atual, meta):
    try:
        if meta == 0:
            return 0
        percentual = ((atual - meta) / meta) * 100
        return round(percentual, 1)
    except:
        return 0

@app.route('/')
def visao_geral():
    dados = DADOS_DASHBOARD.copy()
    
    # Cálculos dinâmicos
    dados['percentual_cpl'] = calcular_percentual(dados['cpl_medio'], dados['meta_cpl'])
    dados['percentual_orcamento'] = calcular_percentual(dados['investimento_total'], dados['orcamento_total'])
    dados['percentual_leads'] = calcular_percentual(dados['total_leads'], dados['meta_leads'])
    
    return render_template('visao_geral.html', dados=dados)

@app.route('/origem-conversao')
def origem_conversao():
    return render_template('origem_conversao.html', dados=DADOS_DASHBOARD)

@app.route('/profissao-canal')
def profissao_canal():
    return render_template('profissao_canal.html', dados=DADOS_DASHBOARD)

@app.route('/analise-regional')
def analise_regional():
    return render_template('analise_regional.html', dados=DADOS_DASHBOARD)

@app.route('/insights-ia')
def insights_ia():
    return render_template('insights_ia.html', dados=DADOS_DASHBOARD)

@app.route('/projecao-resultados')
def projecao_resultados():
    return render_template('projecao_resultados.html', dados=DADOS_DASHBOARD)

@app.route('/api/dados')
def api_dados():
    return jsonify(DADOS_DASHBOARD)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5008))
    print(f"🚀 DASHBOARD OTIMIZADO INICIANDO NA PORTA {port}")
    print(f"📊 DADOS CARREGADOS: {DADOS_DASHBOARD['total_leads']} leads")
    app.run(host='0.0.0.0', port=port, debug=False)  # Debug=False para melhor performance

