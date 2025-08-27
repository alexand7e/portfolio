#!/bin/bash

# Script de Deploy Local para Portfolio
# Uso: ./scripts/deploy.sh [opções]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [opções]"
    echo ""
    echo "Opções:"
    echo "  -h, --help          Mostra esta ajuda"
    echo "  -e, --env ENV       Ambiente (production, staging)"
    echo "  -f, --force         Força rebuild da imagem Docker"
    echo "  -b, --backup        Cria backup antes do deploy"
    echo "  -v, --verbose       Modo verboso"
    echo ""
    echo "Exemplos:"
    echo "  $0                    # Deploy padrão (production)"
    echo "  $0 -e staging        # Deploy para staging"
    echo "  $0 -f                # Deploy com rebuild forçado"
    echo "  $0 -b -f             # Deploy com backup e rebuild forçado"
}

# Variáveis padrão
ENVIRONMENT="production"
FORCE_REBUILD=false
CREATE_BACKUP=false
VERBOSE=false

# Parse de argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -f|--force)
            FORCE_REBUILD=true
            shift
            ;;
        -b|--backup)
            CREATE_BACKUP=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            error "Opção desconhecida: $1"
            ;;
    esac
done

# Verificar se estamos no diretório raiz do projeto
if [ ! -f "package.json" ]; then
    error "Execute este script no diretório raiz do projeto"
fi

# Verificar se o arquivo de configuração existe
if [ ! -f "deploy-config.yml" ]; then
    error "Arquivo deploy-config.yml não encontrado. Copie deploy-config.example.yml e configure."
fi

# Carregar configurações
log "Carregando configurações..."
source <(python3 -c "
import yaml
import sys
with open('deploy-config.yml', 'r') as f:
    config = yaml.safe_load(f)
    for key, value in config.items():
        if isinstance(value, dict):
            for subkey, subvalue in value.items():
                print(f'{key.upper()}_{subkey.upper()}=\"{subvalue}\"')
        else:
            print(f'{key.upper()}=\"{value}\"')
" 2>/dev/null || echo "Erro ao carregar configurações"))

# Verificar variáveis obrigatórias
if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USER" ] || [ -z "$SERVER_PATH" ]; then
    error "Configurações do servidor incompletas. Verifique deploy-config.yml"
fi

log "Iniciando deploy para ambiente: $ENVIRONMENT"
log "Servidor: $SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# Verificar se o build está atualizado
if [ ! -d ".next" ] || [ "$(find .next -newer package.json | wc -l)" -eq 0 ]; then
    log "Gerando build da aplicação..."
    npm run build
    success "Build gerado com sucesso"
else
    log "Build já está atualizado"
fi

# Criar backup se solicitado
if [ "$CREATE_BACKUP" = true ]; then
    log "Criando backup..."
    BACKUP_NAME="portfolio-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "$BACKUP_NAME" --exclude='.git' --exclude='node_modules' --exclude='.next' .
    success "Backup criado: $BACKUP_NAME"
fi

# Deploy via rsync
log "Fazendo deploy dos arquivos..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.github' \
    --exclude='README.md' \
    --exclude='.gitignore' \
    --exclude='.eslintrc.json' \
    --exclude='.prettierrc' \
    --exclude='AI_RULES.md' \
    --exclude='curriculo.md' \
    --exclude='LICENSE' \
    --exclude='package-lock.json' \
    --exclude='pnpm-lock.yaml' \
    --exclude='tsconfig.json' \
    --exclude='tailwind.config.ts' \
    --exclude='postcss.config.mjs' \
    --exclude='next.config.mjs' \
    --exclude='next-env.d.ts' \
    ./ "$SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# Copiar build
log "Copiando build..."
rsync -avz --delete .next/ "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/.next/"

success "Arquivos enviados com sucesso"

# Rebuild e restart do container
log "Reconstruindo e reiniciando container Docker..."
ssh "$SERVER_USER@$SERVER_HOST" << EOF
    cd "$SERVER_PATH"
    
    # Parar container atual
    docker-compose down
    
    # Reconstruir imagem
    if [ "$FORCE_REBUILD" = true ]; then
        echo "🔄 Rebuild forçado da imagem Docker..."
        docker-compose build --no-cache
    else
        echo "⚡ Build da imagem Docker com cache..."
        docker-compose build
    fi
    
    # Iniciar serviços
    docker-compose up -d
    
    # Verificar status
    docker-compose ps
    
    # Verificar logs
    docker-compose logs --tail=20
EOF

success "Container Docker reconstruído e reiniciado"

# Health check
log "Aguardando inicialização da aplicação..."
sleep 30

log "Verificando health check..."
if curl -f "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
    success "Health check passou! Aplicação está funcionando."
else
    warning "Health check falhou. Verifique os logs do container."
fi

# Resumo do deploy
log "=== RESUMO DO DEPLOY ==="
log "Ambiente: $ENVIRONMENT"
log "Servidor: $SERVER_HOST"
log "Caminho: $SERVER_PATH"
log "Rebuild forçado: $FORCE_REBUILD"
log "Backup criado: $CREATE_BACKUP"
log "Data/Hora: $(date)"
log "========================"

success "Deploy concluído com sucesso! 🚀"
