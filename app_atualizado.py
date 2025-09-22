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

# Dados atualizados da planilha (22/09/2025 - 27 dias)
DADOS_DASHBOARD_RAW = {
    'dias_campanha': 27,
    'data_inicio': '25/08/2025',
    'data_fim': '20/09/2025',
    'total_leads': 9474,
    'cpl_medio': 15.81,
    'investimento_total': 149759.71,
    'roas_geral': 2.07,
    'meta_leads': 9000,
    'meta_cpl': 15.00,
    'orcamento_total': 140000.00,
    
    # Dados por canal (atualizados da planilha)
    'canais': {
        'facebook': {
            'leads': 7802,
            'percentual': 82.3,
            'cpl': 17.01,
            'investimento': 132722.78,
            'roas': 2.59
        },
        'instagram': {
            'leads': 930,
            'percentual': 9.8,
            'cpl': 0.00,
            'investimento': 0,
            'roas': float('inf')
        },
        'youtube': {
            'leads': 628,
            'percentual': 6.6,
            'cpl': 25.50,
            'investimento': 16012.37,
            'roas': 1.73
        },
        'google': {
            'leads': 55,
            'percentual': 0.6,
            'cpl': 18.63,
            'investimento': 1024.56,
            'roas': 2.37
        },
        'email': {
            'leads': 35,
            'percentual': 0.4,
            'cpl': 0.00,
            'investimento': 0,
            'roas': float('inf')
        }
    },
    
    # Dados de conversão e vendas
    'conversao': {
        'taxa_conversao': 0.70,
        'ticket_medio_curso': 6300.00,
        'ticket_medio_mentoria': 20000.00,
        'percentual_mentorias': 30.0,
        'vendas_estimadas': 66,  # 9474 * 0.007
        'receita_estimada_curso': 415800,  # 66 * 6300
        'receita_estimada_mentoria': 396000  # 20 * 20000 (30% de 66)
    },
    
    # Dados de profissões (atualizados proporcionalmente)
    'profissoes': {
        'dentista': {'total': 2179, 'percentual': 23},
        'outra': {'total': 1705, 'percentual': 18},
        'psicologo': {'total': 1327, 'percentual': 14},
        'fisioterapeuta': {'total': 1327, 'percentual': 14},
        'medico': {'total': 1232, 'percentual': 13},
        'nutricionista': {'total': 853, 'percentual': 9},
        'psicoterapeuta': {'total': 474, 'percentual': 5},
        'fonoaudiologo': {'total': 189, 'percentual': 2},
        'veterinario': {'total': 189, 'percentual': 2}
    },
    
    # Dados regionais
    'regioes': {
        'sudeste': {'leads': 4737, 'percentual': 50.0},
        'nordeste': {'leads': 1895, 'percentual': 20.0},
        'sul': {'leads': 1421, 'percentual': 15.0},
        'centro_oeste': {'leads': 947, 'percentual': 10.0},
        'norte': {'leads': 474, 'percentual': 5.0}
    },
    
    # Estados principais
    'estados': {
        'SP': {'leads': 2368, 'percentual': 25.0},
        'RJ': {'leads': 947, 'percentual': 10.0},
        'MG': {'leads': 947, 'percentual': 10.0},
        'RS': {'leads': 663, 'percentual': 7.0},
        'PR': {'leads': 568, 'percentual': 6.0},
        'BA': {'leads': 568, 'percentual': 6.0},
        'SC': {'leads': 474, 'percentual': 5.0},
        'GO': {'leads': 379, 'percentual': 4.0},
        'PE': {'leads': 379, 'percentual': 4.0},
        'CE': {'leads': 284, 'percentual': 3.0}
    },
    
    # Projeções atualizadas
    'projecao': {
        'performance_real': {
            'leads': 9474,
            'cpl': 15.81,
            'investimento': 149759.71,
            'vendas_curso': 66,
            'receita_curso': 415800,
            'vendas_mentoria': 20,
            'receita_mentoria': 400000,
            'receita_total': 815800,
            'roas_curso': 2.07
        },
        'projecao_28_dias': {
            'leads': 9948,
            'cpl': 18.50,
            'investimento': 184000,
            'vendas_curso': 70,
            'receita_curso': 441000,
            'vendas_mentoria': 21,
            'receita_mentoria': 420000,
            'receita_total': 861000,
            'roas_curso': 2.39
        },
        'projecao_30_dias': {
            'leads': 10526,
            'cpl': 19.00,
            'investimento': 200000,
            'vendas_curso': 74,
            'receita_curso': 466200,
            'vendas_mentoria': 22,
            'receita_mentoria': 440000,
            'receita_total': 906200,
            'roas_curso': 2.27
        }
    },
    
    # Métricas de engajamento
    'engajamento': {
        'seguidores_instagram': 167666,
        'seguidores_youtube': 654814,
        'taxa_crescimento_instagram': 2.5,
        'taxa_crescimento_youtube': 1.8
    },
    
    # Insights de IA
    'insights_ia': [
        {
            'titulo': 'Facebook Domina a Captação',
            'descricao': 'Facebook representa 82.3% dos leads com CPL de R$ 17,01, sendo o canal mais eficiente em volume.',
            'impacto': 'alto',
            'recomendacao': 'Manter investimento no Facebook e otimizar campanhas para reduzir CPL.',
            'icone': 'facebook'
        },
        {
            'titulo': 'Instagram Orgânico Forte',
            'descricao': 'Instagram gera 930 leads orgânicos (9.8%), demonstrando forte engajamento da audiência.',
            'impacto': 'medio',
            'recomendacao': 'Investir em conteúdo orgânico no Instagram para maximizar conversões gratuitas.',
            'icone': 'instagram'
        },
        {
            'titulo': 'YouTube com CPL Elevado',
            'descricao': 'YouTube tem CPL de R$ 25,50, o mais alto entre os canais pagos, mas com boa qualidade de leads.',
            'impacto': 'medio',
            'recomendacao': 'Otimizar segmentação no YouTube ou reduzir investimento temporariamente.',
            'icone': 'youtube'
        },
        {
            'titulo': 'Meta de Leads Superada',
            'descricao': 'Captação de 9.474 leads superou a meta de 9.000 em 5.3%, demonstrando eficiência da campanha.',
            'impacto': 'alto',
            'recomendacao': 'Revisar metas para próximas campanhas considerando este desempenho superior.',
            'icone': 'target'
        },
        {
            'titulo': 'Concentração Regional',
            'descricao': 'Sudeste concentra 50% dos leads, indicando oportunidade de expansão para outras regiões.',
            'impacto': 'medio',
            'recomendacao': 'Desenvolver estratégias específicas para Nordeste e Sul para diversificar captação.',
            'icone': 'map'
        }
    ]
}

# Validar e aplicar dados seguros
DADOS_DASHBOARD = validar_dados_dashboard(DADOS_DASHBOARD_RAW)

# Log dos dados validados para debug
print("🔧 INICIALIZAÇÃO DO DASHBOARD CHT22 - ATUALIZADO:")
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
            time.sleep(60)

# Iniciar sincronização automática
def iniciar_sincronizacao():
    thread = threading.Thread(target=sincronizacao_automatica, daemon=True)
    thread.start()
    print("🔄 Sincronização automática iniciada!")

# Inicializar sincronização
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
        'percentual_leads_formatado': formatar_percentual_ptbr(percentual_leads)
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
        'ultima_atualizacao': datetime.now().strftime('%H:%M:%S'),
        'ultima_sincronizacao': ultima_sincronizacao.strftime('%H:%M:%S'),
        'sincronizacao': 'ativa' if sincronizacao_ativa else 'inativa',
        'total_leads': DADOS_DASHBOARD['total_leads'],
        'cpl_medio': DADOS_DASHBOARD['cpl_medio'],
        'dias_campanha': DADOS_DASHBOARD['dias_campanha']
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
