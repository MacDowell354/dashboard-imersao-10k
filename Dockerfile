# Dockerfile - Flask + Gunicorn
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Usa o requirements que está em dashboard_python/
COPY dashboard_python/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o projeto
COPY . .

# Porta (Render injeta $PORT)
ENV PORT=5002
EXPOSE 5002

# Sobe o app_full.py (ou ajuste se você estiver usando app.py)
CMD ["sh", "-c", "gunicorn app_full:app --bind 0.0.0.0:${PORT:-10000} --workers 2"]
