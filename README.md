# Dashboard CHT22 - Origem e Conversão

Dashboard completo para análise de performance de campanhas de marketing digital do lançamento CHT22.

## 📊 Funcionalidades

- **Visão Geral**: Métricas principais e KPIs do lançamento
- **Origem e Conversão**: Análise detalhada por canal de tráfego
- **Profissão por Canal**: Distribuição de profissões por fonte
- **Análise Regional**: Performance por região geográfica
- **Insights de IA**: Análises automatizadas e recomendações
- **Projeção de Resultados**: Cálculos de projeção baseados em dados reais

## 🚀 Deploy no Render

### 1. Preparação do Repositório GitHub

1. Crie um novo repositório no GitHub
2. Faça upload dos arquivos do projeto:
   - `app.py` (aplicação Flask)
   - `index.html` (interface do dashboard)
   - `dados_planilha.json` (dados do dashboard)
   - `requirements.txt` (dependências Python)
   - `README.md` (este arquivo)

### 2. Deploy no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - **Name**: `dashboard-cht22`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free` (ou conforme necessário)

### 3. Variáveis de Ambiente (Opcional)

Se necessário, configure variáveis de ambiente no Render:
- `FLASK_ENV=production`
- `PORT=5000`

## 💻 Instalação Local

### Pré-requisitos

- Python 3.8+
- pip

### Passos

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd dashboard-cht22
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute a aplicação:
```bash
python app.py
```

4. Acesse no navegador:
```
http://localhost:5000
```

## 📁 Estrutura do Projeto

```
dashboard-cht22/
├── app.py                 # Aplicação Flask principal
├── index.html            # Interface do dashboard
├── dados_planilha.json   # Dados do dashboard
├── requirements.txt      # Dependências Python
└── README.md            # Documentação
```

## 🔧 Tecnologias Utilizadas

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Gráficos**: Chart.js
- **Estilização**: CSS Grid, Flexbox
- **Deploy**: Render, Gunicorn

## 📊 Dados e Métricas

O dashboard apresenta métricas baseadas em dados reais de 12 dias de campanha:

- **Total de Leads**: 3.695
- **CPL Médio**: R$ 18,26
- **ROAS Geral**: 2,42
- **Investimento Total**: R$ 67.467,30

### Canais de Tráfego

- **Facebook**: 3.062 leads (82,9%)
- **Instagram**: 311 leads (8,4%)
- **YouTube**: 255 leads (6,9%)
- **Google Ads**: 40 leads (1,1%)
- **Email**: 15 leads (0,4%)

## 🔄 Atualizações

O dashboard inclui funcionalidades de atualização automática e manual dos dados. Para atualizar os dados:

1. Modifique o arquivo `dados_planilha.json`
2. Faça commit e push para o repositório
3. O Render fará o redeploy automaticamente

## 📈 Projeções

As projeções são calculadas automaticamente baseadas na performance dos primeiros 12 dias:

- **Fator de Projeção**: 28 dias ÷ 12 dias = 2,333
- **Taxa de Conversão**: 0,70%
- **Tickets**: Curso R$ 6.300, Mentoria R$ 20.000

## 🎨 Personalização

Para personalizar o dashboard:

1. **Cores e Estilo**: Modifique o CSS no arquivo `index.html`
2. **Dados**: Atualize o arquivo `dados_planilha.json`
3. **Funcionalidades**: Adicione rotas no arquivo `app.py`

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do repositório GitHub.

---

**Desenvolvido para o lançamento CHT22**  
*Dashboard de Performance e Análise de Campanhas*

