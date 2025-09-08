# Dashboard CHT22 - Instruções de Deploy

## 📦 Arquivos Incluídos no ZIP

- `app.py` - Aplicação Flask principal
- `index.html` - Template HTML do dashboard
- `requirements.txt` - Dependências Python
- `README.md` - Documentação do projeto

## 🚀 Deploy no GitHub

1. **Criar repositório no GitHub:**
   - Acesse https://github.com/new
   - Nome: `dashboard-cht22`
   - Descrição: `Dashboard de Performance CHT22`
   - Público ou Privado (sua escolha)

2. **Upload dos arquivos:**
   - Extraia o ZIP `dashboard_cht22_deploy_final.zip`
   - Faça upload de todos os arquivos para o repositório
   - Commit: "Dashboard CHT22 - Versão Final Atualizada"

## 🌐 Deploy no Render

1. **Conectar ao GitHub:**
   - Acesse https://render.com
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub `dashboard-cht22`

2. **Configurações do Deploy:**
   - **Name:** `dashboard-cht22`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
   - **Instance Type:** `Free` (ou pago se preferir)

3. **Variáveis de Ambiente (se necessário):**
   - Nenhuma variável especial necessária
   - O Flask está configurado para rodar na porta padrão

## ✅ Verificação Pós-Deploy

Após o deploy, verifique se:
- [ ] Dashboard carrega corretamente
- [ ] Todas as abas funcionam
- [ ] Gráfico CPL mostra 14 dias
- [ ] Dados estão corretos (4.325 leads, 14 dias)
- [ ] Responsividade mobile funciona

## 🔄 Atualizações Futuras

Para atualizar o dashboard:
1. Modifique os arquivos localmente
2. Faça commit no GitHub
3. Render fará deploy automático

## 📊 Dados Atuais Sincronizados

- **Total de Leads:** 4.325
- **Período:** 14 dias (25/08 a 07/09)
- **CPL Médio:** R$ 18,76
- **Investimento Total:** R$ 81.130,30
- **ROAS Geral:** 2.35

## 🛠️ Suporte

Em caso de problemas:
1. Verifique os logs no Render
2. Confirme se todos os arquivos foram enviados
3. Teste localmente com `python app.py`

---
**Dashboard CHT22 - Versão Final Atualizada**
*Todos os dados sincronizados com a planilha Google Sheets*

