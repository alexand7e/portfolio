# Dockerfile para Portfolio Alexandre Barros
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (inclui sharp para standalone)
RUN npm ci && npm install sharp

# Copiar código fonte
COPY . .

# Gerar Prisma Client a partir do schema
RUN npx prisma generate

# Gerar build de produção (output: standalone)
RUN npm run build

# ---- Runner ----
FROM node:18-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

# Copiar output standalone (já inclui node_modules mínimos + sharp)
COPY --from=builder /app/.next/standalone ./
# Copiar assets estáticos (CSS, JS, fontes)
COPY --from=builder /app/.next/static ./.next/static
# Copiar pasta public (imagens, favicon, etc.)
COPY --from=builder /app/public ./public

EXPOSE 7000

ENV PORT=7000
ENV HOSTNAME="0.0.0.0"

# standalone mode usa server.js na raiz do diretório
CMD ["node", "server.js"]
