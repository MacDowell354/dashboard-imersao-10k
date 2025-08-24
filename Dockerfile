# ---------- etapa de build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências:
# - se houver package-lock.json usa "npm ci"
# - se não houver, usa "npm install" (inclui devDependencies)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia o restante do projeto e gera o build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ---------- etapa de runtime (serve estático) ----------
FROM node:20-alpine
WORKDIR /app

# Servidor estático
RUN npm i -g serve
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=10000
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
