# 🚀 Dashboard CHT22 - Curso Viver de Pacientes High Ticket

## 📊 Sobre o Projeto
Dashboard interativo em tempo real para acompanhamento da captação de leads do lançamento CHT22 (Curso Viver de Pacientes High Ticket) da Nanda Mac.

### ✨ Características
- **Dados Reais:** Baseado na planilha `BasedeDadosParaoDashIACHT22.xlsx`
- **Atualização Diária:** Sistema automatizado para atualizações
- **Responsivo:** Funciona em desktop e mobile
- **Interativo:** Múltiplas abas com análises detalhadas

## 🛠️ Tecnologias Utilizadas
- **React 18** + **Vite**
- **Tailwind CSS** para estilização
- **Recharts** para gráficos
- **Lucide React** para ícones
- **Shadcn/ui** para componentes

## 📦 Estrutura do Projeto
```
dashboard-cht22/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── components/ui/       # Componentes UI
│   ├── assets/             # Imagens e recursos
│   └── data/               # Dados JSON
├── public/                 # Arquivos públicos
├── package.json           # Dependências
└── vite.config.mjs       # Configuração Vite
```

## 🚀 Deploy no Render

### **Método 1: Deploy Direto (Recomendado)**
1. Faça upload do ZIP para seu GitHub
2. No Render, conecte seu repositório GitHub
3. Configure as variáveis:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Node Version:** `18`

### **Método 2: Deploy Manual**
1. Extraia o ZIP em seu computador
2. Suba para um repositório GitHub
3. Conecte o Render ao repositório

## 🔧 Configuração Local

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn

### **Instalação**
```bash
# 1. Extrair o ZIP
unzip dashboard-cht22-completo.zip

# 2. Entrar no diretório
cd dashboard-cht

# 3. Instalar dependências
npm install

# 4. Executar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
```

## 📊 Sistema de Atualização Diária

### **Arquivos Incluídos:**
- `processo_atualizacao_dashboard.md` - Documentação completa
- `atualizar_dashboard_cht.py` - Script de automação

### **Processo Manual:**
1. Atualizar dados em `src/App.jsx`
2. Executar `npm run build`
3. Deploy automático no Render

### **Processo Automatizado:**
```bash
# Executar script de atualização
python3 atualizar_dashboard_cht.py

# Build do projeto
npm run build
```

## 📋 Dados Monitorados

### **Métricas Principais:**
- **Total de Leads:** 1.149 (4 dias)
- **CPL Médio:** R$ 15,23
- **Investimento Tráfego:** R$ 17.493,77
- **Meta:** 9.000 leads (12,8% atingido)
- **ROAS Previsto:** 2,90

### **Abas do Dashboard:**
1. **Visão Geral** - Métricas principais
2. **Origem & Conversão** - Canais de captação
3. **Segmentos Estratégicos** - Profissionais da saúde
4. **Análise Regional** - Distribuição geográfica
5. **Insights de IA** - Análises automatizadas
6. **Projeções do Resultado** - Previsões e metas

## 🔄 Atualizações Diárias

### **Campos que Mudam Diariamente:**
- Total de leads captados
- Dias de captação
- Investimento em tráfego
- Percentual da meta
- Textos descritivos
- Projeções

### **Fonte dos Dados:**
Todos os dados vêm da planilha `BasedeDadosParaoDashIACHT22.xlsx` que deve ser atualizada diariamente.

## 🌐 URLs de Produção

### **Render (Recomendado):**
- Deploy automático via GitHub
- SSL gratuito
- CDN global
- Builds automáticos

### **Outras Opções:**
- Vercel
- Netlify
- GitHub Pages

## 📞 Suporte

### **Estrutura de Dados:**
- Baseado em dados reais da captação CHT22
- Atualização diária necessária
- Fonte única: planilha Excel

### **Customização:**
- Cores e estilos em `src/App.jsx`
- Dados em `dadosCorrigidosCHT`
- Componentes UI em `src/components/ui/`

## 🎯 Próximos Passos

1. **Deploy Inicial:** Subir para Render/GitHub
2. **Teste:** Verificar funcionamento
3. **Automação:** Implementar atualizações diárias
4. **Monitoramento:** Acompanhar métricas

---

**📊 Dashboard CHT22 - Transformando dados em insights para o sucesso do lançamento!**

