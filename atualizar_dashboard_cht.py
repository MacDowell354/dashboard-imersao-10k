#!/usr/bin/env python3
"""
Script para atualização automática do Dashboard CHT22
Baseado nos dados da planilha BasedeDadosParaoDashIACHT22.xlsx
"""

import pandas as pd
import re
from datetime import datetime, timedelta
import os

def ler_dados_planilha(caminho_planilha):
    """Lê e extrai dados específicos da planilha CHT22"""
    try:
        # Ler planilha sem cabeçalho
        df = pd.read_excel(caminho_planilha, sheet_name=0, header=None)
        
        dados = {
            'leads_por_dia': [],
            'total_leads': 0,
            'investimento_trafego': 0,
            'cpl_total': 15.23,  # Valor padrão
            'dias_captacao': 0
        }
        
        # Procurar dados de leads por dia (linhas 41-44)
        for i in range(40, min(50, len(df))):
            try:
                # Verificar se há data na linha
                data_cell = df.iloc[i, 5]  # Coluna F (índice 5)
                leads_cell = df.iloc[i, 6]  # Coluna G (índice 6) - QT Leads Dia
                
                if pd.notna(data_cell) and pd.notna(leads_cell):
                    if isinstance(data_cell, datetime) or '2025-08' in str(data_cell):
                        leads_valor = int(leads_cell) if leads_cell > 0 else 0
                        if leads_valor > 0:
                            dados['leads_por_dia'].append({
                                'data': data_cell,
                                'leads': leads_valor
                            })
                            dados['total_leads'] += leads_valor
                            dados['dias_captacao'] += 1
            except:
                continue
        
        # Procurar investimento em tráfego
        for i in range(len(df)):
            for j in range(len(df.columns)):
                cell_value = str(df.iloc[i, j])
                if 'INVESTIMENTO EM TRÁFEGO' in cell_value.upper():
                    # Procurar valor nas células próximas
                    for k in range(max(0, j-2), min(len(df.columns), j+3)):
                        try:
                            valor = df.iloc[i+1, k]  # Linha seguinte
                            if pd.notna(valor) and isinstance(valor, (int, float)) and valor > 1000:
                                dados['investimento_trafego'] = valor
                                break
                        except:
                            continue
        
        return dados
        
    except Exception as e:
        print(f"Erro ao ler planilha: {e}")
        return None

def gerar_codigo_atualizado(dados):
    """Gera o código JavaScript atualizado com os novos dados"""
    
    total_leads = dados['total_leads']
    dias_captacao = dados['dias_captacao']
    investimento = f"{dados['investimento_trafego']:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
    
    # Data atual
    data_atual = datetime.now().strftime('%d/%m/%Y')
    
    codigo_js = f"""// Dados CORRETOS do lançamento CHT - {data_atual} - CAPTAÇÃO EM ANDAMENTO
const dadosCorrigidosCHT = {{
  metricas_principais: {{
    cac: "15,23",  // CPL CORRETO da planilha (formato brasileiro)
    total_leads: {total_leads},  // ATUALIZADO - {dias_captacao} dias de captação
    roas_previsto: "2,90",  // CORRETO DA PLANILHA (formato brasileiro)
    faturamento_previsto: 354696,  // CORRETO DA PLANILHA - R$ 354.696,30
    investimento_{dias_captacao}_dias: "{investimento}",  // Valor correto da planilha para {dias_captacao} dias
    data_atualizacao: '{data_atual} - CAPTAÇÃO EM ANDAMENTO ({dias_captacao} dias)',
    meta_leads: 9000,  // Meta total de leads
    taxa_conversao: 0.007,  // 0,7% da planilha
    vendas_previstas: 56,  // Vendas previstas da planilha
    preco_curso: 6300,  // Preço do curso
    dias_incorridos: {dias_captacao},
    dias_restantes: {28 - dias_captacao},
    total_dias: 28
  }},"""
    
    return codigo_js

def atualizar_dashboard(dados):
    """Atualiza o arquivo do dashboard com os novos dados"""
    
    caminho_app = '/home/ubuntu/dashboard-cht/src/App.jsx'
    
    if not os.path.exists(caminho_app):
        print(f"Arquivo não encontrado: {caminho_app}")
        return False
    
    try:
        # Ler arquivo atual
        with open(caminho_app, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        
        # Dados para atualização
        total_leads = dados['total_leads']
        dias_captacao = dados['dias_captacao']
        investimento = f"{dados['investimento_trafego']:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        data_atual = datetime.now().strftime('%d/%m/%Y')
        
        # Substituições necessárias
        substituicoes = [
            # Dados principais
            (r'total_leads: \d+,', f'total_leads: {total_leads},'),
            (r'investimento_\d+_dias: "[^"]+",', f'investimento_{dias_captacao}_dias: "{investimento}",'),
            (r'dias_incorridos: \d+,', f'dias_incorridos: {dias_captacao},'),
            (r'dias_restantes: \d+,', f'dias_restantes: {28 - dias_captacao},'),
            (r'data_atualizacao: \'[^\']+\',', f'data_atualizacao: \'{data_atual} - CAPTAÇÃO EM ANDAMENTO ({dias_captacao} dias)\','),
            
            # Textos descritivos
            (r'{total_leads} leads captados em \d+ dias', f'{total_leads} leads captados em {dias_captacao} dias'),
            (r'Primeiros \d+ dias com [^.]+', f'Primeiros {dias_captacao} dias com {total_leads} leads captados e CPL R$ 15,23'),
            (r'Captação em andamento: \d+ dias', f'Captação em andamento: {dias_captacao} dias'),
            (r'\d+ dias captação', f'{dias_captacao} dias captação'),
            (r'Performance Real \(\d+ dias\)', f'Performance Real ({dias_captacao} dias)'),
            (r'R\$ [0-9.,]+(?=</td>.*Investimento Tráfego)', f'R$ {investimento}'),
        ]
        
        # Aplicar substituições
        for padrao, substituicao in substituicoes:
            conteudo = re.sub(padrao, substituicao, conteudo)
        
        # Salvar arquivo atualizado
        with open(caminho_app, 'w', encoding='utf-8') as f:
            f.write(conteudo)
        
        print(f"✅ Dashboard atualizado com sucesso!")
        print(f"📊 Dados: {total_leads} leads em {dias_captacao} dias")
        print(f"💰 Investimento: R$ {investimento}")
        
        return True
        
    except Exception as e:
        print(f"Erro ao atualizar dashboard: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 ATUALIZADOR AUTOMÁTICO DO DASHBOARD CHT22")
    print("=" * 50)
    
    # Caminho da planilha
    caminho_planilha = '/home/ubuntu/upload/BasedeDadosParaoDashIACHT22.xlsx'
    
    if not os.path.exists(caminho_planilha):
        print(f"❌ Planilha não encontrada: {caminho_planilha}")
        return
    
    # Ler dados da planilha
    print("📊 Lendo dados da planilha...")
    dados = ler_dados_planilha(caminho_planilha)
    
    if not dados:
        print("❌ Erro ao ler dados da planilha")
        return
    
    # Mostrar dados extraídos
    print(f"✅ Dados extraídos:")
    print(f"   📈 Total de leads: {dados['total_leads']}")
    print(f"   📅 Dias de captação: {dados['dias_captacao']}")
    print(f"   💰 Investimento tráfego: R$ {dados['investimento_trafego']:,.2f}")
    
    # Atualizar dashboard
    print("\n🔄 Atualizando dashboard...")
    if atualizar_dashboard(dados):
        print("\n🎯 PRÓXIMOS PASSOS:")
        print("1. cd /home/ubuntu/dashboard-cht")
        print("2. npm run build")
        print("3. Verificar dashboard atualizado")
    else:
        print("❌ Falha na atualização do dashboard")

if __name__ == "__main__":
    main()

