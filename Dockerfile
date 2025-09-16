# Dockerfile - Flask + Gunicorn
FROM python:3.11-slim

# Evita prompts interativos e melhora desempenho
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copia requirements da raiz
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o projeto
COPY . .

# Comando de start (Render injeta a variável PORT automaticamente)
CMD ["sh", "-c", "gunicorn app_full:app --bind 0.0.0.0:${PORT:-10000} --workers 2"]
