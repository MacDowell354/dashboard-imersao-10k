# 🚀 INSTRUÇÕES DE DEPLOY - Dashboard CHT22 V11

**Versão:** V11 - CORREÇÃO CRÍTICA DOS CARDS  
**Data:** 15/09/2025  
**Status:** ✅ PRONTO PARA DEPLOY

## 📦 ARQUIVOS PARA DEPLOY

### 🎯 Diretório Principal: `/home/ubuntu/dashboard_python/`

**Estrutura dos arquivos:**
```
dashboard_python/
├── app.py                          # Aplicação Flask principal
├── requirements.txt                # Dependências Python
├── templates/
│   ├── dashboard.html             # Template base
│   ├── visao_geral.html          # Página inicial
│   ├── origem_conversao.html     # Análise de origem
│   ├── profissao_canal.html      # Análise por profissão
│   ├── analise_regional.html     # Análise regional
│   ├── insights_ia.html          # Insights de IA
│   └── projecao_resultados.html  # Projeções (ATUALIZADO V11)
└── static/
    └── style.css                  # Estilos CSS
```

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### 📋 Dependências (requirements.txt):
```
Flask==2.3.3
requests==2.31.0
python-dateutil==2.8.2
```

### 🌐 Variáveis de Ambiente:
- **PORT:** 5000 (padrão Render)
- **FLASK_ENV:** production

## 🚀 DEPLOY NO GITHUB

### 1️⃣ Criar Repositório
```bash
# Criar novo repositório no GitHub
# Nome sugerido: dashboard-cht22-v11
```

### 2️⃣ Preparar Arquivos Locais
```bash
# Copiar arquivos do dashboard
cp -r /home/ubuntu/dashboard_python/* ./
```

### 3️⃣ Configurar Git
```bash
git init
git add .
git commit -m "Dashboard CHT22 V11 - Cards corrigidos conforme planilha"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/dashboard-cht22-v11.git
git push -u origin main
```

## 🌐 DEPLOY NO RENDER

### 1️⃣ Conectar GitHub
1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório `dashboard-cht22-v11`

### 2️⃣ Configurações do Render
```yaml
Name: dashboard-cht22-v11
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: python app.py
```

### 3️⃣ Variáveis de Ambiente
```
PORT=5000
FLASK_ENV=production
```

### 4️⃣ Deploy Automático
- ✅ Auto-Deploy: Habilitado
- ✅ Branch: main
- ✅ Root Directory: /

## 📊 VALIDAÇÃO PÓS-DEPLOY

### 🧪 Checklist de Testes:
- [ ] **URL funcionando:** https://dashboard-cht22-v11.onrender.com
- [ ] **Navegação:** Todas as 6 abas carregando
- [ ] **Dados:** Cards com valores corretos (10.073 leads, 71 vendas)
- [ ] **Responsividade:** Desktop e mobile funcionando
- [ ] **Sincronização:** Dados atualizando automaticamente

### 📱 URLs de Teste:
- **Visão Geral:** `/`
- **Origem e Conversão:** `/origem-conversao`
- **Profissão por Canal:** `/profissao-canal`
- **Análise Regional:** `/analise-regional`
- **Insights IA:** `/insights-ia`
- **Projeção de Resultados:** `/projecao-resultados` ⭐ **ATUALIZADO**

## 🔄 SINCRONIZAÇÃO AUTOMÁTICA

### 📊 Google Sheets Integration:
- **URL:** https://docs.google.com/spreadsheets/d/1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT/edit
- **Aba:** inputs_dashboard_cht22
- **Frequência:** A cada 5 minutos
- **Status:** ✅ Ativo

### 🔧 Configuração Automática:
```python
# Sincronização ativa no app.py
sincronizacao_ativa = True
```

## 🎯 PRINCIPAIS CORREÇÕES V11

### ✅ Cards dos Insights IA Corrigidos:
- **Leads:** 10.073 (era 9.896)
- **Vendas:** 71 (era 69)
- **CPL:** R$ 19,04 (era R$ 19,84)
- **Status:** "Acima do Otimista" (era "Próximo/Abaixo")

### 🎨 Melhorias Visuais:
- Cards verdes para performance acima do otimista
- Diferenças positivas destacadas
- Percentuais atualizados

## 🚨 TROUBLESHOOTING

### ❌ Problemas Comuns:

**1. Build Error no Render:**
```bash
# Verificar requirements.txt
# Garantir que Flask==2.3.3 está listado
```

**2. App não inicia:**
```bash
# Verificar Start Command: python app.py
# Verificar PORT=5000 nas variáveis de ambiente
```

**3. Dados não carregam:**
```bash
# Verificar conexão com Google Sheets
# Verificar logs do Render para erros de API
```

### ✅ Soluções:
1. **Logs:** Verificar logs no painel do Render
2. **Rebuild:** Fazer rebuild manual se necessário
3. **Variáveis:** Confirmar todas as variáveis de ambiente

## 📞 SUPORTE

### 🔧 Comandos Úteis:
```bash
# Testar localmente
python app.py

# Verificar dependências
pip freeze

# Logs em tempo real
tail -f logs/app.log
```

### 📊 Monitoramento:
- **Status:** Verificar dashboard funcionando
- **Performance:** Tempo de carregamento < 3s
- **Dados:** Sincronização automática ativa

---

## ✅ RESUMO FINAL

**🎯 Dashboard CHT22 V11 está pronto para deploy com:**
- ✅ Cards corrigidos conforme planilha
- ✅ Sincronização automática ativa
- ✅ Interface responsiva
- ✅ Performance otimizada
- ✅ Dados em tempo real

**🚀 Deploy estimado:** 5-10 minutos  
**🌐 URL final:** https://dashboard-cht22-v11.onrender.com

**📞 Em caso de dúvidas, consulte os logs do Render ou entre em contato com a equipe técnica.**

