# ====== STAGE 1: BUILD ======
FROM node:20-alpine AS build
WORKDIR /app

# Copia configs e instala dependências (inclui devDependencies p/ Vite)
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Gera os artefatos de produção em /dist
RUN npm run build

# ====== STAGE 2: RUNTIME ======
FROM node:20-alpine AS runtime
WORKDIR /app

# Copia apenas package.json e instala dependências de produção
COPY package*.json ./
RUN npm install --omit=dev

# Copia o build do front + scripts do backend necessários
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.cjs ./server.cjs
COPY --from=build /app/cron-update.js ./cron-update.js
COPY --from=build /app/update-data.js ./update-data.js
COPY --from=build /app/components.json ./components.json

# Expõe a porta configurada
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

# Comando de start
CMD ["node", "server.cjs"]
