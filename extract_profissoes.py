#!/usr/bin/env python3
import requests
import csv
from io import StringIO

# URL da planilha
sheet_id = '1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT'
url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv'

# Baixar CSV
response = requests.get(url)
if response.status_code == 200:
    # Ler CSV
    csv_reader = csv.reader(StringIO(response.text))
    lines = list(csv_reader)
    
    print('📊 PROCURANDO DADOS DE PROFISSÕES...')
    
    # Procurar por linhas que contenham profissões
    for i, line in enumerate(lines):
        line_text = ' '.join(line).lower()
        if any(word in line_text for word in ['dentista', 'medico', 'fisio', 'nutri', 'psico', 'profiss']):
            print(f'Linha {i+1}: {line[:10]}')
    
    # Verificar linhas específicas onde podem estar os dados
    print('\n📋 VERIFICANDO LINHAS 30-60:')
    for i in range(29, min(60, len(lines))):
        if i < len(lines):
            line = lines[i]
            if any(cell.strip() for cell in line[:10]):  # Se há dados nas primeiras 10 colunas
                print(f'Linha {i+1}: {line[:15]}')
                
    # Verificar se há dados na área da imagem (parece ser por volta da linha 40-50)
    print('\n🔍 ÁREA ESPECÍFICA (linhas 35-55):')
    for i in range(34, min(55, len(lines))):
        if i < len(lines):
            line = lines[i]
            print(f'Linha {i+1}: {line}')
else:
    print('❌ Erro ao acessar planilha')

