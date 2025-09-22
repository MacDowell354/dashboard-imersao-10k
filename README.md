# 📊 Dashboard CHT22 - Analytics e Insights

Dashboard completo para análise de campanhas CHT22 com dados em tempo real, formatação PT-BR e insights de IA.

## 🚀 Deploy Rápido

### **Opção 1: Deploy Direto no Render**
1. Faça upload desta pasta no Render
2. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

### **Opção 2: Deploy via GitHub + Render**
1. Faça upload destes arquivos no seu repositório GitHub
2. Conecte o repositório no Render
3. Use as mesmas configurações acima

## 📋 Estrutura dos Arquivos

```
dashboard_cht22/
├── app.py              # Aplicação Flask principal
├── utils.py            # Funções auxiliares e validação
├── requirements.txt    # Dependências Python
├── Procfile           # Configuração Gunicorn
├── templates/         # Templates HTML (6 abas)
└── static/           # Estilos CSS
```

## ✅ Funcionalidades

- **6 Abas Funcionais:** Visão Geral, Origem/Conversão, Profissão/Canal, Análise Regional, Insights IA, Projeção Resultados
- **Formatação PT-BR:** Todos os valores em formato brasileiro
- **Sincronização Automática:** Dados atualizados a cada 5 minutos
- **Interface Responsiva:** Desktop e mobile
- **Insights de IA:** Análises preditivas e recomendações

## 📊 Dados Atuais

- **7.713 leads** em 21 dias
- **CPL R$ 15,57**
- **Investimento R$ 120.114,64**
- **ROAS 2,24**
- **27 estados ativos**

## 🔧 Configurações Render

```
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
Runtime: Python 3
```

## 🎯 Resultado

Dashboard 100% funcional com todas as funcionalidades ativas e dados em tempo real.

**Referência funcionando:** https://g8h3ilc3p5ln.manus.space

---

**Desenvolvido para CHT22 - Versão Final de Produção**

