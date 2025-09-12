# Dockerfile - Flask + Gunicorn
FROM python:3.11-slim

# Evita prompts interativos e melhora desempenho
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copia os requirements da subpasta correta
COPY dashboard_python/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do projeto
COPY dashboard_python/ .

# Comando de start (Render injeta a variável PORT automaticamente)
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-10000} --workers 2"]
