#!/usr/bin/env bash
# Build da imagem de produção do portfolio com todas as NEXT_PUBLIC_* inlinadas.
#
# Uso:
#   ./scripts/build-and-push.sh              # apenas build local
#   ./scripts/build-and-push.sh --push       # build + push para GHCR
#   TAG=v1.2.3 ./scripts/build-and-push.sh   # tag customizada (default: latest)

set -euo pipefail

cd "$(dirname "$0")/.."

IMAGE="ghcr.io/alexand7e/portfolio"
TAG="${TAG:-latest}"
PUSH=0
[[ "${1:-}" == "--push" ]] && PUSH=1

# Carrega variáveis do .env sem sobrescrever o ambiente já exportado.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${NEXT_PUBLIC_GA_ID:?NEXT_PUBLIC_GA_ID não definido em .env nem no ambiente}"

echo "▶ Building ${IMAGE}:${TAG}"
echo "  NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}"

docker build \
  --build-arg "NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}" \
  --build-arg "NEXT_PUBLIC_EMAILJS_SERVICE_ID=${NEXT_PUBLIC_EMAILJS_SERVICE_ID:-}" \
  --build-arg "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:-}" \
  --build-arg "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=${NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:-}" \
  -t "${IMAGE}:${TAG}" \
  .

# Verificação pós-build: garante que o GA_ID realmente está no bundle.
echo "▶ Verificando inlining do GA_ID no bundle…"
if docker run --rm --entrypoint sh "${IMAGE}:${TAG}" \
     -c "grep -r --include='*.js' -l '${NEXT_PUBLIC_GA_ID}' /app/.next/static 2>/dev/null | head -1" \
   | grep -q '.'; then
  echo "  ✓ ${NEXT_PUBLIC_GA_ID} encontrado no bundle estático"
else
  echo "  ✗ ATENÇÃO: ${NEXT_PUBLIC_GA_ID} NÃO foi encontrado no bundle"
  exit 1
fi

if (( PUSH )); then
  echo "▶ Pushing ${IMAGE}:${TAG}"
  docker push "${IMAGE}:${TAG}"
  echo "  ✓ push concluído"
else
  echo "ℹ Build local pronta. Rode novamente com --push quando quiser publicar."
fi
