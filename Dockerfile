# ====== STAGE 1: BUILD ======
FROM node:20-alpine AS build
WORKDIR /app

# instala deps (inclui devDependencies para o Vite)
COPY package*.json ./
RUN npm install

# copia o código e faz o build (public/ -> dist/)
COPY . .
RUN npm run build

# ====== STAGE 2: RUNTIME ======
FROM node:20-alpine AS runtime
WORKDIR /app

# só deps de produção
COPY package*.json ./
RUN npm install --omit=dev

# artefatos e scripts necessários
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.cjs ./server.cjs
COPY --from=build /app/cron-update.js ./cron-update.js
COPY --from=build /app/update-data.js ./update-data.js

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.cjs"]
