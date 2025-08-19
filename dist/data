# ====== STAGE 1: BUILD ======
FROM node:20-alpine AS build
WORKDIR /app

# Instala deps (inclui devDependencies p/ Vite)
COPY package*.json ./
RUN npm install

# Copia o código e faz o build (public/ -> dist/)
COPY . .
RUN npm run build

# Garante que exista a pasta onde o backend salvará o JSON
RUN mkdir -p /app/dist/data

# ====== STAGE 2: RUNTIME ======
FROM node:20-alpine AS runtime
WORKDIR /app

# Só deps de produção
COPY package*.json ./
RUN npm install --omit=dev

# Artefatos necessários
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.cjs ./server.cjs
COPY --from=build /app/cron-update.js ./cron-update.js
COPY --from=build /app/update-data.js ./update-data.js

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.cjs"]
