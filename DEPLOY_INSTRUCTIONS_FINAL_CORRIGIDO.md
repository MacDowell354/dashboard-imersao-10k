# 🚀 INSTRUÇÕES DE DEPLOY - Dashboard Nanda Mac IA CHT22

## 📦 **VERSÃO FINAL CORRIGIDA - PRONTA PARA PRODUÇÃO**

### ✅ **CORREÇÕES IMPLEMENTADAS:**
- ✅ Período corrigido para 10 dias (25/08 a 03/09)
- ✅ Data de última atualização automatizada
- ✅ Todos os dados sincronizados com planilha CHT22
- ✅ Tabelas e gráficos completamente atualizados
- ✅ API funcionando 100%

---

## 🔧 **DEPLOY NO GITHUB:**

### **1. Criar Repositório:**
```bash
# Extrair arquivos do zip
unzip dashboard_nanda_mac_ia_github_render_FINAL_CORRIGIDO.zip

# Inicializar repositório
cd dashboard_nanda_mac_ia_github_render_FINAL_CORRIGIDO
git init
git add .
git commit -m "Dashboard Nanda Mac IA CHT22 - Versão Final Corrigida"

# Conectar ao GitHub
git remote add origin https://github.com/SEU_USUARIO/dashboard-nanda-mac-ia-cht22.git
git branch -M main
git push -u origin main
```

### **2. Configurar Secrets (GitHub):**
- Não necessário - API pública configurada

---

## 🌐 **DEPLOY NO RENDER:**

### **Método 1: Deploy Automático (Recomendado)**
1. **Conectar Repositório:**
   - Acesse [render.com](https://render.com)
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub

2. **Configurações Automáticas:**
   - ✅ **Build Command:** Detectado automaticamente
   - ✅ **Start Command:** `python app.py`
   - ✅ **Environment:** Python 3.11.0
   - ✅ **Port:** 5000

3. **Deploy:**
   - Clique em "Create Web Service"
   - Deploy automático será iniciado

### **Método 2: Upload Manual**
1. **Render Dashboard:**
   - Acesse [render.com](https://render.com)
   - Clique em "New +" → "Web Service"
   - Escolha "Deploy from Git repository"

2. **Upload Arquivos:**
   - Faça upload do zip extraído
   - Configure conforme método 1

---

## ⚙️ **CONFIGURAÇÕES IMPORTANTES:**

### **Variáveis de Ambiente (Render):**
```
PORT=5000
PYTHON_VERSION=3.11.0
```

### **Arquivos de Configuração Incluídos:**
- ✅ `Procfile` - Comando de inicialização
- ✅ `requirements.txt` - Dependências Python
- ✅ `runtime.txt` - Versão Python
- ✅ `render.yaml` - Configuração automática

---

## 🔍 **VERIFICAÇÕES PÓS-DEPLOY:**

### **1. Endpoints Funcionais:**
```
✅ https://SEU_APP.onrender.com/
✅ https://SEU_APP.onrender.com/health
✅ https://SEU_APP.onrender.com/api/data
```

### **2. Funcionalidades:**
- ✅ Dashboard carregando corretamente
- ✅ Dados atualizando automaticamente
- ✅ Gráficos interativos funcionando
- ✅ Todas as 6 abas operacionais
- ✅ API Google Sheets conectada

### **3. Performance:**
- ✅ Tempo de carregamento < 3 segundos
- ✅ Atualizações automáticas a cada 5 minutos
- ✅ Responsivo em mobile e desktop

---

## 🆘 **TROUBLESHOOTING:**

### **Problema: Build Failed**
**Solução:**
```bash
# Verificar requirements.txt
pip install -r requirements.txt

# Testar localmente
python app.py
```

### **Problema: API não conecta**
**Solução:**
- Verificar se `google_sheets_api_v2.py` está incluído
- Testar endpoint `/api/data`
- Verificar logs do Render

### **Problema: Dashboard não carrega**
**Solução:**
- Verificar se `index.html` está na raiz
- Testar endpoint `/health`
- Verificar porta 5000

---

## 📊 **DADOS ESPERADOS APÓS DEPLOY:**

### **Dashboard deve mostrar:**
- ✅ **Total Leads:** 3.122
- ✅ **CPL Médio:** R$ 17,65
- ✅ **Investimento:** R$ 55.105,94
- ✅ **Período:** 10 DIAS (25/08 a 03/09)
- ✅ **Seguidores Instagram:** 163.938
- ✅ **Seguidores YouTube:** 636.224
- ✅ **Data atualização:** Automática em tempo real

### **API deve retornar:**
```json
{
  "Total_Leads": "3122",
  "CPL_Medio": "17.65",
  "Investimento_Total": "55105.94",
  "Seguidores_Instagram": "163938",
  "Seguidores_YouTube": "636224",
  ...
}
```

---

## 🎯 **SUCESSO DO DEPLOY:**

**✅ Dashboard funcionando em produção**
**✅ Dados atualizando automaticamente**
**✅ Todas as correções implementadas**
**✅ Performance otimizada**

---

**🚀 VERSÃO FINAL TESTADA E PRONTA PARA PRODUÇÃO!**

