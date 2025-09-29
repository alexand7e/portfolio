# Portfolio - Alexandre Barros dos Santos

Portfolio pessoal de **Alexandre Barros dos Santos**, Engenheiro e Cientista de Dados, desenvolvido com Next.js, TypeScript e Prisma.

## 👨‍💼 Sobre

Alexandre é Economista formado pela UFPI e especialista em Ciência da Computação. Atualmente atua como **Gerente de Programas em IA** na Secretaria de Inteligência Artificial, Economia Digital, Ciência, Tecnologia e Inovação (SIA) do Estado do Piauí.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL (Neon)
- **Autenticação**: NextAuth.js
- **Animações**: Framer Motion
- **Deploy**: Docker + GitHub Container Registry (GHCR)
- **Email**: EmailJS

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- Docker (opcional)
- PostgreSQL (ou use Neon para desenvolvimento)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/alexand7e/portfolio.git

# Entre na pasta
cd portfolio

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Execute as migrações do banco
npx prisma migrate dev

# Gere o Prisma Client
npx prisma generate

# Execute em desenvolvimento
npm run dev
```

O projeto estará disponível em [http://localhost:7000](http://localhost:7000)

### Executar com Docker

```bash
# Build da imagem
docker build -t portfolio .

# Executar container
docker run -e DATABASE_URL="sua_url_do_banco" \
  -e NEXTAUTH_SECRET="seu_secret" \
  -e NEXTAUTH_URL="http://localhost:7000" \
  -e ADMIN_EMAIL="admin@exemplo.com" \
  -e NEXT_PUBLIC_EMAILJS_SERVICE_ID="seu_service_id" \
  -e NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="seu_template_id" \
  -e NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="sua_public_key" \
  -p 7000:7000 portfolio
```

### Usar Imagem do GHCR

```bash
# Executar imagem pré-construída
docker run -e DATABASE_URL="sua_url_do_banco" \
  -e NEXTAUTH_SECRET="seu_secret" \
  -e NEXTAUTH_URL="http://localhost:7000" \
  -e ADMIN_EMAIL="admin@exemplo.com" \
  -e NEXT_PUBLIC_EMAILJS_SERVICE_ID="seu_service_id" \
  -e NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="seu_template_id" \
  -e NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="sua_public_key" \
  -p 7000:7000 ghcr.io/alexand7e/portfolio:latest
```

## 🔧 Variáveis de Ambiente

⚠️ **IMPORTANTE**: NUNCA commite credenciais reais no repositório!

Crie um arquivo `.env.local` baseado no `env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:7000"

# Admin credentials
ADMIN_EMAIL="admin@portfolio.com"
ADMIN_PASSWORD="admin123"

# EmailJS (for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_service_id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_template_id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key"
```

## 📁 Estrutura do Projeto

```
portfolio/
├── app/                    # Páginas principais (Next.js 13+)
│   ├── admin/             # Painel administrativo
│   ├── api/               # API Routes
│   ├── blog/              # Páginas do blog
│   └── projects/          # Páginas de projetos
├── components/            # Componentes React
│   ├── admin/            # Componentes do admin
│   ├── animations/       # Animações e transições
│   ├── pages/            # Páginas do portfolio
│   └── ui/               # Componentes de interface
├── lib/                  # Utilitários e configurações
├── prisma/               # Schema e migrações do banco
├── public/               # Assets estáticos
├── scripts/              # Scripts de automação
└── types/                # Definições de tipos TypeScript
```

## 🎯 Funcionalidades

### Públicas
- **Página Inicial**: Apresentação pessoal e estatísticas do GitHub
- **Habilidades**: Competências técnicas organizadas por categoria
- **Experiência**: Trajetória profissional e acadêmica
- **Projetos**: Portfólio de trabalhos e pesquisas com filtros
- **Blog**: Artigos e posts técnicos
- **Contato**: Formulário de contato com EmailJS

### Administrativas
- **Painel Admin**: Gerenciamento completo de conteúdo
- **CRUD de Projetos**: Criar, editar e gerenciar projetos
- **CRUD de Experiências**: Gerenciar histórico profissional
- **CRUD de Blog**: Sistema de posts e artigos
- **Upload de Imagens**: Sistema de upload para assets
- **Estatísticas**: Dashboard com métricas do site

## 🗄️ Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. As principais entidades são:

- **Projects**: Projetos do portfólio
- **Experiences**: Experiências profissionais
- **Blog**: Posts e artigos
- **Users**: Usuários administrativos

### Comandos do Prisma

```bash
# Visualizar banco
npx prisma studio

# Executar migrações
npx prisma migrate dev

# Reset do banco
npx prisma migrate reset

# Gerar client
npx prisma generate
```

## 🚀 Deploy

### Deploy com Docker

```bash
# Build para produção
docker build -t portfolio .

# Executar em produção
docker run -d --name portfolio \
  -e DATABASE_URL="sua_url_producao" \
  -e NEXTAUTH_SECRET="seu_secret_producao" \
  -e NEXTAUTH_URL="https://seudominio.com" \
  -p 7000:7000 portfolio
```

### Deploy na Vercel

```bash
# Build
npm run build

# Deploy
vercel --prod
```

## 🔗 Links Importantes

- **LinkedIn**: [Alexandre Barros dos Santos](https://www.linkedin.com/in/alexandre-barros-dos-santos-4b67a9233/)
- **GitHub**: [@alexand7e](https://github.com/alexand7e/)
- **Email**: alexand7e@gmail.com
- **Telefone**: (86) 98181-3317

## 📊 Principais Projetos

- **Microdados-CAGED**: Análise de dados do mercado de trabalho
- **Dataset-PI**: Compilação de dados do Estado do Piauí
- **R-Reps**: Análises estatísticas e econométricas
- **Engenharia-de-Prompt-PIT**: Pesquisa em IA e prompts

## 🐳 Docker

A imagem Docker está disponível no GitHub Container Registry:

```bash
# Pull da imagem
docker pull ghcr.io/alexand7e/portfolio:latest

# Executar
docker run -p 7000:7000 ghcr.io/alexand7e/portfolio:latest
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Start produção
npm run start

# Lint
npm run lint

# Criar usuário admin
npm run create-admin

# Popular banco com dados de exemplo
npm run populate-db
```

## 🔒 Segurança

- Autenticação com NextAuth.js
- Senhas hasheadas com bcrypt
- Validação de tipos com TypeScript
- Sanitização de dados de entrada
- Headers de segurança configurados

## 📝 Licença

Este projeto é de uso pessoal e educacional.

---

**Desenvolvido com ❤️ por Alexandre Barros dos Santos**