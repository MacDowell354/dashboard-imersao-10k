# Dockerfile - Flask + Gunicorn
FROM python:3.11-slim

# Evita prompts interativos e melhora desempenho
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do projeto
COPY . .

# Render define a variável de ambiente PORT automaticamente
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:${PORT}", "--workers", "2"]
