# 📊 PROCESSO DE ATUALIZAÇÃO DIÁRIA DO DASHBOARD CHT22

## 🎯 IMPORTÂNCIA DA PLANILHA
A planilha `BasedeDadosParaoDashIACHT22.xlsx` é a **fonte única da verdade** para todos os dados do dashboard. Ela deve ser consultada diariamente para manter o dashboard atualizado com os dados reais da captação.

## 📋 DADOS PRINCIPAIS A MONITORAR DIARIAMENTE

### 1️⃣ **CAPTAÇÃO DE LEADS (Linhas 41-44 da planilha)**
- **25/08:** 242 leads
- **26/08:** 291 leads  
- **27/08:** 271 leads
- **28/08:** 345 leads
- **TOTAL ATUAL:** 1.149 leads em 4 dias

### 2️⃣ **INVESTIMENTO EM TRÁFEGO**
- **Valor atual:** R$ 17.493,77 (4 dias)
- **CPL médio:** R$ 15,23

### 3️⃣ **CAMPOS NO CÓDIGO A ATUALIZAR**
```javascript
const dadosCorrigidosCHT = {
  metricas_principais: {
    total_leads: 1149,  // ← ATUALIZAR COM SOMA DOS LEADS
    investimento_4_dias: "17.493,77",  // ← ATUALIZAR COM VALOR DA PLANILHA
    dias_incorridos: 4,  // ← INCREMENTAR A CADA DIA
    dias_restantes: 24,  // ← DECREMENTAR A CADA DIA
    data_atualizacao: '28/08/2025 - CAPTAÇÃO EM ANDAMENTO (4 dias)',  // ← ATUALIZAR DATA E DIAS
  }
}
```

## 🔄 PROCESSO DIÁRIO DE ATUALIZAÇÃO

### **PASSO 1: Ler a planilha atualizada**
```python
# Script para ler dados da planilha
import pandas as pd
df = pd.read_excel('BasedeDadosParaoDashIACHT22.xlsx', sheet_name=0, header=None)
```

### **PASSO 2: Extrair dados específicos**
- **Leads por dia:** Linhas 41-44, coluna com "QT Leads Dia"
- **Investimento tráfego:** Procurar por "INVESTIMENTO EM TRÁFEGO"
- **CPL:** Procurar por "CPL TOTAL"

### **PASSO 3: Atualizar código do dashboard**
- Arquivo: `/home/ubuntu/dashboard-cht/src/App.jsx`
- Seções a atualizar:
  - `total_leads`
  - `investimento_X_dias`
  - `dias_incorridos`
  - `dias_restantes`
  - `data_atualizacao`
  - Textos nos insights de IA
  - Banner principal
  - Tabela de projeções

### **PASSO 4: Rebuild e deploy**
```bash
cd /home/ubuntu/dashboard-cht
npm run build
```

## 📊 ESTRUTURA DA PLANILHA (REFERÊNCIA)

### **Seção de Leads (Linhas 39-44)**
```
Linha 39: Cabeçalhos (QT Leads Dia, Leads Dia, etc.)
Linha 41: 2025-08-25 | 242 leads
Linha 42: 2025-08-26 | 291 leads  
Linha 43: 2025-08-27 | 271 leads
Linha 44: 2025-08-28 | 345 leads
```

### **Seção de Investimento**
- Procurar por "INVESTIMENTO EM TRÁFEGO"
- Valor atual: R$ 17.493,77

### **Seção de CPL**
- Procurar por "CPL TOTAL"
- Valor atual: R$ 15,23

## ⚠️ PONTOS DE ATENÇÃO

1. **Sempre verificar a soma dos leads** para confirmar o total
2. **CPL pode variar** conforme o investimento e leads aumentam
3. **Datas devem ser atualizadas** em todos os textos
4. **Projeções de 28 dias** devem ser recalculadas conforme progresso
5. **Meta percentual** deve ser recalculada (leads_atual / 9000)

## 🚀 AUTOMAÇÃO FUTURA

Para facilitar o processo, pode-se criar:
1. **Script Python** que lê a planilha automaticamente
2. **Geração automática** do código JavaScript
3. **Deploy automatizado** após atualização
4. **Notificações** quando novos dados estão disponíveis

---

**📝 NOTA:** Este processo garante que o dashboard sempre reflita os dados mais atuais da captação CHT22, mantendo a precisão e confiabilidade das informações apresentadas.

