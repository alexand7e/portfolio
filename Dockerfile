# Dockerfile para Portfolio Alexandre Barros
FROM node:20-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (sharp já incluso no package.json)
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Gerar Prisma Client a partir do schema
RUN npx prisma generate

# Variáveis públicas inlinadas pelo Next.js durante o build.
# NEXT_PUBLIC_* é exposto ao browser por design — não é segredo.
# Default garante que esquecer --build-arg não derruba o analytics em prod.
ARG NEXT_PUBLIC_GA_ID=G-6GGWL6Z77C
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

ARG NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_rvbv6bd
ENV NEXT_PUBLIC_EMAILJS_SERVICE_ID=$NEXT_PUBLIC_EMAILJS_SERVICE_ID
ARG NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_kys4fze
ENV NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
ARG NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=1frXxdEDyvDT4YNOl
ENV NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

# Auditoria do build: aborta se algum NEXT_PUBLIC_* obrigatório vier vazio.
RUN test -n "$NEXT_PUBLIC_GA_ID" || (echo "ERROR: NEXT_PUBLIC_GA_ID is empty at build time" && exit 1) \
 && echo "Build with NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID"

# Gerar build de produção (output: standalone)
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner

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
