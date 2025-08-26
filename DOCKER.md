# 🐳 Docker - Portfolio Alexandre Barros

Este documento explica como executar o portfolio usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM disponível
- 2GB espaço em disco

## 🚀 Início Rápido

### 1. Construir e Iniciar
```bash
# Construir as imagens
docker-compose build

# Iniciar os containers
docker-compose up -d
```

### 2. Acessar a Aplicação
- **Portfolio**: http://localhost:80
- **Health Check**: http://localhost:80/health
- **API Health**: http://localhost:80/api/health

## ⚙️ Configuração

### Variáveis de Ambiente
Copie o arquivo `docker.env` para `.env` e configure:

```bash
# Portas
NEXTJS_PORT=3000          # Porta interna do Next.js
NGINX_PORT=80             # Porta externa do Nginx

# Rede
NETWORK_NAME=portfolio-network
CONTAINER_NAME=portfolio

# EmailJS (opcional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_xxxxx
```

### Personalizar Portas
Para usar portas diferentes:

```bash
# .env
NGINX_PORT=8080          # Acessar em http://localhost:8080
NEXTJS_PORT=3001         # Porta interna do Next.js
```

## 🛠️ Comandos Úteis

### Scripts Automatizados
```bash
# Dar permissão de execução
chmod +x docker-scripts.sh

# Usar os scripts
./docker-scripts.sh build    # Construir
./docker-scripts.sh start    # Iniciar
./docker-scripts.sh stop     # Parar
./docker-scripts.sh status   # Status
./docker-scripts.sh logs     # Logs
./docker-scripts.sh clean    # Limpar tudo
```

### Comandos Docker Compose
```bash
# Construir
docker-compose build

# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Logs
docker-compose logs -f

# Status
docker-compose ps

# Reiniciar
docker-compose restart

# Reconstruir e iniciar
docker-compose up -d --build
```

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cliente       │    │     Nginx       │    │   Next.js       │
│   (Browser)     │───▶│   (Porta 80)    │───▶│   (Porta 3000)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Serviços

#### 1. Portfolio (Next.js)
- **Container**: `portfolio`
- **Porta interna**: 3000 (expose)
- **Imagem**: Construída localmente
- **Volumes**: `./content` e `./public`

#### 2. Nginx (Proxy Reverso)
- **Container**: `portfolio-nginx`
- **Porta externa**: 80 (publish)
- **Imagem**: `nginx:alpine`
- **Função**: Proxy reverso + cache + segurança

## 🔒 Segurança

### Headers de Segurança
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer-when-downgrade

### Rate Limiting
- **API**: 10 requests/segundo
- **Geral**: 30 requests/segundo
- **Burst**: 20-50 requests

## 📊 Monitoramento

### Health Checks
```bash
# Verificar status
docker-compose ps

# Ver logs
docker-compose logs portfolio
docker-compose logs nginx

# Health endpoints
curl http://localhost:80/health
curl http://localhost:80/api/health
```

### Métricas
- **Logs**: Acessíveis via `docker-compose logs`
- **Status**: `docker-compose ps`
- **Recursos**: `docker stats`

## 🧹 Manutenção

### Limpeza Regular
```bash
# Limpar containers parados
docker container prune

# Limpar imagens não utilizadas
docker image prune

# Limpeza completa
./docker-scripts.sh clean
```

### Atualizações
```bash
# Reconstruir com mudanças
docker-compose up -d --build

# Atualizar dependências
docker-compose build --no-cache
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Porta 80 em uso
```bash
# Verificar o que está usando a porta
sudo netstat -tulpn | grep :80

# Usar porta alternativa
NGINX_PORT=8080
```

#### 2. Container não inicia
```bash
# Ver logs
docker-compose logs portfolio

# Verificar configuração
docker-compose config
```

#### 3. Erro de permissão
```bash
# Dar permissão aos scripts
chmod +x docker-scripts.sh

# Verificar permissões dos arquivos
ls -la
```

### Logs Detalhados
```bash
# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs portfolio
docker-compose logs nginx

# Últimas 100 linhas
docker-compose logs --tail=100
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)

## 🤝 Suporte

Para problemas específicos:
1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Verificar configuração: `docker-compose config`
4. Reconstruir: `docker-compose up -d --build`

---

**Desenvolvido com ❤️ por Alexandre Barros dos Santos**
