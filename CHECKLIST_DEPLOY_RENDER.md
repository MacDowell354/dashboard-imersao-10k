# ✅ Checklist Deploy Render - Dashboard CHT22

## 📋 Pré-Deploy

### Arquivos Obrigatórios
- [ ] `app.py` - Aplicação Flask principal
- [ ] `requirements.txt` - Dependências Python
- [ ] `Procfile` - Comando de inicialização
- [ ] `runtime.txt` - Versão do Python
- [ ] `templates/` - Pasta com todos os templates HTML
- [ ] `.gitignore` - Arquivos a ignorar

### Verificação de Conteúdo

#### requirements.txt
- [ ] Flask>=2.0.0,<3.0.0
- [ ] requests>=2.25.0,<3.0.0
- [ ] Sem versões muito específicas

#### Procfile
- [ ] Conteúdo: `web: python app.py`
- [ ] Sem espaços extras
- [ ] Sem extensão .txt

#### runtime.txt
- [ ] python-3.11.0 (ou versão suportada)
- [ ] Sem espaços extras

#### app.py
- [ ] Configuração de porta: `port = int(os.environ.get('PORT', 5002))`
- [ ] Host configurado: `app.run(host='0.0.0.0', port=port)`
- [ ] Todas as 6 rotas definidas
- [ ] Imports corretos

### Estrutura de Pastas
```
dashboard-cht22/
├── app.py                    ✅
├── requirements.txt          ✅
├── Procfile                  ✅
├── runtime.txt               ✅
├── README.md                 ✅
├── .gitignore               ✅
├── templates/               ✅
│   ├── dashboard.html       ✅
│   ├── visao_geral.html     ✅
│   ├── origem_conversao.html ✅
│   ├── profissao_canal.html ✅
│   ├── analise_regional.html ✅
│   ├── insights_ia.html     ✅
│   └── projecao_resultados.html ✅
└── static/
    └── style.css            ✅
```

## 📤 GitHub Setup

### Repositório
- [ ] Repositório criado: `dashboard-cht22`
- [ ] Todos os arquivos commitados
- [ ] Branch principal: `main`
- [ ] Repositório público (para Render gratuito)

### Verificação de Upload
- [ ] Todos os arquivos visíveis no GitHub
- [ ] Estrutura de pastas correta
- [ ] Sem arquivos corrompidos

## 🚀 Render Configuration

### Service Creation
- [ ] Conectado ao repositório correto
- [ ] Nome: `dashboard-cht22`
- [ ] Environment: Python 3
- [ ] Branch: main

### Build Settings
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `python app.py`
- [ ] Root Directory: (vazio)

### Environment Variables
- [ ] PORT = 5002
- [ ] FLASK_ENV = production
- [ ] SYNC_INTERVAL = 300 (opcional)

### Advanced Settings
- [ ] Auto-Deploy: Yes
- [ ] Instance Type: Free (teste) ou Starter (produção)

## 🔄 Deploy Process

### Build Phase
- [ ] Build iniciado automaticamente
- [ ] Logs mostram instalação de dependências
- [ ] Sem erros de build
- [ ] Build completo com sucesso

### Deploy Phase
- [ ] Service status: "Live"
- [ ] URL gerada e acessível
- [ ] Sem erros nos logs

## 🧪 Testes Pós-Deploy

### Teste Básico
- [ ] Dashboard carrega na URL fornecida
- [ ] Página principal exibe corretamente
- [ ] Sem erros 500 ou 404

### Teste de Navegação
- [ ] Aba "Visão Geral" funciona
- [ ] Aba "Origem e Conversão" funciona
- [ ] Aba "Profissão por Canal" funciona
- [ ] Aba "Análise Regional" funciona
- [ ] Aba "Insights de IA" funciona
- [ ] Aba "Projeção de Resultados" funciona

### Teste de APIs
- [ ] `/api/status` retorna JSON válido
- [ ] `/api/dados` retorna dados completos
- [ ] Status code 200 em ambas APIs

### Teste de Dados
- [ ] Métricas principais corretas
- [ ] CPL médio: R$ 17.30
- [ ] Total leads: 5.585
- [ ] Dias campanha: 17
- [ ] ROAS geral: 2.0

### Teste de Responsividade
- [ ] Layout correto em desktop
- [ ] Layout correto em mobile
- [ ] Navegação funciona em ambos

## 📊 Performance Check

### Tempo de Resposta
- [ ] Página principal < 3 segundos
- [ ] Navegação entre abas < 2 segundos
- [ ] APIs respondem < 1 segundo

### Recursos
- [ ] Memory usage < 80%
- [ ] CPU usage normal
- [ ] Sem memory leaks

## 🔧 Configurações Opcionais

### Domínio Personalizado
- [ ] Domínio configurado (se aplicável)
- [ ] DNS apontando corretamente
- [ ] SSL funcionando

### Monitoramento
- [ ] Alertas configurados
- [ ] Uptime monitoring ativo
- [ ] Logs sendo monitorados

### Backup
- [ ] Código versionado no GitHub
- [ ] Deploy automático configurado
- [ ] Rollback strategy definida

## 🆘 Troubleshooting

### Se Build Falhar
- [ ] Verificar requirements.txt
- [ ] Verificar runtime.txt
- [ ] Verificar logs de build

### Se Deploy Falhar
- [ ] Verificar Procfile
- [ ] Verificar configuração de porta
- [ ] Verificar logs de deploy

### Se App Não Funcionar
- [ ] Verificar rotas no app.py
- [ ] Verificar templates
- [ ] Verificar dados

## 📞 Suporte

### Informações para Coleta
- [ ] Service ID anotado
- [ ] URL do service anotada
- [ ] Logs salvos se houver erro
- [ ] Screenshots de problemas

### Recursos de Ajuda
- [ ] Documentação Render consultada
- [ ] Community forum verificado
- [ ] Troubleshooting guide consultado

## ✅ Deploy Completo

### Verificação Final
- [ ] Todos os itens acima verificados
- [ ] Dashboard funcionando 100%
- [ ] Performance aceitável
- [ ] Monitoramento ativo

### URLs Finais
- [ ] Dashboard: `https://dashboard-cht22.onrender.com`
- [ ] Status: `https://dashboard-cht22.onrender.com/api/status`
- [ ] Dados: `https://dashboard-cht22.onrender.com/api/dados`

### Documentação
- [ ] URLs documentadas
- [ ] Credenciais salvas (se aplicável)
- [ ] Processo documentado para futuras atualizações

---

## 🎯 Status Final

**Deploy Status:** [ ] ✅ Completo | [ ] ❌ Pendente

**Data do Deploy:** _______________

**URL Final:** ________________________________

**Observações:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**✅ Dashboard CHT22 - Checklist Deploy Render**  
*Verificação completa para deploy sem problemas*

