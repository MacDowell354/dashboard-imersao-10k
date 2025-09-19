# 🚀 INSTRUÇÕES DE DEPLOY - Dashboard CHT22

## ⚡ DEPLOY RÁPIDO (5 minutos)

### **OPÇÃO 1: Upload Direto no Render**

1. **Acessar Render:**
   - Vá para https://render.com
   - Faça login ou crie conta gratuita

2. **Criar Web Service:**
   - Clique "New +" → "Web Service"
   - Escolha "Upload from computer"
   - Faça upload desta pasta completa

3. **Configurações:**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

4. **Deploy:**
   - Clique "Create Web Service"
   - Aguarde 3-5 minutos

---

### **OPÇÃO 2: GitHub + Render**

1. **Upload no GitHub:**
   - Crie repositório no GitHub
   - Faça upload de TODOS os arquivos desta pasta
   - Certifique-se que estão na RAIZ do repositório

2. **Conectar no Render:**
   - No Render: "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Use as mesmas configurações acima

---

## ✅ VERIFICAÇÕES

Após deploy, verifique:
- [ ] Dashboard carrega sem erros
- [ ] 6 abas funcionando
- [ ] Dados em formato PT-BR
- [ ] Sincronização ativa

## 🎯 RESULTADO

Dashboard 100% funcional com:
- ✅ 7.713 leads processados
- ✅ Formatação PT-BR correta
- ✅ Sincronização automática
- ✅ Interface responsiva

**Tempo total: ~5 minutos**

---

## 📞 SUPORTE

Se houver problemas:
1. Verificar logs no Render
2. Confirmar configurações de build/start
3. Comparar com: https://g8h3ilc3p5ln.manus.space

**Deploy testado e aprovado!** 🎉

