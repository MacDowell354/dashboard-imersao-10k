# 📊 Dashboard CHT22 - Versão V11

**Dashboard de Performance em Tempo Real para Lançamento CHT22**

[![Deploy](https://img.shields.io/badge/Deploy-Render-brightgreen)](https://render.com)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-red)](https://flask.palletsprojects.com)

## 🎯 Sobre o Projeto

Dashboard completo para monitoramento em tempo real do lançamento CHT22 (Consultório High Ticket), desenvolvido em Python/Flask com sincronização automática com Google Sheets.

### ✨ Funcionalidades Principais

- 📊 **Visão Geral** - Métricas principais e KPIs
- 📈 **Origem e Conversão** - Análise por canal de tráfego
- 👥 **Profissão por Canal** - Segmentação por profissão
- 🗺️ **Análise Regional** - Distribuição geográfica
- 🤖 **Insights de IA** - Análises preditivas automáticas
- 📈 **Projeção de Resultados** - Projeções e cenários

### 🔄 Sincronização Automática

- **Fonte de Dados:** Google Sheets
- **Frequência:** A cada 5 minutos
- **Status:** Tempo real
- **Dados:** 7.195+ leads processados

## 🚀 Deploy Rápido

### Render (Recomendado)

1. **Fork este repositório**
2. **Conecte no Render:**
   - New Web Service
   - Connect Repository
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

### Configurações

```yaml
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: python app.py
Port: 5000
```

## 📊 Dados Atuais (V11)

### 🎯 Performance (20 dias)
- **Leads:** 7.195
- **CPL:** R$ 15,13
- **ROAS:** 2,32
- **Investimento:** R$ 108.807,59

### 📈 Projeção (28 dias)
- **Leads:** 10.073 ✅
- **Vendas:** 71 ✅
- **Lucro:** R$ 255.543,16
- **ROAS:** 2,32

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Python 3.11+
- pip

### Instalação
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/dashboard-cht22-v11.git
cd dashboard-cht22-v11

# Instale as dependências
pip install -r requirements.txt

# Execute o aplicativo
python app.py
```

### Acesso Local
```
http://localhost:5002
```

## 📁 Estrutura do Projeto

```
├── app.py                          # Aplicação Flask principal
├── requirements.txt                # Dependências Python
├── templates/
│   ├── dashboard.html             # Template base
│   ├── visao_geral.html          # Página inicial
│   ├── origem_conversao.html     # Análise de origem
│   ├── profissao_canal.html      # Análise por profissão
│   ├── analise_regional.html     # Análise regional
│   ├── insights_ia.html          # Insights de IA
│   └── projecao_resultados.html  # Projeções (V11 - Atualizado)
├── static/
│   └── style.css                  # Estilos CSS
├── README.md                      # Este arquivo
├── CHANGELOG_FINAL_V11.md         # Log de mudanças
└── INSTRUCOES_DEPLOY_GITHUB_RENDER_V11.md  # Instruções detalhadas
```

## 🆕 Novidades V11

### ✅ Correções Críticas
- **Cards dos Insights IA atualizados** com dados corretos da planilha
- **Leads:** 9.896 → 10.073 ✅
- **Vendas:** 69 → 71 ✅
- **CPL:** R$ 19,84 → R$ 19,04 ✅
- **Status:** Agora mostra "Acima do Otimista" (cards verdes)

### 🔄 Melhorias
- Sincronização automática reativada
- Interface responsiva otimizada
- Performance melhorada
- Dados em tempo real

## 📊 Tecnologias

- **Backend:** Python 3.11, Flask 2.3.3
- **Frontend:** HTML5, CSS3, JavaScript
- **Dados:** Google Sheets API
- **Deploy:** Render, GitHub
- **Monitoramento:** Tempo real

## 📞 Suporte

### 🔧 Troubleshooting
- Verifique os logs no painel do Render
- Confirme as variáveis de ambiente
- Teste localmente primeiro

### 📊 Monitoramento
- **Status:** Dashboard funcionando
- **Performance:** < 3s carregamento
- **Dados:** Sincronização ativa

## 📄 Licença

Este projeto é propriedade da equipe Nanda Mac e destina-se ao uso interno para monitoramento do lançamento CHT22.

---

**🎯 Dashboard CHT22 V11 - Dados Corretos, Performance Otimizada**

**Desenvolvido por:** Equipe Manus  
**Data:** 15/09/2025  
**Status:** ✅ Pronto para Produção

