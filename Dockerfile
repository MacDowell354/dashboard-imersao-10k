# ----- etapa de build -----
FROM node:20-alpine AS builder
WORKDIR /app

# instala dependências
COPY package*.json ./
RUN npm ci --include=dev

# copia o restante e gera o build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ----- etapa de runtime (serve estático) -----
FROM node:20-alpine
WORKDIR /app

# usa "serve" para expor a pasta dist na porta $PORT (exigência do Render)
RUN npm i -g serve
COPY --from=builder /app/dist ./dist

ENV PORT=10000
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
