# ⚡ Quick Start - Deploy Render

## 🚀 Deploy em 5 Minutos

### 1. GitHub (2 min)
1. Criar repositório: `dashboard-cht22`
2. Upload dos arquivos do dashboard
3. Commit: "Initial commit"

### 2. Render (2 min)
1. Acessar render.com
2. New → Web Service
3. Conectar repositório `dashboard-cht22`
4. Configurar:
   - **Build**: `pip install -r requirements.txt`
   - **Start**: `python app.py`
   - **Port**: `5002`

### 3. Deploy (1 min)
1. Create Web Service
2. Aguardar build
3. Acessar URL fornecida

## ✅ Verificação Rápida

- [ ] Dashboard carrega
- [ ] 6 abas funcionam
- [ ] `/api/status` responde
- [ ] `/api/dados` responde

## 🔧 Se Algo Der Errado

1. **Build Error**: Verificar `requirements.txt`
2. **App Error**: Verificar `Procfile`
3. **404**: Verificar rotas no `app.py`

## 📱 URLs Finais

- Dashboard: `https://dashboard-cht22.onrender.com`
- Status: `https://dashboard-cht22.onrender.com/api/status`
- Dados: `https://dashboard-cht22.onrender.com/api/dados`

**Pronto! Dashboard CHT22 no ar! 🎉**

