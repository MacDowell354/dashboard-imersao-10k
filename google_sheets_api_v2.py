#!/usr/bin/env python3
"""
Script melhorado para extrair dados da planilha CHT22 via API do Google Sheets
Versão 2 - Com diferentes abordagens de acesso
"""

import requests
import json
import re
from urllib.parse import quote

def extract_sheet_id(url):
    """Extrai o ID da planilha da URL"""
    pattern = r'/spreadsheets/d/([a-zA-Z0-9-_]+)'
    match = re.search(pattern, url)
    return match.group(1) if match else None

def get_range_values(sheet_id, range_name):
    """
    Método 1: Usar range para buscar área específica
    """
    try:
        # URL para buscar range específico
        url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq"
        
        # Query para buscar range
        query = f"SELECT * WHERE A IS NOT NULL"
        params = {
            'tq': query,
            'tqx': 'out:csv',
            'range': range_name
        }
        
        response = requests.get(url, params=params)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}...")
        
        return response.text if response.status_code == 200 else None
        
    except Exception as e:
        print(f"Erro no método 1: {e}")
        return None

def get_csv_export(sheet_id):
    """
    Método 2: Exportar como CSV
    """
    try:
        # URL para exportar como CSV
        url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
        
        response = requests.get(url)
        print(f"CSV Status: {response.status_code}")
        
        if response.status_code == 200:
            # Salvar CSV para análise
            with open('/home/ubuntu/planilha_export.csv', 'w', encoding='utf-8') as f:
                f.write(response.text)
            print("✅ CSV exportado com sucesso!")
            return response.text
        else:
            print(f"❌ Erro ao exportar CSV: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Erro no método 2: {e}")
        return None

def get_json_export(sheet_id):
    """
    Método 3: Tentar diferentes formatos JSON
    """
    try:
        # Diferentes URLs para tentar
        urls = [
            f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:json",
            f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:json&tq=SELECT%20*",
            f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/A1:ZZ100?key=AIzaSyD-9tSrke72PouQMnMX-a7UAHXE6Uu-Nus"
        ]
        
        for i, url in enumerate(urls, 1):
            print(f"Tentando método 3.{i}...")
            response = requests.get(url)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✅ Método 3.{i} funcionou!")
                return response.text
            else:
                print(f"❌ Método 3.{i} falhou")
        
        return None
        
    except Exception as e:
        print(f"Erro no método 3: {e}")
        return None

def parse_csv_for_cells(csv_content, target_cells):
    """
    Analisa CSV para encontrar células específicas
    """
    if not csv_content:
        return {}
    
    lines = csv_content.split('\n')
    results = {}
    
    print(f"📊 CSV tem {len(lines)} linhas")
    print(f"Primeiras 5 linhas:")
    for i, line in enumerate(lines[:5]):
        print(f"  {i+1}: {line[:100]}...")
    
    # Tentar encontrar dados nas linhas 72-80
    for line_num in range(70, min(85, len(lines))):
        if line_num < len(lines):
            line = lines[line_num]
            print(f"Linha {line_num+1}: {line[:200]}...")
    
    return results

def main():
    """Função principal"""
    # URL da planilha CHT22
    sheet_url = "https://docs.google.com/spreadsheets/d/1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT/edit?usp=sharing&ouid=116968302822653702456&rtpof=true&sd=true"
    
    # Extrair ID da planilha
    sheet_id = extract_sheet_id(sheet_url)
    if not sheet_id:
        print("❌ Erro: Não foi possível extrair o ID da planilha")
        return
    
    print(f"📊 ID da planilha: {sheet_id}")
    
    # Tentar diferentes métodos
    print("\n🔍 MÉTODO 1: Range específico")
    range_data = get_range_values(sheet_id, "A70:ZZ85")
    
    print("\n🔍 MÉTODO 2: Export CSV")
    csv_data = get_csv_export(sheet_id)
    
    print("\n🔍 MÉTODO 3: JSON APIs")
    json_data = get_json_export(sheet_id)
    
    # Analisar CSV se disponível
    if csv_data:
        print("\n📋 ANALISANDO CSV:")
        target_cells = ["VT72", "AH72", "AE72", "U72", "X72", "AG72", "AD72", "O73", "I73", "T80", "R80", "S80"]
        results = parse_csv_for_cells(csv_data, target_cells)
    
    print("\n✅ Análise concluída!")

if __name__ == "__main__":
    main()

