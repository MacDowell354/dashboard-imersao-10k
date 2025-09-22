# Dashboard CHT22 - Deploy GitHub/Render

## 🚀 Instruções de Deploy

### 📋 **Pré-requisitos**
- Conta no GitHub
- Conta no Render.com
- Arquivo ZIP do dashboard

### 🔧 **Deploy no GitHub**

#### 1. Criar Repositório
```bash
# No GitHub, criar novo repositório
# Nome sugerido: dashboard-cht22
# Público ou Privado (sua escolha)
```

#### 2. Upload dos Arquivos
```bash
# Extrair o ZIP e fazer upload dos arquivos:
- app_atualizado.py (arquivo principal)
- requirements.txt
- Procfile
- templates/ (pasta completa)
- static/ (pasta completa)
- utils.py
- README.md
- .gitignore
```

#### 3. Estrutura Final no GitHub
```
dashboard-cht22/
├── app_atualizado.py
├── utils.py
├── requirements.txt
├── Procfile
├── README.md
├── .gitignore
├── templates/
│   ├── dashboard.html
│   ├── visao_geral_atualizada.html
│   ├── origem_conversao_atualizada.html
│   ├── profissao_canal_atualizada.html
│   ├── analise_regional_atualizada.html
│   ├── insights_ia_atualizada.html
│   └── projecao_resultados_atualizada.html
└── static/
    └── style.css
```

### 🌐 **Deploy no Render**

#### 1. Conectar GitHub ao Render
- Acesse render.com
- Faça login/cadastro
- Conecte sua conta GitHub

#### 2. Criar Web Service
- Clique em "New +"
- Selecione "Web Service"
- Conecte o repositório GitHub criado

#### 3. Configurações do Deploy
```yaml
Name: dashboard-cht22
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app_atualizado:app
```

#### 4. Variáveis de Ambiente (Opcional)
```
FLASK_ENV=production
PORT=10000
```

### ⚙️ **Arquivos Importantes**

#### Procfile
```
web: gunicorn app_atualizado:app --bind 0.0.0.0:$PORT
```

#### requirements.txt
```
Flask==2.3.3
requests==2.31.0
gunicorn==21.2.0
```

#### app_atualizado.py
- Arquivo principal da aplicação
- Contém todas as rotas e dados
- Configurado para produção

### 🔄 **Sincronização Automática**
- ✅ Dashboard sincroniza com Google Sheets automaticamente
- ✅ Dados atualizados a cada 5 minutos
- ✅ Todas as 6 abas funcionais
- ✅ Tabela de projeções atualizada

### 📊 **Funcionalidades Incluídas**
- **🏠 Visão Geral** - Métricas principais
- **📊 Origem e Conversão** - Performance por canal
- **👥 Profissão por Canal** - Distribuição de avatar
- **🗺️ Análise Regional** - Performance geográfica
- **🤖 Insights de IA** - Análises preditivas
- **📈 Projeção de Resultado** - Cenários e projeções

### 🌐 **URLs de Acesso**
Após o deploy no Render, você receberá uma URL como:
```
https://dashboard-cht22.onrender.com
```

### 🔧 **Troubleshooting**

#### Erro de Build
```bash
# Verificar se requirements.txt está correto
# Verificar se Procfile aponta para app_atualizado:app
```

#### Erro de Runtime
```bash
# Verificar logs no Render Dashboard
# Verificar se todas as dependências estão instaladas
```

#### Erro de Sincronização
```bash
# Verificar se Google Sheets está público
# Verificar URL da planilha no código
```

### 📞 **Suporte**
- Dashboard testado e funcionando 100%
- Todas as funcionalidades validadas
- Sincronização automática ativa
- Interface responsiva (desktop/mobile)

### ✅ **Checklist Final**
- [ ] Repositório GitHub criado
- [ ] Arquivos enviados para GitHub
- [ ] Web Service criado no Render
- [ ] Deploy realizado com sucesso
- [ ] URL pública funcionando
- [ ] Todas as abas acessíveis
- [ ] Sincronização com planilha ativa

**Status:** ✅ Pronto para deploy em produção!
