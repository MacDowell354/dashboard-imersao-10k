# 🚀 INSTRUÇÕES DE DEPLOY - Dashboard Nanda Mac IA V3.0

## 📦 CONTEÚDO DO PACOTE

### ✅ Arquivos Principais (17 arquivos):
1. **index.html** - Dashboard principal (110KB) ✨ ATUALIZADO V3.0
2. **app.py** - Servidor Flask para produção
3. **requirements.txt** - Dependências Python
4. **runtime.txt** - Versão Python (3.11.0)
5. **Procfile** - Configuração Render/Heroku
6. **render.yaml** - Configuração específica Render
7. **package.json** - Metadados do projeto
8. **.gitignore** - Arquivos ignorados pelo Git
9. **README.md** - Documentação principal
10. **google_sheets_api_v2.py** - Script API Google Sheets
11. **dados_planilha.json** - Dados extraídos
12. **extract_profissoes.py** - Script extração profissões
13. **CELULAS_DEFINITIVAS_DASHBOARD_FINAL.md** - Mapeamento células
14. **CELULAS_CPL_CORRETAS_FINAL.md** - Células CPL específicas
15. **DEPLOY_INSTRUCTIONS.md** - Instruções V2.0
16. **CHANGELOG.md** - Histórico V2.0
17. **CHANGELOG_V3.md** - ✨ NOVO: Histórico V3.0

## 🔧 DEPLOY NO GITHUB + RENDER

### 1️⃣ PREPARAÇÃO
```bash
# Extrair ZIP
unzip dashboard_nanda_mac_ia_github_render_v3.zip
cd dashboard_nanda_mac_ia_github_render_v3/
```

### 2️⃣ GITHUB
```bash
# Inicializar repositório
git init
git add .
git commit -m "Dashboard Nanda Mac IA V3.0 - Sistema completo com auto-update"

# Conectar ao GitHub
git remote add origin https://github.com/SEU_USUARIO/dashboard-nanda-mac-ia.git
git branch -M main
git push -u origin main
```

### 3️⃣ RENDER
1. **Conectar**: render.com → Connect GitHub Repository
2. **Configurar**:
   - **Name**: dashboard-nanda-mac-ia
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
3. **Deploy**: Automático após conexão

### 4️⃣ VERIFICAÇÃO
- **GitHub**: `https://github.com/SEU_USUARIO/dashboard-nanda-mac-ia`
- **Render**: `https://dashboard-nanda-mac-ia.onrender.com`
- **Health**: `/health` → Status 200 OK

## ✨ NOVIDADES V3.0

### 🔄 SISTEMA DE ATUALIZAÇÃO AUTOMÁTICA
- **Gráfico CPL**: Atualização automática a cada 5 minutos
- **Tabela Profissões**: Atualização automática a cada 5 minutos
- **Projeção Resultados**: Atualização automática a cada 5 minutos
- **Botões manuais**: Em todas as seções principais
- **Visibility Detection**: Atualiza quando usuário volta à aba

### 📊 CORREÇÕES CRÍTICAS
- **Meta LEADs**: Corrigido de 5.000 para **9.000** (conforme planilha B72)
- **Dados atualizados**: 9 dias de campanha (2.814 leads)
- **Investimentos corretos**: Facebook (T72), YouTube (AF72), Google (AC72)
- **Projeções precisas**: Baseadas em dados reais da planilha

### 🎯 CLASSIFICAÇÃO DE AVATAR
- **Avatar Ideal**: Médicos + Dentistas (37% dos leads)
- **Avatar Secundário**: Outras profissões da saúde (43% dos leads)
- **Fora do Avatar**: Categoria "Outra" (20% dos leads)

### 🧠 INSIGHTS IA REVISADOS
- **6 cards estratégicos** com recomendações baseadas em dados reais
- **Análise focada** no avatar ideal (médicos/dentistas)
- **Status corretos**: YouTube (Crítico), Google (Bom), Facebook (Excelente)

## 🔗 ENDPOINTS API

### 📡 Disponíveis:
- `/` - Dashboard principal
- `/health` - Status da aplicação
- `/api/data` - Dados básicos (JSON)
- `/api/cpl-data` - Dados gráfico CPL (NOVO)
- `/api/profession-data` - Dados profissões (NOVO)
- `/api/projection-data` - Dados projeções (NOVO)

## 🎯 MONITORAMENTO

### ✅ Verificar após deploy:
1. **Dashboard carrega** corretamente
2. **6 abas funcionais** navegáveis
3. **Botões de atualização** funcionando
4. **Auto-update** ativo (console logs)
5. **Dados corretos** exibidos (meta 9.000)
6. **Responsivo** mobile/desktop
7. **Performance** adequada

### 📊 Testes Específicos V3.0:
- **Gráfico CPL**: Clique em "🔄 Atualizar" → Feedback "✓ Atualizado"
- **Tabela Profissões**: Clique em "🔄 Atualizar" → Feedback visual
- **Projeções**: Clique em "🔄 Atualizar Projeções" → Confirmação
- **Console**: Verificar logs de atualização automática

## 🔧 TROUBLESHOOTING V3.0

### **Auto-update não funciona**:
- Verificar console JavaScript
- Confirmar endpoints API configurados
- Testar botões manuais primeiro

### **Dados incorretos**:
- Verificar meta LEADs = 9.000
- Confirmar total leads = 2.814
- Validar investimentos por canal

### **Performance lenta**:
- Verificar intervalo de 5 minutos
- Confirmar cache funcionando
- Monitorar requests API

## 📞 SUPORTE
- **Documentação**: README.md
- **Changelog V3**: CHANGELOG_V3.md
- **Issues**: GitHub Issues
- **Logs**: Render Dashboard

---

**VERSÃO 3.0 COM SISTEMA COMPLETO DE AUTO-UPDATE PRONTA PARA PRODUÇÃO! 🚀**

