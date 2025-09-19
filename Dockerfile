# Dockerfile - Flask + Gunicorn
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
ENV PYTHONPATH=/app

# deps (pega o requirements da pasta do app oficial)
COPY deploy_final_render/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# código
COPY . .

# Porta (Render injeta $PORT)
EXPOSE 5002

# entrypoint: deploy_final_render/app.py -> objeto Flask "app"
CMD ["sh", "-c", "gunicorn deploy_final_render.app:app --bind 0.0.0.0:${PORT:-10000} --workers 2"]
