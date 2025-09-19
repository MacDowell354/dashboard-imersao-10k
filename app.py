from flask import Flask, render_template, jsonify
from datetime import datetime
import requests
import json
import threading
import time
import os
from utils import (
    validar_dados_dashboard, calcular_percentual_seguro, formatar_percentual,
    log_dados_dashboard, formatar_moeda_ptbr, formatar_numero_ptbr,
    formatar_percentual_ptbr, criar_filtros_jinja, aplicar_formatacao_ptbr
)

app = Flask(__name__)

# ---- Filtros Jinja PT-BR ----
filtros_ptbr = criar_filtros_jinja()
for nome, filtro in filtros_ptbr.items():
    app.jinja_env.filters[nome] = filtro

# ---- Config da sincronização ----
SHEET_ID = "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT"
BASE_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq"
SYNC_INTERVAL = 300  # 5 min

# ---- Dados base (com todas as chaves usadas pelos templates) ----
DADOS_DASHBOARD_RAW = {
    'dias_campanha': 21,
    'total_leads': 7713,
    'cpl_medio': 15.57,
    'investimento_total': 120114.64,
    'roas_geral': 2.24,
    'meta_leads': 9000,
    'meta_cpl': 15.00,
    'orcamento_total': 140000.00,

    'canais': {
        'facebook':  {'leads': 6404, 'percentual': 83.0, 'cpl': 16.56, 'investimento': 106081.73, 'roas': 2.66},
        'instagram': {'leads': 740,  'percentual': 9.6,  'cpl': 0.00, 'investimento': 0.0,       'roas': float('inf')},
        'youtube':   {'leads': 468,  'percentual': 6.1,  'cpl': 28.15,'investimento': 13175.36,  'roas': 1.57},
        'google':    {'leads': 49,   'percentual': 0.6,  'cpl': 17.50,'investimento': 857.55,    'roas': 2.52},
        'email':     {'leads': 32,   'percentual': 0.4,  'cpl': 0.00, 'investimento': 0.0,       'roas': float('inf')},
    },

    'profissoes': {
        'dentista':        {'total': 1754, 'percentual': 23},
        'outra':           {'total': 1417, 'percentual': 18},
        'psicologo':       {'total': 1058, 'percentual': 14},
        'fisioterapeuta':  {'total': 1046, 'percentual': 14},
        'medico':          {'total': 1009, 'percentual': 13},
        'nutricionista':   {'total': 686,  'percentual': 9},
        'psicoterapeuta':  {'total': 367,  'percentual': 5},
        'fonoaudiologo':   {'total': 190,  'percentual': 2},
        'veterinario':     {'total': 143,  'percentual': 2},
    },

    'projecao': {
        'performance_real': {
            'leads': 7713, 'cpl': 15.57, 'vendas_curso': 54, 'investimento': 151920.54, 'roas_curso': 2.24
        },
        'projecao_28_dias': {
            'leads': 10284, 'cpl': 19.70, 'vendas_curso': 72, 'investimento': 202560.72, 'roas_curso': 2.24
        }
    }
}

# ---- Validação inicial + log ----
DADOS_DASHBOARD = validar_dados_dashboard(DADOS_DASHBOARD_RAW)
print("🔧 INICIALIZAÇÃO DO DASHBOARD:")
log_dados_dashboard(DADOS_DASHBOARD)

ultima_sincronizacao = datetime.now()
sincronizacao_ativa = True

# ---- Coleta da planilha ----
def extrair_dados_planilha():
    try:
        params = {'tqx': 'out:json', 'sheet': 'inputs_dashboard_cht22'}
        response = requests.get(BASE_URL, params=params, timeout=10)

        if response.status_code == 200:
            json_text = response.text.replace("/*O_o*/\ngoogle.visualization.Query.setResponse(", "").rstrip(");")
            data = json.loads(json_text)
            rows = data.get('table', {}).get('rows', [])

            if len(rows) >= 2:
                valores = []
                for cell in rows[1].get('c', []):
                    if cell and 'v' in cell:
                        v = cell['v']
                        if isinstance(v, (int, float)):
                            valores.append(v)
                        elif isinstance(v, str) and v.replace('.', '').replace(',', '').isdigit():
                            valores.append(float(v.replace(',', '.')))
                        else:
                            valores.append(0)
                    else:
                        valores.append(0)

                if len(valores) >= 5:
                    global DADOS_DASHBOARD
                    dados_temp = DADOS_DASHBOARD.copy()
                    dados_temp.update({
                        'dias_campanha': int(valores[0]) if valores[0] > 0 else DADOS_DASHBOARD['dias_campanha'],
                        'total_leads': int(valores[1]) if valores[1] > 0 else DADOS_DASHBOARD['total_leads'],
                        'cpl_medio': float(valores[2]) if valores[2] > 0 else DADOS_DASHBOARD['cpl_medio'],
                        'investimento_total': float(valores[3]) if valores[3] > 0 else DADOS_DASHBOARD['investimento_total'],
                        'roas_geral': float(valores[4]) if valores[4] > 0 else DADOS_DASHBOARD['roas_geral'],
                    })

                    dados_validados = validar_dados_dashboard(dados_temp)
                    DADOS_DASHBOARD.update(dados_validados)

                    print("✅ SINCRONIZAÇÃO CONCLUÍDA:")
                    log_dados_dashboard(DADOS_DASHBOARD)
                    return True
    except Exception as e:
        print(f"❌ Erro na sincronização: {e}")
        return False

    return False

def sincronizacao_automatica():
    global ultima_sincronizacao, sincronizacao_ativa
    while sincronizacao_ativa:
        try:
            if extrair_dados_planilha():
                ultima_sincronizacao = datetime.now()
            time.sleep(SYNC_INTERVAL)
        except Exception as e:
            print(f"❌ Erro na thread de sincronização: {e}")
            time.sleep(60)

def iniciar_sincronizacao():
    thread = threading.Thread(target=sincronizacao_automatica, daemon=True)
    thread.start()
    print("🔄 Sincronização automática iniciada!")

iniciar_sincronizacao()

# ---- Rotas ----
@app.route('/')
def visao_geral():
    percentual_cpl = calcular_percentual_seguro(DADOS_DASHBOARD['cpl_medio'], DADOS_DASHBOARD['meta_cpl'], "CPL")
    percentual_orcamento = calcular_percentual_seguro(DADOS_DASHBOARD['investimento_total'], DADOS_DASHBOARD['orcamento_total'], "Orçamento")
    percentual_leads = calcular_percentual_seguro(DADOS_DASHBOARD['total_leads'], DADOS_DASHBOARD['meta_leads'], "Leads")

    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)

    dados_extras = {
        'percentual_cpl': percentual_cpl,
        'percentual_cpl_formatado': formatar_percentual_ptbr(percentual_cpl),
        'percentual_orcamento': percentual_orcamento,
        'percentual_orcamento_formatado': formatar_percentual_ptbr(percentual_orcamento),
        'percentual_leads': percentual_leads,
        'percentual_leads_formatado': formatar_percentual_ptbr(percentual_leads),
    }

    return render_template(
        'dashboard.html',
        aba_ativa='visao-geral',
        dados=dados_formatados,
        extras=dados_extras,
        timestamp=datetime.now().strftime('%H:%M:%S'),
        datetime=datetime
    )

@app.route('/origem-conversao')
def origem_conversao():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', aba_ativa='origem-conversao', dados=dados_formatados, timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/profissao-canal')
def profissao_canal():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', aba_ativa='profissao-canal', dados=dados_formatados, timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/analise-regional')
def analise_regional():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', aba_ativa='analise-regional', dados=dados_formatados, timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/insights-ia')
def insights_ia():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', aba_ativa='insights-ia', dados=dados_formatados, timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/projecao-resultados')
def projecao_resultados():
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    return render_template('dashboard.html', aba_ativa='projecao-resultados', dados=dados_formatados, timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/api/dados')
def api_dados():
    return jsonify(DADOS_DASHBOARD)

@app.route('/api/status')
def api_status():
    return jsonify({
        'status': 'online',
        'ultima_atualizacao': datetime.now().strftime('%H:%M:%S'),
        'ultima_sincronizacao': ultima_sincronizacao.strftime('%H:%M:%S'),
        'sincronizacao': 'ativa' if sincronizacao_ativa else 'inativa',
        'total_leads': DADOS_DASHBOARD['total_leads'],
        'cpl_medio': DADOS_DASHBOARD['cpl_medio'],
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
