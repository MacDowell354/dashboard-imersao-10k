# SOLUÇÃO ERRO DEPLOY RENDER - Dashboard CHT22

## ❌ **ERRO ATUAL:**
```
COPY requirements.txt ./requirements.txt:
"/requirements.txt": not found
```

## ✅ **SOLUÇÃO - ADICIONAR ARQUIVOS NA RAIZ:**

### **1️⃣ ADICIONAR NO GITHUB (RAIZ DO PROJETO):**

**📄 requirements.txt:**
```
Flask==2.3.3
requests==2.31.0
Werkzeug==2.3.7
Jinja2==3.1.2
MarkupSafe==2.1.3
itsdangerous==2.1.2
click==8.1.7
```

**📄 Dockerfile:**
```dockerfile
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY utils.py .
COPY templates/ templates/
COPY static/ static/

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=5000

# Run the application
CMD ["python", "app.py"]
```

### **2️⃣ ESTRUTURA FINAL DO PROJETO:**
```
seu-repositorio/
├── app.py
├── utils.py
├── requirements.txt
├── Dockerfile
├── templates/
│   ├── dashboard.html
│   ├── visao_geral.html
│   ├── origem_conversao.html
│   ├── profissao_canal.html
│   ├── analise_regional.html
│   ├── insights_ia.html
│   └── projecao_resultados.html
└── static/
    └── style.css
```

### **3️⃣ DEPLOY NO RENDER:**
- Após adicionar os arquivos, o Render fará deploy automático
- O erro será resolvido
- Dashboard funcionará perfeitamente

## 🚀 **RESULTADO:**
✅ Deploy bem-sucedido
✅ Dashboard funcionando
✅ Todas as abas operacionais

