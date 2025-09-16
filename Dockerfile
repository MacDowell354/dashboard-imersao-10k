# Dockerfile - Flask + Gunicorn
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# deps
COPY requirements.txt ./requirements.txt
RUN test -f requirements.txt || (echo "requirements.txt não está no build context"; ls -la; exit 1)
RUN pip install --no-cache-dir -r requirements.txt

# código
COPY . .

# start (Render injeta PORT)
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-10000} --workers 2"]
