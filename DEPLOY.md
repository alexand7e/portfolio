# Guia de Deploy Automatizado - Portfolio

Este projeto está configurado com workflows do GitHub Actions para automatizar o deploy no servidor.

## 🚀 Workflows Disponíveis

### 1. Deploy Automático (`deploy.yml`)
- **Trigger**: Push para branch `main`
- **Função**: Deploy automático em produção
- **Execução**: Teste → Build → Deploy → Health Check

### 2. Testes (`test.yml`)
- **Trigger**: Pull Requests e pushes para branches de desenvolvimento
- **Função**: Validação de código e build
- **Execução**: Lint → Build → Verificação

### 3. Deploy Manual (`manual-deploy.yml`)
- **Trigger**: Manual (via GitHub Actions)
- **Função**: Deploy sob demanda com opções configuráveis
- **Execução**: Build → Deploy → Health Check

## ⚙️ Configuração Inicial

### 1. Configurar Secrets do GitHub

No seu repositório GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

```bash
# Chave SSH privada para acesso ao servidor
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
sua_chave_privada_aqui
-----END OPENSSH PRIVATE KEY-----

# Configurações do servidor
SERVER_HOST=seu-servidor.com
SERVER_USER=deploy
SERVER_PATH=/var/www/portfolio

# URL para health check
HEALTH_CHECK_URL=https://alexand7e.dev.br/api/health
```

### 2. Configurar Servidor

#### 2.1 Criar usuário de deploy
```bash
# No servidor
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy
```

#### 2.2 Configurar SSH
```bash
# No servidor, como usuário deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Adicionar chave pública do GitHub Actions
echo "sua_chave_publica_aqui" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### 2.3 Configurar diretório do projeto
```bash
# No servidor
sudo mkdir -p /var/www/portfolio
sudo chown deploy:deploy /var/www/portfolio
cd /var/www/portfolio

# Copiar arquivos de configuração
cp docker-compose.yml .
cp docker.env .
cp Dockerfile .
```

### 3. Configurar Docker

#### 3.1 Instalar Docker e Docker Compose
```bash
# No servidor
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3.2 Configurar rede Traefik (se necessário)
```bash
# Criar rede externa para Traefik
docker network create traefik-net
```

## 🔧 Configuração Local

### 1. Instalar dependências
```bash
# No projeto local
npm install
```

### 2. Configurar arquivo de deploy
```bash
# Copiar arquivo de exemplo
cp deploy-config.example.yml deploy-config.yml

# Editar com suas configurações
nano deploy-config.yml
```

### 3. Tornar script executável
```bash
chmod +x scripts/deploy.sh
```

## 📋 Como Usar

### Deploy Automático
O deploy acontece automaticamente quando você faz push para a branch `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### Deploy Manual
1. Vá para **Actions** no GitHub
2. Selecione **Manual Deploy**
3. Clique em **Run workflow**
4. Configure as opções:
   - **Environment**: production ou staging
   - **Force rebuild**: true para rebuild completo da imagem

### Deploy Local
```bash
# Deploy padrão (production)
./scripts/deploy.sh

# Deploy para staging
./scripts/deploy.sh -e staging

# Deploy com rebuild forçado
./scripts/deploy.sh -f

# Deploy com backup
./scripts/deploy.sh -b

# Ver todas as opções
./scripts/deploy.sh --help
```

## 🔍 Monitoramento

### 1. Logs do Workflow
- Acesse **Actions** no GitHub
- Clique no workflow executado
- Veja os logs de cada step

### 2. Logs do Container
```bash
# No servidor
cd /var/www/portfolio
docker-compose logs -f portfolio
```

### 3. Status do Container
```bash
# No servidor
cd /var/www/portfolio
docker-compose ps
docker-compose logs --tail=20
```

### 4. Health Check
```bash
# Verificar se a aplicação está funcionando
curl -f https://alexand7e.dev.br/api/health
```

## 🚨 Troubleshooting

### Erro de SSH
- Verifique se a chave SSH está configurada corretamente
- Confirme se o usuário tem permissões no servidor
- Teste a conexão SSH manualmente

### Erro de Docker
- Verifique se o Docker está rodando no servidor
- Confirme se o usuário está no grupo docker
- Verifique os logs do container

### Erro de Build
- Verifique se todas as dependências estão instaladas
- Confirme se o Node.js está na versão correta
- Verifique se não há erros de linting

### Erro de Deploy
- Verifique se o diretório de destino existe
- Confirme se o usuário tem permissões de escrita
- Verifique se há espaço suficiente no disco

## 📚 Comandos Úteis

### No Servidor
```bash
# Reiniciar container
docker-compose restart portfolio

# Ver logs em tempo real
docker-compose logs -f portfolio

# Acessar container
docker-compose exec portfolio sh

# Backup manual
tar -czf backup-$(date +%Y%m%d).tar.gz --exclude='.git' --exclude='node_modules' .

# Verificar uso de recursos
docker stats portfolio
```

### Local
```bash
# Testar build
npm run build

# Verificar linting
npm run lint

# Deploy rápido
./scripts/deploy.sh

# Deploy com opções
./scripts/deploy.sh -f -b -e staging
```

## 🔒 Segurança

### 1. Chaves SSH
- Use chaves SSH específicas para deploy
- Não compartilhe chaves privadas
- Rotacione chaves regularmente

### 2. Usuário de Deploy
- Use usuário dedicado para deploy
- Limite permissões ao mínimo necessário
- Monitore logs de acesso

### 3. Firewall
- Configure firewall para permitir apenas SSH
- Use portas não padrão quando possível
- Monitore tentativas de acesso

## 📈 Melhorias Futuras

- [ ] Notificações via Slack/Email
- [ ] Rollback automático em caso de falha
- [ ] Deploy blue-green
- [ ] Monitoramento de performance
- [ ] Backup automático antes do deploy
- [ ] Testes de integração
- [ ] Deploy para múltiplos ambientes

## 🤝 Contribuição

Para contribuir com melhorias nos workflows:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça as alterações
4. Teste localmente
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do workflow
2. Consulte a seção de troubleshooting
3. Abra uma issue no GitHub
4. Verifique a documentação oficial do GitHub Actions
