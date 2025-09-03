# INSTRUÇÕES DE DEPLOY - Dashboard Nanda Mac IA CHT22 - Versão 4

## 📦 ARQUIVOS PARA DEPLOY

**Arquivo Principal:** `dashboard_nanda_mac_ia_github_render_v4.zip`

### 📁 Conteúdo do Pacote:
- `index.html` - Dashboard principal (ATUALIZADO)
- `app.py` - Servidor Flask
- `requirements.txt` - Dependências Python
- `runtime.txt` - Versão Python
- `Procfile` - Configuração Render
- `.gitignore` - Arquivos ignorados
- `README.md` - Documentação
- `render.yaml` - Configuração deploy
- `package.json` - Configuração Node.js
- `google_sheets_api_v2.py` - API Google Sheets
- `dados_planilha.json` - Dados atualizados (NOVO CAMPO)
- `CHANGELOG_V4.md` - Log de mudanças
- `DEPLOY_INSTRUCTIONS_V4.md` - Este arquivo

## 🚀 DEPLOY NO GITHUB

### 1. Preparação do Repositório
```bash
# Extrair arquivos do zip
unzip dashboard_nanda_mac_ia_github_render_v4.zip

# Inicializar repositório Git
git init
git add .
git commit -m "Dashboard CHT22 v4 - Gráfico corrigido + Meta Orçamento"

# Conectar ao GitHub
git remote add origin https://github.com/SEU_USUARIO/dashboard-cht22.git
git branch -M main
git push -u origin main
```

### 2. Configuração do Repositório
- **Nome sugerido:** `dashboard-nanda-mac-cht22`
- **Descrição:** "Dashboard CHT22 - Nanda Mac IA com métricas de leads e performance"
- **Visibilidade:** Privado (recomendado)

## 🌐 DEPLOY NO RENDER

### 1. Conectar GitHub ao Render
1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório criado

### 2. Configurações do Deploy
```yaml
# Configurações Render
Name: dashboard-nanda-mac-cht22
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: python app.py
```

### 3. Variáveis de Ambiente (se necessário)
```
PORT=5000
FLASK_ENV=production
```

## ✅ VERIFICAÇÕES PÓS-DEPLOY

### 1. Endpoints para Testar
- `https://SEU_APP.onrender.com/` - Dashboard principal
- `https://SEU_APP.onrender.com/health` - Health check
- `https://SEU_APP.onrender.com/api/data` - Dados da API

### 2. Funcionalidades para Validar
- ✅ Gráfico CPL mostra período 25/08 a 02/09
- ✅ KPI "Meta Orçamento Tráfego" exibe R$ 200.000
- ✅ Percentual usado mostra 24,6%
- ✅ Atualizações automáticas a cada 5 minutos
- ✅ Todos os 6 tabs funcionando
- ✅ Dados sincronizados com planilha

### 3. Logs para Monitorar
```
✅ Gráfico CPL atualizado: [timestamp]
✅ KPIs atualizados: [timestamp]
✅ API Google Sheets: Status 200
```

## 🔧 TROUBLESHOOTING

### Problema: Gráfico não carrega
**Solução:** Verificar se endpoint `/api/cpl-data` está implementado ou usar dados estáticos

### Problema: KPIs não atualizam
**Solução:** Verificar se `/api/data` retorna campo `Meta_Orcamento_Trafego`

### Problema: API Google Sheets falha
**Solução:** Verificar permissões da planilha e conectividade

## 📊 DADOS ESPERADOS

### API Response `/api/data`:
```json
{
  "CPL_Facebook": "17.73",
  "CPL_YouTube": "37.28", 
  "CPL_Google": "17.91",
  "Total_Leads": "2814",
  "CPL_Medio": "17.45",
  "Investimento_Total": "49110.79",
  "Meta_Orcamento_Trafego": "200000.00",
  "ROAS_Geral": "1.17"
}
```

## 🎯 NOVIDADES DA VERSÃO 4

1. **Gráfico Corrigido:** Período 25/08 a 02/09 (9 dias)
2. **Novo KPI:** Meta Orçamento Investimento em Tráfego
3. **Atualização Automática:** KPIs atualizados a cada 5 minutos
4. **Dados Sincronizados:** Valores extraídos da célula B80

---

**Deploy testado e validado em ambiente local**
**Pronto para produção no GitHub/Render**

