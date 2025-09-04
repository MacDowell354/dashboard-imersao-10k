# 🚀 INSTRUÇÕES DE DEPLOY - Dashboard Nanda Mac IA CHT22 - VERSÃO ORÇAMENTO

## 📦 **VERSÃO ORÇAMENTO FINAL - CARDS ATUALIZADOS**

### ✅ **ALTERAÇÕES DESTA VERSÃO:**
- ❌ Removido card "Taxa Conversão" (0,70%)
- ✅ Adicionado card "Orçamento Captação" (36%)
- ✅ Adicionado card "Orçamento + Aquecimento" (26%)
- ✅ API atualizada com novos campos de orçamento
- ✅ JavaScript com cálculos automáticos

---

## 🔧 **DEPLOY NO GITHUB:**

### **1. Criar/Atualizar Repositório:**
```bash
# Extrair arquivos do zip
unzip dashboard_nanda_mac_ia_github_render_ORCAMENTO_FINAL.zip

# Atualizar repositório existente
cd dashboard-nanda-mac-ia-cht22
git add .
git commit -m "Atualização: Cards de Orçamento - Substituição Taxa Conversão"
git push origin main

# OU criar novo repositório
git init
git add .
git commit -m "Dashboard Nanda Mac IA CHT22 - Versão Orçamento Final"
git remote add origin https://github.com/SEU_USUARIO/dashboard-nanda-mac-ia-cht22.git
git branch -M main
git push -u origin main
```

---

## 🌐 **DEPLOY NO RENDER:**

### **Atualização Automática (Recomendado):**
1. **Se já conectado ao GitHub:**
   - Render detectará automaticamente as mudanças
   - Deploy será iniciado automaticamente
   - Aguardar conclusão (2-3 minutos)

2. **Se primeiro deploy:**
   - Acesse [render.com](https://render.com)
   - "New +" → "Web Service"
   - Conecte repositório GitHub
   - Configurações automáticas aplicadas

### **Verificação Pós-Deploy:**
```
✅ https://SEU_APP.onrender.com/
✅ https://SEU_APP.onrender.com/health
✅ https://SEU_APP.onrender.com/api/data
```

---

## 📊 **NOVOS DADOS ESPERADOS:**

### **Cards Principais (Visão Geral):**
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  10 DIAS    │   113%      │     36%     │     26%     │    2,53     │
│ Lançamento  │  Meta CPL   │  Orçamento  │  Orçamento  │ ROAS Geral  │
│   Ativo     │             │  Captação   │ + Aquecim.  │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### **API Endpoint `/api/data` deve retornar:**
```json
{
  "Total_Leads": "3122",
  "CPL_Medio": "17.65",
  "Investimento_Total": "55105.94",
  "Orcamento_Captacao_Previsto": "154296.63",
  "Orcamento_Captacao_Realizado": "55105.94",
  "Orcamento_Total_Previsto": "214296.63",
  "Orcamento_Total_Realizado": "55105.94",
  "Seguidores_Instagram": "163938",
  "Seguidores_YouTube": "636224",
  ...
}
```

### **Cálculos Automáticos:**
- **Orçamento Captação:** (55.106 / 154.297) × 100 = 36%
- **Orçamento + Aquecimento:** (55.106 / 214.297) × 100 = 26%

---

## 🔍 **VERIFICAÇÕES OBRIGATÓRIAS:**

### **1. Cards Funcionando:**
- ✅ Card "Orçamento Captação" mostra 36%
- ✅ Card "Orçamento + Aquecimento" mostra 26%
- ✅ Valores atualizando automaticamente
- ✅ Layout responsivo mantido

### **2. API Funcionando:**
- ✅ Endpoint `/health` retorna status healthy
- ✅ Endpoint `/api/data` retorna novos campos
- ✅ Dados sincronizados com planilha CHT22

### **3. Funcionalidades Mantidas:**
- ✅ Atualizações automáticas (5 minutos)
- ✅ Data/hora em tempo real
- ✅ Todas as 6 tabs funcionais
- ✅ Gráficos e tabelas operacionais

---

## 🆘 **TROUBLESHOOTING:**

### **Cards não aparecem:**
```bash
# Verificar se classes CSS estão corretas
grep -n "budget-card\|budget-total-card" index.html

# Verificar JavaScript
grep -n "budgetCard\|budgetTotalCard" index.html
```

### **Percentuais incorretos:**
```bash
# Testar API
curl https://SEU_APP.onrender.com/api/data | grep Orcamento

# Verificar cálculos no console do navegador
```

### **Layout quebrado:**
- Verificar se CSS está carregando
- Testar em diferentes dispositivos
- Verificar console do navegador

---

## 📈 **MÉTRICAS DE SUCESSO:**

### **Dashboard deve mostrar:**
- ✅ **10 DIAS** (período correto)
- ✅ **36%** (Orçamento Captação)
- ✅ **26%** (Orçamento + Aquecimento)
- ✅ **3.122 leads** (total atual)
- ✅ **R$ 17,65** (CPL médio)
- ✅ **Data atual** (última atualização)

### **Performance esperada:**
- ✅ **Carregamento:** < 3 segundos
- ✅ **Responsividade:** Mobile e desktop
- ✅ **Atualizações:** A cada 5 minutos
- ✅ **Uptime:** 99%+

---

## 🎯 **COMPARAÇÃO VERSÕES:**

### **ANTES (Taxa Conversão):**
```
[10 DIAS] [113%] [0,70%] [2,53]
```

### **DEPOIS (Orçamento):**
```
[10 DIAS] [113%] [36%] [26%] [2,53]
```

### **Benefícios:**
- ✅ Melhor visibilidade do orçamento
- ✅ Dados mais relevantes para gestão
- ✅ Atualizações automáticas mantidas
- ✅ Layout mais informativo

---

**🚀 VERSÃO ORÇAMENTO FINAL PRONTA PARA PRODUÇÃO!**

**Deploy testado e validado com novos cards de orçamento funcionando perfeitamente!**

