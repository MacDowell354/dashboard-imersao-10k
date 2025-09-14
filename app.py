from flask import Flask, render_template, jsonify
import requests
import json
from datetime import datetime
import os
import threading
import time

app = Flask(__name__)

# Configuração da sincronização
SHEET_ID = "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT"
BASE_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq"
SYNC_INTERVAL = 300  # 5 minutos

# Dados atualizados da planilha (13/09/2025 - 20:19)
DADOS_DASHBOARD = {
    'dias_campanha': 19,
    'total_leads': 6715,
    'cpl_medio': 16.20,
    'investimento_total': 108807.59,
    'roas_geral': 2.22,
    'meta_leads': 9000,
    'meta_cpl': 15.00,
    'orcamento_total': 140000.00,
    
    # Dados por canal
    'canais': {
        'facebook': {
            'leads': 5559,
            'percentual': 82.8,
            'cpl': 17.22,
            'investimento': 95738.61,
            'roas': 2.56
        },
        'instagram': {
            'leads': 636,
            'percentual': 9.5,
            'cpl': 0.00,
            'investimento': 0,
            'roas': float('inf')
        },
        'youtube': {
            'leads': 426,
            'percentual': 6.3,
            'cpl': 28.76,
            'investimento': 12252.17,
            'roas': 1.53
        },
        'google': {
            'leads': 47,
            'percentual': 0.7,
            'cpl': 17.38,
            'investimento': 816.81,
            'roas': 2.54
        },
        'email': {
            'leads': 29,
            'percentual': 0.4,
            'cpl': 0.00,
            'investimento': 0,
            'roas': float('inf')
        }
    },
    
    # Dados de profissões (atualizados da planilha - 13/09/2025)
    'profissoes': {
        'dentista': {'total': 1477, 'percentual': 22},
        'outra': {'total': 1420, 'percentual': 21},
        'psicologo': {'total': 1007, 'percentual': 15},
        'fisioterapeuta': {'total': 872, 'percentual': 13},
        'medico': {'total': 873, 'percentual': 13},
        'nutricionista': {'total': 470, 'percentual': 7},
        'psicoterapeuta': {'total': 338, 'percentual': 5},
        'fonoaudiologo': {'total': 147, 'percentual': 2},
        'veterinario': {'total': 111, 'percentual': 2}
    },
    
    # Projeções (atualizadas da planilha - 13/09/2025)
    'projecao': {
        'performance_real': {
            'leads': 6715,
            'cpl': 19.78,
            'vendas_curso': 47,
            'investimento': 132812.00,
            'roas_curso': 2.22
        },
        'projecao_28_dias': {
            'leads': 9896,
            'cpl': 19.84,
            'vendas_curso': 69,
            'investimento': 196343.77,
            'roas_curso': 2.22
        }
    }
}

# Status da sincronização
ultima_sincronizacao = datetime.now()
sincronizacao_ativa = False

def extrair_dados_planilha():
    """Extrai dados da planilha Google Sheets"""
    try:
        params = {
            'tqx': 'out:json',
            'sheet': 'inputs_dashboard_cht22'
        }
        
        response = requests.get(BASE_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            json_text = response.text
            json_text = json_text.replace("/*O_o*/\ngoogle.visualization.Query.setResponse(", "")
            json_text = json_text.rstrip(");")
            
            data = json.loads(json_text)
            rows = data.get('table', {}).get('rows', [])
            
            if len(rows) >= 2:
                # Extrair dados da segunda linha (índice 1) - pular cabeçalho
                valores = []
                for cell in rows[1].get('c', []):
                    if cell and 'v' in cell:
                        valor = cell['v']
                        # Verificar se é um número válido
                        if isinstance(valor, (int, float)):
                            valores.append(valor)
                        elif isinstance(valor, str) and valor.replace('.', '').replace(',', '').isdigit():
                            valores.append(float(valor.replace(',', '.')))
                        else:
                            valores.append(0)
                    else:
                        valores.append(0)
                
                # Atualizar apenas se temos dados suficientes
                if len(valores) >= 5:
                    global DADOS_DASHBOARD
                    DADOS_DASHBOARD.update({
                        'dias_campanha': int(valores[0]) if valores[0] > 0 else DADOS_DASHBOARD['dias_campanha'],
                        'total_leads': int(valores[1]) if valores[1] > 0 else DADOS_DASHBOARD['total_leads'],
                        'cpl_medio': float(valores[2]) if valores[2] > 0 else DADOS_DASHBOARD['cpl_medio'],
                        'investimento_total': float(valores[3]) if valores[3] > 0 else DADOS_DASHBOARD['investimento_total'],
                        'roas_geral': float(valores[4]) if valores[4] > 0 else DADOS_DASHBOARD['roas_geral']
                    })
                    
                    print(f"✅ Dados sincronizados: {DADOS_DASHBOARD['total_leads']} leads, CPL R$ {DADOS_DASHBOARD['cpl_medio']:.2f}")
                    return True
                
    except Exception as e:
        print(f"❌ Erro na sincronização: {e}")
        return False
    
    return False

def sincronizacao_automatica():
    """Thread para sincronização automática"""
    global ultima_sincronizacao, sincronizacao_ativa
    
    while sincronizacao_ativa:
        try:
            if extrair_dados_planilha():
                ultima_sincronizacao = datetime.now()
            time.sleep(SYNC_INTERVAL)
        except Exception as e:
            print(f"❌ Erro na thread de sincronização: {e}")
            time.sleep(60)  # Aguarda 1 minuto em caso de erro

# Iniciar sincronização automática
def iniciar_sincronizacao():
    thread = threading.Thread(target=sincronizacao_automatica, daemon=True)
    thread.start()
    print("🔄 Sincronização automática iniciada!")

# Inicializar sincronização (ATIVADA)
iniciar_sincronizacao()

@app.route('/')
def visao_geral():
    return render_template('dashboard.html', 
                         aba_ativa='visao-geral', 
                         dados=DADOS_DASHBOARD,
                         timestamp=datetime.now().strftime('%H:%M:%S'),
                         datetime=datetime)

@app.route('/origem-conversao')
def origem_conversao():
    return render_template('dashboard.html', 
                         aba_ativa='origem-conversao', 
                         dados=DADOS_DASHBOARD,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/profissao-canal')
def profissao_canal():
    return render_template('dashboard.html', 
                         aba_ativa='profissao-canal', 
                         dados=DADOS_DASHBOARD,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/analise-regional')
def analise_regional():
    return render_template('dashboard.html', 
                         aba_ativa='analise-regional', 
                         dados=DADOS_DASHBOARD,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/insights-ia')
def insights_ia():
    return render_template('dashboard.html', 
                         aba_ativa='insights-ia', 
                         dados=DADOS_DASHBOARD,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

@app.route('/projecao-resultados')
def projecao_resultados():
    return render_template('dashboard.html', 
                         aba_ativa='projecao-resultados', 
                         dados=DADOS_DASHBOARD,
                         timestamp=datetime.now().strftime('%H:%M:%S'))

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
        'cpl_medio': DADOS_DASHBOARD['cpl_medio']
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)

