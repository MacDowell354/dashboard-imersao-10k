# 📊 Dashboard CHT22 - Python/Flask

Dashboard de performance para o lançamento CHT22 com navegação confiável entre todas as 6 abas.

## ✨ Características

- **🏠 Visão Geral**: Métricas principais e KPIs
- **📊 Origem e Conversão**: Performance por canal
- **👥 Profissão por Canal**: Distribuição por profissões
- **🗺️ Análise Regional**: Performance geográfica
- **🤖 Insights de IA**: Recomendações automáticas
- **📈 Projeção de Resultados**: Projeções e metas

## 🚀 Execução Local

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
python app.py
```

Acesse: http://localhost:5002

## 📡 APIs Disponíveis

- `GET /api/status` - Status do sistema
- `GET /api/dados` - Dados completos do dashboard

## 🔧 Configuração

### Sincronização de Dados
A sincronização automática com Google Sheets está implementada mas desativada por padrão. Para ativar, descomente a linha 176 em `app.py`.

### Variáveis de Ambiente
```bash
PORT=5002                    # Porta da aplicação
SYNC_INTERVAL=300           # Intervalo de sincronização (segundos)
```

## 📁 Estrutura

```
├── app.py                  # Aplicação Flask principal
├── requirements.txt        # Dependências
├── templates/             # Templates HTML
│   ├── dashboard.html     # Template principal
│   └── *.html            # Templates das abas
└── static/
    └── style.css         # Estilos (opcional)
```

## 🎯 Deploy

Consulte `INSTRUCOES_DEPLOY_DASHBOARD_CHT22.md` para instruções completas de deploy.

## ✅ Status

- ✅ Navegação entre abas funcionando
- ✅ Dados corretos implementados
- ✅ APIs funcionais
- ✅ Interface responsiva
- ✅ Sistema de sincronização implementado

---

**Dashboard CHT22 - Versão Python/Flask**  
*Solução confiável para monitoramento de campanhas*

