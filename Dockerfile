# -------- etapa de build --------
FROM node:20-alpine AS builder
WORKDIR /app

# instala dependências (rápido com lock; fallback sem lock)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# copia projeto e builda
COPY . .
ENV NODE_ENV=production
RUN npm run build

# -------- etapa de runtime (serve estático) --------
FROM node:20-alpine
WORKDIR /app

# servidor estático
RUN npm i -g serve
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=10000
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
