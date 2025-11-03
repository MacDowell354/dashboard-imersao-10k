# ------------------------------
# Build stage (Node)
# ------------------------------
FROM node:20-slim AS build
WORKDIR /app

# Instala dependências usando o lockfile correto, se existir
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    else npm install; fi

# Copia o código e faz o build
COPY . .
RUN npm run build

# ------------------------------
# Runtime stage (Nginx)
# ------------------------------
FROM nginx:1.27-alpine AS runtime

# Copia os arquivos gerados pelo build
COPY --from=build /app/dist /usr/share/nginx/html

# Substitui o default.conf do Nginx pelo nosso (SPA fallback)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
