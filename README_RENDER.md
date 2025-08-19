# 🚀 Dashboard Imersão +10K - Deploy no Render

## 📋 Instruções para Deploy Permanente

### 1️⃣ **Upload para GitHub**
1. Faça upload deste projeto para um repositório no GitHub
2. Certifique-se de incluir todos os arquivos

### 2️⃣ **Deploy no Render**
1. Acesse [render.com](https://render.com)
2. Conecte sua conta GitHub
3. Clique em "New Web Service"
4. Selecione seu repositório
5. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Plan:** Free (ou Starter para melhor performance)

### 3️⃣ **Configurações Automáticas**
O arquivo `render.yaml` já está configurado com:
- ✅ Build automático
- ✅ Comando de start
- ✅ Variáveis de ambiente
- ✅ Health check

### 4️⃣ **Resultado**
- 🌐 **URL permanente** gerada automaticamente
- 🛡️ **Nunca hiberna** (plano Starter)
- ⚡ **Deploy automático** a cada push
- 📊 **Dashboard sempre ativo**

## 🎯 **Arquivos Incluídos**

### **Servidor Express**
- `server.js` - Servidor Node.js para servir o React
- `package.json` - Dependências atualizadas com Express

### **Configuração Render**
- `render.yaml` - Configuração automática do deploy
- `README_RENDER.md` - Este arquivo de instruções

### **Dashboard React**
- `src/` - Código fonte completo
- `dist/` - Build de produção pronto
- Dados atualizados de 17/08/2025

## ⚠️ **Importante**
- **Plano Free:** Hiberna após 15 min de inatividade
- **Plano Starter ($7/mês):** Nunca hiberna, sempre ativo
- Para uso profissional, recomenda-se o plano Starter

## 🎉 **Vantagens do Render**
- ✅ Deploy automático via GitHub
- ✅ HTTPS gratuito
- ✅ Domínio personalizado
- ✅ Logs em tempo real
- ✅ Rollback automático
- ✅ Escalabilidade automática

**Após o deploy, seu dashboard estará permanentemente online!** 🚀

