# Multi-stage: deps -> build -> runner. A imagem final leva so o standalone do
# Next, sem pnpm nem node_modules de build.

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
# sharp e o engine do Prisma precisam da libc6-compat no Alpine.
RUN apk add --no-cache libc6-compat

# --- deps: so o manifesto, para a camada de instalacao cachear --------------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- build ------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* sao inlinados no bundle do cliente: precisam existir AQUI, no
# build. Defini-los no env do servico no swarm nao tem efeito nenhum, o valor
# ja foi assado (ou nao) na imagem.
ARG NEXT_PUBLIC_GA_ID=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_SITE_URL=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

ENV NEXT_TELEMETRY_DISABLED=1

# Antes do build: o client gerado entra no rastreamento do standalone.
RUN pnpm exec prisma generate
# A home e dinamica, entao o build nao abre conexao com o banco.
RUN pnpm build

# --- runner -----------------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV TZ=America/Sao_Paulo

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder /app/public ./public
# O standalone ja traz so as dependencias de runtime que o Next detectou.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# O schema acompanha: o Prisma o procura em runtime para resolver o engine.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
