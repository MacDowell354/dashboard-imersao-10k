# 🔧 Troubleshooting - Deploy Render Dashboard CHT22

## 📋 Visão Geral

Este guia contém soluções para os problemas mais comuns encontrados durante e após o deploy do Dashboard CHT22 no Render.com.

## 🚨 Problemas de Build

### ❌ Problema 1: Build Failed - Dependencies

**Sintomas:**
```
ERROR: Could not find a version that satisfies the requirement Flask==2.3.3
ERROR: No matching distribution found for Flask==2.3.3
Build failed
```

**Causa:** Versão específica do Flask não disponível ou incompatível.

**✅ Solução:**
1. **Editar requirements.txt:**
```txt
# Alterar de versões específicas:
Flask==2.3.3
requests==2.31.0

# Para versões flexíveis:
Flask>=2.0.0,<3.0.0
requests>=2.25.0,<3.0.0
```

2. **Commit e push:**
```bash
git add requirements.txt
git commit -m "Fix dependencies versions"
git push origin main
```

**🔍 Verificação:**
- Build deve completar sem erros
- Logs mostram "Successfully installed Flask-X.X.X"

---

### ❌ Problema 2: Build Failed - Python Version

**Sintomas:**
```
ERROR: Python version 3.11.0 not found
Using default Python version
Build failed
```

**Causa:** Versão do Python especificada não disponível.

**✅ Solução:**
1. **Verificar runtime.txt:**
```txt
# Versões suportadas pelo Render:
python-3.11.0
python-3.10.8
python-3.9.16
```

2. **Se necessário, usar versão alternativa:**
```txt
python-3.10.8
```

3. **Commit e push:**
```bash
git add runtime.txt
git commit -m "Update Python version"
git push origin main
```

---

### ❌ Problema 3: Build Failed - Missing Files

**Sintomas:**
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
Build failed
```

**Causa:** Arquivo requirements.txt não encontrado no repositório.

**✅ Solução:**
1. **Verificar estrutura do repositório:**
```
dashboard-cht22/
├── app.py                 ✅
├── requirements.txt       ❌ FALTANDO
├── Procfile              ✅
└── templates/            ✅
```

2. **Criar requirements.txt:**
```txt
Flask>=2.0.0,<3.0.0
requests>=2.25.0,<3.0.0
```

3. **Upload para GitHub:**
- Via interface web: Add file → Create new file
- Nome: `requirements.txt`
- Conteúdo: dependências acima

---

## 🚨 Problemas de Deploy

### ❌ Problema 4: Application Error

**Sintomas:**
```
Application Error
An error occurred in the application and your page could not be served.
```

**Causa:** Erro na inicialização da aplicação Flask.

**✅ Solução:**
1. **Verificar Procfile:**
```
web: python app.py
```

2. **Verificar app.py - configuração de porta:**
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
```

3. **Verificar logs no Render:**
- Dashboard → Logs
- Procurar por erros Python

**🔍 Logs Comuns:**
```
ModuleNotFoundError: No module named 'flask'
→ Problema no requirements.txt

Address already in use
→ Problema na configuração de porta

ImportError: cannot import name 'app'
→ Problema na estrutura do código
```

---

### ❌ Problema 5: Service Won't Start

**Sintomas:**
```
Service failed to start
Exit code: 1
```

**Causa:** Erro na execução do comando start.

**✅ Solução:**
1. **Verificar comando start no Render:**
```
Start Command: python app.py
```

2. **Verificar se app.py está no root:**
```
dashboard-cht22/
├── app.py              ✅ Deve estar aqui
└── src/
    └── app.py          ❌ Não aqui
```

3. **Se app.py estiver em subpasta:**
```
Start Command: python src/app.py
```

---

## 🚨 Problemas de Funcionamento

### ❌ Problema 6: 404 Not Found

**Sintomas:**
- Dashboard carrega, mas abas retornam 404
- URLs como `/origem-conversao` não funcionam

**Causa:** Rotas não definidas corretamente.

**✅ Solução:**
1. **Verificar rotas no app.py:**
```python
@app.route('/')
def visao_geral():
    return render_template('dashboard.html', aba_ativa='visao-geral')

@app.route('/origem-conversao')
def origem_conversao():
    return render_template('dashboard.html', aba_ativa='origem-conversao')

@app.route('/profissao-canal')
def profissao_canal():
    return render_template('dashboard.html', aba_ativa='profissao-canal')

@app.route('/analise-regional')
def analise_regional():
    return render_template('dashboard.html', aba_ativa='analise-regional')

@app.route('/insights-ia')
def insights_ia():
    return render_template('dashboard.html', aba_ativa='insights-ia')

@app.route('/projecao-resultados')
def projecao_resultados():
    return render_template('dashboard.html', aba_ativa='projecao-resultados')
```

2. **Verificar links no template:**
```html
<a href="/" class="nav-tab">🏠 Visão Geral</a>
<a href="/origem-conversao" class="nav-tab">📊 Origem e Conversão</a>
<a href="/profissao-canal" class="nav-tab">👥 Profissão por Canal</a>
```

---

### ❌ Problema 7: Template Not Found

**Sintomas:**
```
TemplateNotFound: dashboard.html
jinja2.exceptions.TemplateNotFound: dashboard.html
```

**Causa:** Templates não encontrados na pasta correta.

**✅ Solução:**
1. **Verificar estrutura de pastas:**
```
dashboard-cht22/
├── app.py
├── templates/                    ✅ Pasta deve existir
│   ├── dashboard.html           ✅
│   ├── visao_geral.html         ✅
│   └── ...
```

2. **Verificar configuração Flask:**
```python
app = Flask(__name__)
# Flask automaticamente procura em ./templates/
```

3. **Se templates estão em outra pasta:**
```python
app = Flask(__name__, template_folder='meus_templates')
```

---

### ❌ Problema 8: Dados Incorretos/Zerados

**Sintomas:**
- Dashboard carrega mas mostra dados zerados
- Métricas não fazem sentido
- CPL muito alto ou muito baixo

**Causa:** Problemas na estrutura de dados ou sincronização.

**✅ Solução:**
1. **Verificar DADOS_DASHBOARD no app.py:**
```python
DADOS_DASHBOARD = {
    'dias_campanha': 17,
    'total_leads': 5585,
    'cpl_medio': 17.30,
    'investimento_total': 96609.49,
    'roas_geral': 2.00,
    # ... resto dos dados
}
```

2. **Verificar se sincronização está desativada:**
```python
# Linha 176 em app.py deve estar comentada:
# iniciar_sincronizacao()
```

3. **Testar API de dados:**
```
https://SEU_APP.onrender.com/api/dados
```

---

## 🚨 Problemas de Performance

### ❌ Problema 9: Slow Cold Starts

**Sintomas:**
- Primeira requisição muito lenta (>30 segundos)
- Timeout ocasional
- "This site can't be reached"

**Causa:** Render Free tier hiberna aplicações inativas.

**✅ Soluções:**

**Opção A: Upgrade para Starter ($7/mês)**
- No painel Render: Settings → Plan → Starter
- Elimina hibernação

**Opção B: Keep-Alive Gratuito**
```python
# Adicionar ao app.py
import threading
import requests
import time

def keep_alive():
    while True:
        try:
            requests.get('https://SEU_APP.onrender.com/api/status')
            time.sleep(840)  # 14 minutos
        except:
            pass

# Iniciar thread
threading.Thread(target=keep_alive, daemon=True).start()
```

**Opção C: External Ping Service**
- UptimeRobot.com (gratuito)
- Pingdom
- Configurar ping a cada 5 minutos

---

### ❌ Problema 10: Memory Limit Exceeded

**Sintomas:**
```
Process killed due to memory limit
R14 - Memory quota exceeded
```

**Causa:** Aplicação usando muita memória.

**✅ Solução:**
1. **Otimizar imports:**
```python
# Evitar imports desnecessários
# import pandas as pd  # Remove se não usar
# import numpy as np   # Remove se não usar
```

2. **Limpar dados em cache:**
```python
import gc

def limpar_memoria():
    gc.collect()
    
# Chamar periodicamente
```

3. **Upgrade para plano superior:**
- Starter: 512MB RAM
- Standard: 2GB RAM

---

## 🚨 Problemas de Conectividade

### ❌ Problema 11: API Endpoints 500 Error

**Sintomas:**
- `/api/status` retorna erro 500
- `/api/dados` não responde

**Causa:** Erro na implementação das APIs.

**✅ Solução:**
1. **Verificar rotas API:**
```python
@app.route('/api/status')
def api_status():
    return jsonify({
        'status': 'online',
        'ultima_atualizacao': datetime.now().strftime('%H:%M:%S'),
        'sincronizacao': 'ativa'
    })

@app.route('/api/dados')
def api_dados():
    return jsonify(DADOS_DASHBOARD)
```

2. **Verificar imports:**
```python
from flask import Flask, render_template, jsonify
from datetime import datetime
```

---

### ❌ Problema 12: CORS Issues

**Sintomas:**
```
Access to fetch at 'https://app.onrender.com/api/dados' from origin 'https://frontend.com' has been blocked by CORS policy
```

**Causa:** Política CORS restritiva.

**✅ Solução:**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite todas as origens

# Ou mais restritivo:
CORS(app, origins=['https://meudominio.com'])
```

---

## 🚨 Problemas de Sincronização

### ❌ Problema 13: Google Sheets Sync Error

**Sintomas:**
```
❌ Erro na sincronização: invalid literal for int() with base 10: 'Data Início'
```

**Causa:** Sincronização tentando converter cabeçalhos.

**✅ Solução:**
1. **Manter sincronização desativada:**
```python
# Linha 176 em app.py:
# iniciar_sincronizacao()  # Comentada
```

2. **Se precisar ativar, corrigir função:**
```python
def extrair_dados_planilha():
    try:
        # ... código de extração
        if len(rows) >= 2:
            # Pular linha de cabeçalho (índice 0)
            # Usar linha de dados (índice 1)
            valores = []
            for cell in rows[1].get('c', []):
                if cell and 'v' in cell:
                    valor = cell['v']
                    if isinstance(valor, (int, float)):
                        valores.append(valor)
                    else:
                        valores.append(0)
```

---

## 🛠️ Ferramentas de Diagnóstico

### 🔍 Verificação Rápida

**1. Status da Aplicação:**
```bash
curl https://SEU_APP.onrender.com/api/status
```

**2. Teste de Conectividade:**
```bash
curl -I https://SEU_APP.onrender.com
```

**3. Verificar Headers:**
```bash
curl -v https://SEU_APP.onrender.com
```

### 📊 Monitoramento

**1. Logs em Tempo Real:**
- Render Dashboard → Logs
- Filtrar por ERROR, WARNING

**2. Métricas de Performance:**
- Response time
- Memory usage
- CPU usage

**3. Uptime Monitoring:**
- UptimeRobot
- Pingdom
- StatusCake

### 🧪 Testes Automatizados

**Script de Teste:**
```python
import requests
import json

def testar_dashboard(base_url):
    tests = [
        ('/', 'Dashboard principal'),
        ('/api/status', 'API Status'),
        ('/api/dados', 'API Dados'),
        ('/origem-conversao', 'Aba Origem'),
        ('/profissao-canal', 'Aba Profissão'),
    ]
    
    for endpoint, nome in tests:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            status = "✅ OK" if response.status_code == 200 else f"❌ {response.status_code}"
            print(f"{nome}: {status}")
        except Exception as e:
            print(f"{nome}: ❌ ERRO - {e}")

# Usar:
testar_dashboard("https://SEU_APP.onrender.com")
```

## 📞 Quando Pedir Ajuda

### 🆘 Render Support

**Casos para contatar Render:**
- Build falha sem motivo aparente
- Service não inicia após várias tentativas
- Problemas de infraestrutura
- Billing issues

**Como contatar:**
- help@render.com
- Community forum: community.render.com
- Twitter: @render

### 🔧 Informações para Incluir

**Sempre forneça:**
1. **Service ID** (encontrado na URL)
2. **Timestamp** do problema
3. **Logs completos** do erro
4. **Passos para reproduzir**
5. **Configurações** do service

### 📋 Template de Suporte

```
Subject: Dashboard CHT22 - [TIPO DO PROBLEMA]

Service: dashboard-cht22
Service ID: srv-xxxxxxxxxxxxx
Timestamp: 2025-09-11 14:30:00 UTC

Problema:
[Descrição detalhada]

Logs:
[Colar logs relevantes]

Configuração:
- Build Command: pip install -r requirements.txt
- Start Command: python app.py
- Environment: Python 3

Tentativas de solução:
[O que já foi tentado]
```

## ✅ Checklist de Resolução

### Antes de Pedir Ajuda

- [ ] Verificar logs no painel Render
- [ ] Testar localmente
- [ ] Verificar configurações básicas
- [ ] Consultar este guia de troubleshooting
- [ ] Testar com configuração mínima

### Problemas Resolvidos

- [ ] Build completa sem erros
- [ ] Service status "Live"
- [ ] Dashboard carrega corretamente
- [ ] Todas as 6 abas funcionam
- [ ] APIs respondem corretamente
- [ ] Performance aceitável

---

## 🎯 Resumo de Soluções Rápidas

| Problema | Solução Rápida |
|----------|----------------|
| Build Failed | Verificar `requirements.txt` e `runtime.txt` |
| App Error | Verificar `Procfile` e configuração de porta |
| 404 Errors | Verificar rotas no `app.py` |
| Template Not Found | Verificar pasta `templates/` |
| Slow Performance | Upgrade para Starter ou implementar keep-alive |
| API Errors | Verificar imports e implementação das rotas |
| Sync Errors | Manter sincronização desativada |

---

**🔧 Dashboard CHT22 - Troubleshooting Render**  
*Soluções práticas para deploy sem problemas*

