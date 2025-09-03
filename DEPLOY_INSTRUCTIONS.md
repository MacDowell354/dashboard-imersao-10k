# 🚀 Instruções de Deploy - Dashboard Nanda Mac IA v2.0

## 📦 Arquivos Preparados para Deploy

### ✅ Arquivos Incluídos (16 arquivos):
1. **index.html** - Dashboard principal (CORRIGIDO v2.0)
2. **app.py** - Servidor Flask
3. **requirements.txt** - Dependências Python
4. **runtime.txt** - Versão Python (3.11.0)
5. **Procfile** - Configuração para deploy
6. **.gitignore** - Arquivos ignorados pelo Git
7. **README.md** - Documentação principal
8. **render.yaml** - Configuração específica Render
9. **package.json** - Metadados do projeto
10. **google_sheets_api_v2.py** - Script API
11. **dados_planilha.json** - Dados extraídos
12. **CELULAS_DEFINITIVAS_DASHBOARD_FINAL.md**
13. **CELULAS_CPL_CORRETAS_FINAL.md**
14. **extract_profissoes.py** - Script profissões
15. **DEPLOY_INSTRUCTIONS.md** - Este arquivo
16. **CHANGELOG.md** - **NOVO**: Histórico de correções

## 🔧 Correções v2.0

### **Dados de Projeção Corrigidos**
- ✅ Todos os valores da tabela "Performance Real (8 dias)" corrigidos
- ✅ Validação completa com planilha (linha 80)
- ✅ Cálculos proporcionais corretos (8/28 dias)
- ✅ ROAS e lucros recalculados corretamente

## 🔗 Deploy no GitHub + Render

### **Passo 1: GitHub**
1. Extrair o ZIP `dashboard_nanda_mac_ia_github_render.zip`
2. Criar repositório no GitHub: `dashboard-nanda-mac-ia`
3. Fazer upload de todos os arquivos
4. Commit: "Initial commit - Dashboard Nanda Mac IA"

### **Passo 2: Render**
1. Acessar [render.com](https://render.com)
2. Conectar conta GitHub
3. Criar novo "Web Service"
4. Selecionar repositório `dashboard-nanda-mac-ia`
5. Configurações automáticas:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment**: Python 3.11.0

### **Passo 3: Configurações Render**
```yaml
Name: dashboard-nanda-mac-ia
Environment: Python
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
Plan: Free
Health Check Path: /health
```

## 🔗 Deploy no Heroku (Alternativa)

### **Passo 1: Heroku CLI**
```bash
heroku create dashboard-nanda-mac-ia
git push heroku main
```

### **Passo 2: Configurações**
```bash
heroku config:set PYTHON_VERSION=3.11.0
heroku ps:scale web=1
```

## 🌐 URLs Esperadas

- **Render**: `https://dashboard-nanda-mac-ia.onrender.com`
- **Heroku**: `https://dashboard-nanda-mac-ia.herokuapp.com`
- **GitHub**: `https://github.com/usuario/dashboard-nanda-mac-ia`

## ✅ Verificações Pós-Deploy

1. **Health Check**: `/health` → Status: healthy
2. **Dashboard**: `/` → Carrega corretamente
3. **API Data**: `/api/data` → Retorna JSON
4. **Responsivo**: Funciona em mobile/desktop

## 🔧 Troubleshooting

### **Erro de Build**:
- Verificar `requirements.txt`
- Conferir `runtime.txt` (Python 3.11.0)

### **Erro de Start**:
- Verificar `Procfile`: `web: gunicorn app:app`
- Conferir `app.py` existe

### **Erro 404**:
- Verificar `index.html` na raiz
- Conferir rotas Flask em `app.py`

## 📊 Monitoramento

- **Logs**: Render/Heroku dashboard
- **Uptime**: Health check endpoint
- **Performance**: Response time monitoring

## 🔄 Atualizações Futuras

1. Push para GitHub
2. Deploy automático no Render
3. Verificar funcionamento
4. Monitorar logs

---

**Dashboard Nanda Mac IA pronto para deploy! 🚀**

