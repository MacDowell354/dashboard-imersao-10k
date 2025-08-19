# Use Node.js 18 LTS
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas os manifests para aproveitar cache de camadas
COPY package*.json ./

# Instala apenas dependências de produção (npm v10+ usa --omit=dev)
RUN npm install --omit=dev

# Copia o restante do código
COPY . .

# Build do front (Vite) para a pasta dist/
RUN npm run build

# Expõe a porta usada pelo servidor
EXPOSE 3000

# Variáveis padrão
ENV NODE_ENV=production
ENV PORT=3000

# Sobe o servidor Express (server.js serve a pasta dist/)
CMD ["npm", "start"]
