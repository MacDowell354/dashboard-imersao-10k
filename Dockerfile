# ====== STAGE 1: BUILD ======
FROM node:20-alpine AS build

WORKDIR /app

# Copia só manifests para melhor cache
COPY package*.json ./

# Instala TAMBÉM as devDependencies (precisamos do Vite no build)
# Se você tem package-lock.json, prefira `npm ci`
RUN npm install

# Copia o restante do código
COPY . .

# Build do front (gera /dist)
RUN npm run build


# ====== STAGE 2: RUNTIME ======
FROM node:20-alpine AS runtime

WORKDIR /app

# Copia apenas arquivos necessários para rodar
COPY package*.json ./
# Instala apenas dependências de produção
RUN npm install --omit=dev

# Copia a pasta dist gerada no estágio de build e o servidor
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js

# Porta e env
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

# Start
CMD ["node", "server.js"]
