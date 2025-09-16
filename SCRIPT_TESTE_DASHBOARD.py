#!/usr/bin/env python3
"""
Script de Teste Automatizado - Dashboard CHT22
Testa todas as funcionalidades após deploy no Render
"""

import requests
import json
import time
from datetime import datetime

class TesteDashboard:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.resultados = []
        
    def log(self, teste, status, detalhes=""):
        timestamp = datetime.now().strftime("%H:%M:%S")
        resultado = {
            'timestamp': timestamp,
            'teste': teste,
            'status': status,
            'detalhes': detalhes
        }
        self.resultados.append(resultado)
        
        emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{emoji} [{timestamp}] {teste}: {status}")
        if detalhes:
            print(f"    {detalhes}")
    
    def testar_conectividade(self):
        """Teste básico de conectividade"""
        try:
            response = requests.get(self.base_url, timeout=10)
            if response.status_code == 200:
                self.log("Conectividade Básica", "PASS", f"Status: {response.status_code}")
                return True
            else:
                self.log("Conectividade Básica", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("Conectividade Básica", "FAIL", f"Erro: {str(e)}")
            return False
    
    def testar_pagina_principal(self):
        """Testa se a página principal carrega corretamente"""
        try:
            response = requests.get(self.base_url, timeout=10)
            if response.status_code == 200:
                content = response.text
                
                # Verificar elementos essenciais
                checks = [
                    ("Título Dashboard", "Dashboard CHT22" in content),
                    ("Navegação", "Visão Geral" in content),
                    ("Métricas", "17 DIAS" in content),
                    ("CSS", "style" in content or "css" in content.lower())
                ]
                
                falhas = [check[0] for check in checks if not check[1]]
                
                if not falhas:
                    self.log("Página Principal", "PASS", "Todos os elementos encontrados")
                    return True
                else:
                    self.log("Página Principal", "FAIL", f"Elementos faltando: {', '.join(falhas)}")
                    return False
            else:
                self.log("Página Principal", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("Página Principal", "FAIL", f"Erro: {str(e)}")
            return False
    
    def testar_navegacao_abas(self):
        """Testa navegação entre todas as abas"""
        abas = [
            ('/', 'Visão Geral'),
            ('/origem-conversao', 'Origem e Conversão'),
            ('/profissao-canal', 'Profissão por Canal'),
            ('/analise-regional', 'Análise Regional'),
            ('/insights-ia', 'Insights de IA'),
            ('/projecao-resultados', 'Projeção de Resultados')
        ]
        
        sucessos = 0
        for url, nome in abas:
            try:
                response = requests.get(f"{self.base_url}{url}", timeout=10)
                if response.status_code == 200:
                    if nome.replace(' ', '').lower() in response.text.replace(' ', '').lower():
                        self.log(f"Aba {nome}", "PASS")
                        sucessos += 1
                    else:
                        self.log(f"Aba {nome}", "FAIL", "Conteúdo não encontrado")
                else:
                    self.log(f"Aba {nome}", "FAIL", f"Status: {response.status_code}")
            except Exception as e:
                self.log(f"Aba {nome}", "FAIL", f"Erro: {str(e)}")
        
        if sucessos == len(abas):
            self.log("Navegação Completa", "PASS", f"{sucessos}/{len(abas)} abas funcionando")
            return True
        else:
            self.log("Navegação Completa", "FAIL", f"Apenas {sucessos}/{len(abas)} abas funcionando")
            return False
    
    def testar_api_status(self):
        """Testa API de status"""
        try:
            response = requests.get(f"{self.base_url}/api/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                # Verificar campos obrigatórios
                campos_obrigatorios = ['status', 'ultima_atualizacao']
                campos_presentes = all(campo in data for campo in campos_obrigatorios)
                
                if campos_presentes and data.get('status') == 'online':
                    self.log("API Status", "PASS", f"Status: {data.get('status')}")
                    return True
                else:
                    self.log("API Status", "FAIL", "Campos obrigatórios ausentes ou status incorreto")
                    return False
            else:
                self.log("API Status", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("API Status", "FAIL", f"Erro: {str(e)}")
            return False
    
    def testar_api_dados(self):
        """Testa API de dados"""
        try:
            response = requests.get(f"{self.base_url}/api/dados", timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                # Verificar estrutura de dados
                campos_essenciais = [
                    'total_leads', 'cpl_medio', 'dias_campanha', 
                    'roas_geral', 'canais', 'profissoes'
                ]
                
                campos_presentes = all(campo in data for campo in campos_essenciais)
                
                # Verificar valores esperados
                valores_corretos = (
                    data.get('total_leads') == 5585 and
                    data.get('cpl_medio') == 17.3 and
                    data.get('dias_campanha') == 17
                )
                
                if campos_presentes and valores_corretos:
                    self.log("API Dados", "PASS", f"Leads: {data.get('total_leads')}, CPL: {data.get('cpl_medio')}")
                    return True
                else:
                    self.log("API Dados", "FAIL", "Estrutura ou valores incorretos")
                    return False
            else:
                self.log("API Dados", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log("API Dados", "FAIL", f"Erro: {str(e)}")
            return False
    
    def testar_performance(self):
        """Testa performance básica"""
        tempos = []
        
        for i in range(3):
            try:
                start_time = time.time()
                response = requests.get(self.base_url, timeout=10)
                end_time = time.time()
                
                if response.status_code == 200:
                    tempo_resposta = end_time - start_time
                    tempos.append(tempo_resposta)
                    time.sleep(1)  # Pausa entre testes
            except:
                pass
        
        if tempos:
            tempo_medio = sum(tempos) / len(tempos)
            tempo_max = max(tempos)
            
            if tempo_medio < 3.0:
                self.log("Performance", "PASS", f"Tempo médio: {tempo_medio:.2f}s, Máximo: {tempo_max:.2f}s")
                return True
            else:
                self.log("Performance", "WARN", f"Tempo médio alto: {tempo_medio:.2f}s")
                return False
        else:
            self.log("Performance", "FAIL", "Não foi possível medir performance")
            return False
    
    def executar_todos_testes(self):
        """Executa todos os testes"""
        print(f"🧪 Iniciando testes do Dashboard CHT22")
        print(f"🌐 URL: {self.base_url}")
        print(f"⏰ Início: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)
        
        testes = [
            self.testar_conectividade,
            self.testar_pagina_principal,
            self.testar_navegacao_abas,
            self.testar_api_status,
            self.testar_api_dados,
            self.testar_performance
        ]
        
        sucessos = 0
        for teste in testes:
            if teste():
                sucessos += 1
            print()  # Linha em branco entre testes
        
        # Resumo final
        print("-" * 60)
        print(f"📊 RESUMO DOS TESTES")
        print(f"✅ Sucessos: {sucessos}/{len(testes)}")
        print(f"❌ Falhas: {len(testes) - sucessos}/{len(testes)}")
        
        if sucessos == len(testes):
            print(f"🎉 TODOS OS TESTES PASSARAM! Dashboard funcionando perfeitamente.")
            status_final = "SUCESSO"
        elif sucessos >= len(testes) * 0.8:  # 80% ou mais
            print(f"⚠️  MAIORIA DOS TESTES PASSOU. Verificar falhas menores.")
            status_final = "PARCIAL"
        else:
            print(f"🚨 MUITOS TESTES FALHARAM. Dashboard precisa de correções.")
            status_final = "FALHA"
        
        print(f"⏰ Fim: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return status_final, self.resultados
    
    def gerar_relatorio(self, arquivo="relatorio_teste_dashboard.txt"):
        """Gera relatório detalhado dos testes"""
        with open(arquivo, 'w', encoding='utf-8') as f:
            f.write("RELATÓRIO DE TESTES - DASHBOARD CHT22\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"URL Testada: {self.base_url}\n")
            f.write(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for resultado in self.resultados:
                f.write(f"[{resultado['timestamp']}] {resultado['teste']}: {resultado['status']}\n")
                if resultado['detalhes']:
                    f.write(f"    {resultado['detalhes']}\n")
                f.write("\n")
        
        print(f"📄 Relatório salvo em: {arquivo}")

def main():
    """Função principal"""
    import sys
    
    if len(sys.argv) != 2:
        print("Uso: python script_teste_dashboard.py <URL_DO_DASHBOARD>")
        print("Exemplo: python script_teste_dashboard.py https://dashboard-cht22.onrender.com")
        sys.exit(1)
    
    url = sys.argv[1]
    
    # Executar testes
    teste = TesteDashboard(url)
    status, resultados = teste.executar_todos_testes()
    
    # Gerar relatório
    teste.gerar_relatorio()
    
    # Exit code baseado no resultado
    if status == "SUCESSO":
        sys.exit(0)
    elif status == "PARCIAL":
        sys.exit(1)
    else:
        sys.exit(2)

if __name__ == "__main__":
    main()

