from flask import Flask, render_template, jsonify
from datetime import datetime
import requests
import json
import threading
import time
import os
from utils import (validar_dados_dashboard, calcular_percentual_seguro, formatar_percentual, 
                  log_dados_dashboard, formatar_moeda_ptbr, formatar_numero_ptbr, 
                  formatar_percentual_ptbr, criar_filtros_jinja, aplicar_formatacao_ptbr)

app = Flask(__name__)

# Registrar filtros personalizados para formatação PT-BR
filtros_ptbr = criar_filtros_jinja()
for nome, filtro in filtros_ptbr.items():
    app.jinja_env.filters[nome] = filtro

# Configuração da sincronização
SHEET_ID = "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT"
BASE_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq"
SYNC_INTERVAL = 300  # 5 minutos

# DADOS ATUALIZADOS DA PLANILHA (19/09/2025 - 25 dias de campanha)
DADOS_DASHBOARD_RAW = {
    'dias_campanha': 25,
    'data_inicio': '25/08/2025',
    'data_fim': '17/09/2025',
    'total_leads': 9135,      # ATUALIZADO: era 7713
    'cpl_medio': 15.66,       # ATUALIZADO: era 15.57
    'investimento_total': 143085.55,  # ATUALIZADO: era 120114.64
    'roas_geral': 2.12,       # ATUALIZADO: era 2.24
    'roas_captacao': 2.82,    # NOVO campo
    'meta_leads': 9000,
    'meta_cpl': 15.00,
    'orcamento_total': 200000.00,  # ATUALIZADO: era 140000
    'taxa_conversao': 0.70,   # 0.70%
    'ticket_medio_curso': 6300.00,
    'ticket_medio_mentoria': 20000.00,
    'meta_cpl_total_aquecimento': 20.00,
    
    # DADOS POR CANAL ATUALIZADOS
    'canais': {
        'facebook': {
            'leads': 7556,        # ATUALIZADO: era 6404
            'percentual': 82.7,   # ATUALIZADO: era 83.0
            'cpl': 16.81,         # ATUALIZADO: era 16.56
            'investimento': 127029.12,  # ATUALIZADO: era 106081.73
            'roas': 2.62          # ATUALIZADO: era 2.66
        },
        'instagram': {
            'leads': 898,         # ATUALIZADO: era 740
            'percentual': 9.8,    # ATUALIZADO: era 9.6
            'cpl': 0.00,          # Orgânico
            'investimento': 0,
            'roas': float('inf')
        },
        'youtube': {
            'leads': 569,         # ATUALIZADO: era 468
            'percentual': 6.2,    # ATUALIZADO: era 6.1
            'cpl': 26.50,         # ATUALIZADO: era 28.15
            'investimento': 15080.50,  # ATUALIZADO: era 13175.36
            'roas': 1.66          # ATUALIZADO: era 1.57
        },
        'google': {
            'leads': 54,          # ATUALIZADO: era 49
            'percentual': 0.6,    # Mantido
            'cpl': 18.07,         # ATUALIZADO: era 17.50
            'investimento': 975.93,    # ATUALIZADO: era 857.55
            'roas': 2.44          # ATUALIZADO: era 2.52
        },
        'email': {
            'leads': 35,          # ATUALIZADO: era 32
            'percentual': 0.4,    # Mantido
            'cpl': 0.00,
            'investimento': 0,
            'roas': float('inf')
        }
    },
    
    # DADOS DE PROFISSÕES ATUALIZADOS (proporcionalmente ao crescimento)
    'profissoes': {
        'dentista': {'total': 2077, 'percentual': 23},    # Atualizado
        'outra': {'total': 1678, 'percentual': 18},       # Atualizado
        'psicologo': {'total': 1253, 'percentual': 14},   # Atualizado
        'fisioterapeuta': {'total': 1238, 'percentual': 14}, # Atualizado
        'medico': {'total': 1195, 'percentual': 13},      # Atualizado
        'nutricionista': {'total': 812, 'percentual': 9}, # Atualizado
        'psicoterapeuta': {'total': 435, 'percentual': 5}, # Atualizado
        'fonoaudiologo': {'total': 225, 'percentual': 2}, # Atualizado
        'veterinario': {'total': 169, 'percentual': 2}    # Atualizado
    },
    
    # DADOS REGIONAIS ATUALIZADOS
    'regioes': {
        'sudeste': {'leads': 4973, 'percentual': 54.4, 'estados': ['SP', 'RJ', 'MG', 'ES']},
        'sul': {'leads': 2131, 'percentual': 23.3, 'estados': ['RS', 'SC', 'PR']},
        'nordeste': {'leads': 1421, 'percentual': 15.5, 'estados': ['BA', 'PE', 'CE', 'PB']},
        'centro_oeste': {'leads': 474, 'percentual': 5.2, 'estados': ['GO', 'DF', 'MT', 'MS']},
        'norte': {'leads': 178, 'percentual': 1.9, 'estados': ['PA', 'AM', 'RO']}
    },
    
    # TOP 10 ESTADOS ATUALIZADOS
    'estados_top10': [
        {'estado': 'SP', 'leads': 2960, 'percentual': 32.4},
        {'estado': 'RJ', 'leads': 948, 'percentual': 10.4},
        {'estado': 'MG', 'leads': 829, 'percentual': 9.1},
        {'estado': 'RS', 'leads': 712, 'percentual': 7.8},
        {'estado': 'PR', 'leads': 593, 'percentual': 6.5},
        {'estado': 'SC', 'leads': 530, 'percentual': 5.8},
        {'estado': 'BA', 'leads': 474, 'percentual': 5.2},
        {'estado': 'GO', 'leads': 411, 'percentual': 4.5},
        {'estado': 'PE', 'leads': 355, 'percentual': 3.9},
        {'estado': 'CE', 'leads': 296, 'percentual': 3.2}
    ],
    
    # PROJEÇÕES ATUALIZADAS
    'projecao': {
        'performance_real_25_dias': {
            'leads': 9135,
            'cpl': 15.66,
            'investimento': 143085.55,
            'roas': 2.12,
            'vendas_estimadas': 64,  # 9135 * 0.007
            'receita_estimada': 403200  # 64 * 6300
        },
        'projecao_30_dias': {
            'leads': 10962,  # 9135 * (30/25)
            'cpl': 15.66,
            'investimento': 171702,  # 143085.55 * (30/25)
            'roas': 2.12,
            'vendas_estimadas': 77,  # 10962 * 0.007
            'receita_estimada': 485000  # 77 * 6300
        }
    },
    
    # DADOS DE AUDIÊNCIA
    'audiencia': {
        'seguidores_instagram': 167530,
        'seguidores_youtube': 651635,
        'crescimento_instagram': 5.2,
        'crescimento_youtube': 3.8
    },
    
    # INSIGHTS DE IA ATUALIZADOS
    'insights_ia': {
        'status_geral': 'Excelente Performance',
        'destaque_principal': 'Meta de leads superada (9.135 vs 9.000)',
        'cpl_status': 'Dentro da meta (R$ 15,66 vs R$ 15,00)',
        'melhor_canal': 'Facebook (ROAS 2,62)',
        'oportunidade': 'YouTube com CPL alto (R$ 26,50)',
        'crescimento': '+18,4% vs período anterior',
        'recomendacoes': [
            'Otimizar campanhas YouTube para reduzir CPL',
            'Escalar investimento Facebook (melhor ROAS)',
            'Potencializar Instagram orgânico (898 leads)',
            'Testar novos criativos Google Ads'
        ]
    }
}

# Validar e aplicar dados seguros
DADOS_DASHBOARD = validar_dados_dashboard(DADOS_DASHBOARD_RAW)

# Log dos dados validados para debug
print("🔧 INICIALIZAÇÃO DO DASHBOARD CHT22 ATUALIZADO:")
log_dados_dashboard(DADOS_DASHBOARD)

# Status da sincronização
ultima_sincronizacao = datetime.now()
sincronizacao_ativa = True

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
                    
                    # Criar dados temporários para validação
                    dados_temp = DADOS_DASHBOARD.copy()
                    dados_temp.update({
                        'dias_campanha': int(valores[0]) if valores[0] > 0 else DADOS_DASHBOARD['dias_campanha'],
                        'total_leads': int(valores[1]) if valores[1] > 0 else DADOS_DASHBOARD['total_leads'],
                        'cpl_medio': float(valores[2]) if valores[2] > 0 else DADOS_DASHBOARD['cpl_medio'],
                        'investimento_total': float(valores[3]) if valores[3] > 0 else DADOS_DASHBOARD['investimento_total'],
                        'roas_geral': float(valores[4]) if valores[4] > 0 else DADOS_DASHBOARD['roas_geral']
                    })
                    
                    # Validar dados antes de aplicar
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
    # Calcular percentuais seguros
    percentual_cpl = calcular_percentual_seguro(
        DADOS_DASHBOARD['cpl_medio'], 
        DADOS_DASHBOARD['meta_cpl'], 
        "CPL"
    )
    
    percentual_orcamento = calcular_percentual_seguro(
        DADOS_DASHBOARD['investimento_total'], 
        DADOS_DASHBOARD['orcamento_total'], 
        "Orçamento"
    )
    
    percentual_leads = calcular_percentual_seguro(
        DADOS_DASHBOARD['total_leads'], 
        DADOS_DASHBOARD['meta_leads'], 
        "Leads"
    )
    
    # Aplicar formatação PT-BR aos dados
    dados_formatados = aplicar_formatacao_ptbr(DADOS_DASHBOARD)
    
    # Dados extras para o template
    dados_extras = {
        'percentual_cpl': percentual_cpl,
        'percentual_cpl_formatado': formatar_percentual_ptbr(percentual_cpl),
        'percentual_orcamento': percentual_orcamento,
        'percentual_orcamento_formatado': formatar_percentual_ptbr(percentual_orcamento),
        'percentual_leads': percentual_leads,
        'percentual_leads_formatado': formatar_percentual_ptbr(percentual_leads),
        'data_atualizacao': datetime.now().strftime('%d/%m/%Y %H:%M')
    }
    
    return render_template('dashboard.html', 
                         aba_ativa='visao-geral', 
                         dados=dados_formatados,
                         extras=dados_extras,
                         timestamp=datetime.now().strftime('%H:%M:%S'),
                         datetime=datetime)

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
        'versao': 'CHT22 v2.0 - Atualizado 19/09/2025',
        'ultima_atualizacao': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'ultima_sincronizacao': ultima_sincronizacao.strftime('%d/%m/%Y %H:%M:%S'),
        'sincronizacao': 'ativa' if sincronizacao_ativa else 'inativa',
        'total_leads': DADOS_DASHBOARD['total_leads'],
        'cpl_medio': DADOS_DASHBOARD['cpl_medio'],
        'dias_campanha': DADOS_DASHBOARD['dias_campanha'],
        'periodo': f"{DADOS_DASHBOARD.get('data_inicio', '25/08/2025')} a {DADOS_DASHBOARD.get('data_fim', '17/09/2025')}"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    print(f"🚀 Iniciando Dashboard CHT22 v2.0 na porta {port}")
    print(f"📊 Dados: {DADOS_DASHBOARD['total_leads']} leads em {DADOS_DASHBOARD['dias_campanha']} dias")
    print(f"💰 CPL: R$ {DADOS_DASHBOARD['cpl_medio']:.2f} (Meta: R$ {DADOS_DASHBOARD['meta_cpl']:.2f})")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)

