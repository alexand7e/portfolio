# Plano de Migração — Custom CMS → Payload CMS

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Fase 0 — Setup do Payload](#3-fase-0--setup-do-payload)
4. [Fase 1 — Collections (Schema Mapping)](#4-fase-1--collections-schema-mapping)
5. [Fase 2 — Script de Migração de Dados](#5-fase-2--script-de-migração-de-dados)
6. [Fase 3 — Adaptação das Páginas Públicas](#6-fase-3--adaptação-das-páginas-públicas)
7. [Fase 4 — Remoção do Código Legado](#7-fase-4--remoção-do-código-legado)
8. [Fase 5 — Testes e Go-Live](#8-fase-5--testes-e-go-live)
9. [Plano de Rollback](#9-plano-de-rollback)
10. [Checklists](#10-checklists)

---

## 1. Visão Geral

### Stack atual

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Banco | PostgreSQL via Prisma ORM |
| Admin | Custom (`/admin/*`) com CRUD manual |
| Auth | NextAuth (credentials provider) |
| Imagens | Filesystem (`public/uploads/`) |
| Conteúdo | Markdown em colunas TEXT |
| RSS | Gerado manualmente |
| Search | Query manual no Prisma |

### Stack alvo

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) + Payload 3 |
| Linguagem | TypeScript |
| Banco | PostgreSQL (Payload gerencia) |
| Admin | Payload Admin Panel |
| Auth | Payload Auth nativa |
| Imagens | Payload Media Collection |
| Conteúdo | Lexical JSON (editor rico) |
| RSS | Gerado manualmente (mantido) |
| Search | Adaptado para Payload |

### Escopo da migração

| Collection | Modelo atual (Prisma) | Prioridade |
|---|---|---|
| Usuários | `User` | Alta |
| Blog | `Blog` | Alta |
| Projetos | `Project` | Alta |
| Tutoriais | `Tutorial` | Alta |
| Séries | `Series` + `SeriesBlog` | Alta |
| Talks | `Talk` | Média |
| Experiências | `Experience` | Média |
| Testimonials | `Testimonial` | Média |
| Uses | `UseItem` | Baixa |
| Configurações | `SiteSetting` | Baixa |
| Newsletter | `Subscriber` | Fora do Payload (mantido) |

---

## 2. Pré-requisitos

### 2.1. Ambiente

- Node.js >= 20
- PostgreSQL rodando (local ou remoto)
- Payload CMS 3.x (`npm create payload@latest`)
- Projeto em branch separada (`git checkout -b migrate/payload`)

### 2.2. Backup obrigatório

```bash
pg_dump "$DATABASE_URL" --no-owner --format=custom \
  -f "./backups/pre-migration-$(date +%Y%m%d%H%M%S).dump"
```

### 2.3. Variáveis de ambiente (novas)

```env
# Payload
PAYLOAD_SECRET=<generate-random-secret>
PAYLOAD_DATABASE_URI=<postgresql-url>

# Storage (opcional, para images em S3/Cloudflare)
PAYLOAD_S3_BUCKET=
PAYLOAD_S3_REGION=
PAYLOAD_S3_ACCESS_KEY=
PAYLOAD_S3_SECRET_KEY=
```

---

## 3. Fase 0 — Setup do Payload

### 3.1. Instalação

```bash
npx create-payload-app@latest \
  --template blank \
  --name payload \
  --directory ./payload
```

Ou instale diretamente no projeto existente:

```bash
npm install payload @payloadcms/next @payloadcms/ui
npm install -D @payloadcms/richtext-lexical
```

### 3.2. Configuração básica

`payload.config.ts`:

```typescript
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { pt } from '@payloadcms/translations/languages/pt'

export default buildConfig({
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.PAYLOAD_SECRET,
  localization: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    fallback: true,
  },
  collections: [],
  admin: {
    user: 'users',
  },
})
```

### 3.3. Integração com Next.js

`app/(payload)/api/[...slug]/route.ts`:

```typescript
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const POST = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  return payload.nextHandler(req)
}

export const GET = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  return payload.nextHandler(req)
}
```

---

## 4. Fase 1 — Collections (Schema Mapping)

### 4.1. Mapeamento Prisma → Payload Collection

Cada collection Prisma vira uma `Collection` no Payload. Abaixo o mapeamento detalhado.

#### 4.1.1. Users

```typescript
// collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { depth: 0 },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'role', type: 'select', options: ['ADMIN', 'USER'], defaultValue: 'ADMIN' },
  ],
}
```

#### 4.1.2. Blog Posts

```typescript
// collections/Blog.ts
import type { CollectionConfig } from 'payload'

export const Blog: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'coverUrl', type: 'text' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'readTime', type: 'number' },
    { name: 'publishedAt', type: 'date' },
  ],
}
```

**Payload cuida de:** `createdAt`, `updatedAt`, `published` (via `_status` nos drafts).

#### 4.1.3. Projetos

```typescript
// collections/Projects.ts
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'imageUrl', type: 'text' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'demoUrl', type: 'text' },
    { name: 'githubUrl', type: 'text' },
    { name: 'technologies', type: 'array', fields: [{ name: 'tech', type: 'text' }] },
    { name: 'featured', type: 'checkbox' },
  ],
}
```

#### 4.1.4. Experiências

```typescript
// collections/Experiences.ts
export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: { useAsTitle: 'company' },
  fields: [
    { name: 'company', type: 'text', required: true, localized: true },
    { name: 'position', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'current', type: 'checkbox', defaultValue: false },
    { name: 'location', type: 'text', localized: true },
    { name: 'technologies', type: 'array', fields: [{ name: 'tech', type: 'text' }] },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

#### 4.1.5. Tutoriais

```typescript
// collections/Tutorials.ts
export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'coverUrl', type: 'text' },
    { name: 'difficulty', type: 'select', options: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] },
    { name: 'estimatedTime', type: 'number' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'technologies', type: 'array', fields: [{ name: 'tech', type: 'text' }] },
    { name: 'series', type: 'relationship', relationTo: 'series' },
    { name: 'seriesOrder', type: 'number' },
    { name: 'publishedAt', type: 'date' },
  ],
}
```

#### 4.1.6. Séries

```typescript
// collections/Series.ts
export const Series: CollectionConfig = {
  slug: 'series',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
```

> **Nota:** `SeriesBlog` (relação série ↔ blog post) é substituído pelo campo `series` no próprio Blog Post. Se precisar de ordem, adicione `seriesOrder` ao Blog Post, igual aos Tutoriais.

#### 4.1.7. Talks

```typescript
// collections/Talks.ts
export const Talks: CollectionConfig = {
  slug: 'talks',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'event', type: 'text', required: true, localized: true },
    { name: 'location', type: 'text' },
    { name: 'date', type: 'date', required: true },
    { name: 'slidesUrl', type: 'text' },
    { name: 'videoUrl', type: 'text' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
  ],
}
```

#### 4.1.8. Testimonials

```typescript
// collections/Testimonials.ts
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'text', type: 'textarea', required: true, localized: true },
    { name: 'avatarImage', type: 'upload', relationTo: 'media' },
    { name: 'linkedIn', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

#### 4.1.9. Uses / Gear

```typescript
// collections/Uses.ts
export const Uses: CollectionConfig = {
  slug: 'uses',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'category', type: 'text', required: true, localized: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'url', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

#### 4.1.10. Site Settings (Global)

```typescript
// globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'key', type: 'text', required: true },
    { name: 'value', type: 'textarea' },
  ],
}
```

#### 4.1.11. Media

```typescript
// collections/Media.ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/uploads',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, fit: 'cover' },
      { name: 'card', width: 768, height: 576, fit: 'cover' },
      { name: 'hero', width: 1920, height: 1080, fit: 'cover' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
},
```

### 4.2. Registrar collections no Payload Config

```typescript
import { Users } from './collections/Users'
import { Blog } from './collections/Blog'
import { Projects } from './collections/Projects'
import { Experiences } from './collections/Experiences'
import { Tutorials } from './collections/Tutorials'
import { Series } from './collections/Series'
import { Talks } from './collections/Talks'
import { Testimonials } from './collections/Testimonials'
import { Uses } from './collections/Uses'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'

export default buildConfig({
  // ...
  collections: [Users, Blog, Projects, Experiences, Tutorials, Series, Talks, Testimonials, Uses, Media],
  globals: [SiteSettings],
})
```

---

## 5. Fase 2 — Script de Migração de Dados

### 5.1. Estratégia

- **Script único, idempotente** — pode rodar múltiplas vezes sem duplicar dados
- Usa um campo `legacyId` em cada collection para rastrear documentos já migrados
- Roda collection por collection na ordem correta (respeitando relações)
- Modo `--dry-run` para validar antes de escrever no banco

### 5.2. Ordem de migração

```
1. Media          (imagens precisam existir antes dos relacionamentos)
2. Users          (sem dependências)
3. Series         (tutoriais dependem de séries)
4. Blog           (sem dependências)
5. Projects       (sem dependências)
6. Experiences    (sem dependências)
7. Tutorials      (depende de Series)
8. Talks          (sem dependências)
9. Testimonials   (sem dependências)
10. Uses          (sem dependências)
11. SiteSettings  (global)
```

### 5.3. Estrutura do script

```typescript
// scripts/migrate-to-payload.ts
import { PrismaClient } from '@prisma/client'
import { getPayload } from 'payload'
import config from '@payload-config'

const prisma = new PrismaClient()

async function migrate() {
  const payload = await getPayload({ config })
  const dryRun = process.argv.includes('--dry-run')

  console.log(`Modo: ${dryRun ? 'DRY RUN' : 'EXECUÇÃO'}`)

  await migrateMedia(payload, prisma, dryRun)    // 1. Mídia
  await migrateUsers(payload, prisma, dryRun)      // 2. Usuários
  await migrateSeries(payload, prisma, dryRun)     // 3. Séries
  await migrateBlog(payload, prisma, dryRun)       // 4. Blog
  await migrateProjects(payload, prisma, dryRun)   // 5. Projetos
  await migrateExperiences(payload, prisma, dryRun) // 6. Experiências
  await migrateTutorials(payload, prisma, dryRun)  // 7. Tutoriais
  await migrateTalks(payload, prisma, dryRun)      // 8. Talks
  await migrateTestimonials(payload, prisma, dryRun) // 9. Testimonials
  await migrateUses(payload, prisma, dryRun)       // 10. Uses
  await migrateSettings(payload, prisma, dryRun)   // 11. Settings

  console.log('Migração concluída!')
}

migrate().catch(console.error)
```

### 5.4. Exemplo de migração (Blog) com idempotência

```typescript
async function migrateBlog(payload, prisma, dryRun) {
  const posts = await prisma.blog.findMany()
  console.log(`Blog: ${posts.length} posts para migrar`)

  for (const post of posts) {
    // Idempotência: verifica se já foi migrado
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { legacyId: { equals: post.id } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ↺ Pulando ${post.slug} (já migrado)`)
      continue
    }

    const data = {
      legacyId: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: convertMarkdownToLexical(post.content),
      tags: post.tags.map(t => ({ tag: t })),
      readTime: post.readTime,
      publishedAt: post.publishedAt,
      _status: post.published ? 'published' : 'draft',
      // Versão em inglês (Payload i18n)
      title__en: post.titleEn || undefined,
      description__en: post.descriptionEn || undefined,
      content__en: post.contentEn ? convertMarkdownToLexical(post.contentEn) : undefined,
    }

    if (post.coverImage) {
      const media = await findOrMigrateMedia(payload, prisma, post.coverImage, dryRun)
      if (media) data.coverImage = media.id
    }

    if (dryRun) {
      console.log(`  ✓ [DRY] ${post.slug} — pronto para migrar`)
      continue
    }

    await payload.create({ collection: 'blog-posts', data })
    console.log(`  ✓ ${post.slug} migrado`)
  }
}
```

### 5.5. Conversão Markdown → Lexical JSON

Payload aceita `richText` no formato Lexical JSON. Você tem duas opções:

**Opção A (recomendada):** Armazenar como Markdown e usar um campo de texto simples, mantendo o pipeline `remark` existente nas páginas públicas. Perde o editor visual mas é mais rápido.

**Opção B:** Converter Markdown → HTML → Lexical JSON usando `@lexical/html` + `turndown`. Mais trabalhoso, mas aproveita o editor rico do Payload.

```typescript
// Opção A — Manter Markdown como texto simples
// Altere a collection Blog para usar:
{ name: 'content', type: 'textarea', localized: true }

// Opção B — Converter para Lexical (requer pacote adicional)
import { $generateNodesFromDOM } from '@lexical/html'
import { $createRootNode, $createParagraphNode } from 'lexical'

function convertMarkdownToLexical(md: string) {
  // 1. Converte Markdown → HTML (usando remark, igual já faz)
  // 2. Converte HTML → Lexical JSON
  // 3. Retorna o JSON
}
```

> **Recomendação:** comece com a **Opção A** (Markdown como textarea). A migração fica trivial e você decide depois se quer converter para Lexical.

### 5.6. Migração de imagens

```typescript
async function migrateMedia(payload, prisma, dryRun) {
  const fs = require('fs')
  const path = require('path')
  const uploadsDir = path.join(process.cwd(), 'public/uploads')
  const files = fs.readdirSync(uploadsDir)

  for (const file of files) {
    const filePath = path.join(uploadsDir, file)
    if (!fs.statSync(filePath).isFile()) continue

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: file } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ↺ Pulando ${file} (já migrado)`)
      continue
    }

    if (dryRun) {
      console.log(`  ✓ [DRY] ${file} — pronto`)
      continue
    }

    await payload.create({
      collection: 'media',
      data: { alt: file },
      filePath: filePath, // Payload aceita filePath no create
    })
    console.log(`  ✓ ${file} migrado`)
  }
}
```

### 5.7. Flags do script

```bash
# Dry run — apenas log, sem escrita
npx tsx scripts/migrate-to-payload.ts --dry-run

# Execução real
npx tsx scripts/migrate-to-payload.ts

# Migrar collection específica (se implementar flag --collection)
npx tsx scripts/migrate-to-payload.ts --collection blog
```

---

## 6. Fase 3 — Adaptação das Páginas Públicas

### 6.1. Novo padrão de acesso a dados

Substitua chamadas `prisma.blog.findMany()` por `payload.find()`:

```typescript
// Antes (Prisma)
import { prisma } from '@/lib/prisma'
const posts = await prisma.blog.findMany({ where: { published: true } })

// Depois (Payload Local API)
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
  })
  // ...
}
```

### 6.2. Mapeamento de páginas

| Rota | Fonte atual | Fonte nova | Observação |
|---|---|---|---|
| `/blog` | `prisma.blog.findMany` | `payload.find('blog-posts')` | Adicionar locale filter |
| `/blog/[slug]` | `prisma.blog.findUnique` | `payload.findByID` ou query slug | Usar revalidation |
| `/projetos` | `prisma.project.findMany` | `payload.find('projects')` | — |
| `/tutoriais` | `prisma.tutorial.findMany` | `payload.find('tutorials')` | Incluir relação series |
| `/tutoriais/[slug]` | `prisma.tutorial.findUnique` | `payload.findByID` | — |
| `/talks` | `prisma.talk.findMany` | `payload.find('talks')` | — |
| `/uses` | `prisma.useItem.findMany` | `payload.find('uses')` | — |
| Home (experiências, test.) | `prisma.experience/testimonial` | `payload.find(...)` | — |
| `/feed.xml` | `prisma.blog/tutorial.findMany` | `payload.find(...)` | Adaptar query |
| `/api/search` | `prisma.$queryRaw` | `payload.find()` com `contains` | Payload suporta busca textual |
| `/sitemap.ts` | `prisma.blog/tutorial.findMany` | `payload.find(...)` | Adaptar |

### 6.3. Tratamento de localização (i18n)

Payload com `localization: true` injeta o locale automaticamente. Ao buscar dados:

```typescript
const { docs: posts } = await payload.find({
  collection: 'blog-posts',
  locale: 'pt', // ou 'en' — ou 'all' para todos
  depth: 0,     // evita trazer relações aninhadas desnecessárias
})
```

### 6.4. Revalidação (ISR)

Com Payload, use webhooks ou `revalidatePath` nas páginas que usam ISR:

```typescript
// No webhook do Payload (após criar/editar blog post)
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({ paths: ['/blog', '/blog/' + slug] })
})
```

### 6.5. Renderização de conteúdo

Se optou pela **Opção A** (Markdown em textarea), o pipeline `remark` existente continua funcionando:

```typescript
// lib/markdown.ts — permanece inalterado
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(gfm).use(html).process(markdown)
  return result.toString()
}
```

Apenas a origem dos dados muda (Payload → texto → markdown → HTML).

---

## 7. Fase 4 — Remoção do Código Legado

### 7.1. O que remover

Após validar que tudo funciona com Payload:

```bash
# Admin customizado (substituído pelo Payload Admin)
rm -rf app/admin/

# API routes administrativas
rm -rf app/api/admin/

# API routes substituídas pelo Payload
rm -rf app/api/blog/
rm -rf app/api/experiences/
rm -rf app/api/projects/
rm -rf app/api/testimonials/

# Prisma (não será mais usado)
rm -rf prisma/

# Libs específicas do Prisma
rm lib/prisma.ts

# Dependências não usadas
npm uninstall @prisma/client prisma pg
```

### 7.2. O que manter

```bash
# Funcionalidades independentes
app/api/auth/          # Se ainda for usado (NextAuth)
app/api/newsletter/    # Continua fora do Payload
app/api/health/        # Health check
app/api/search/        # Adaptar para Payload
app/api/revalidate/    # Mantido
app/feed.xml/          # Adaptar fonte dos dados
app/sitemap.ts         # Adaptar fonte dos dados

# Componentes de UI
components/ui/         # Mantidos
components/pages/      # Mantidos
components/seo/        # Mantidos
components/providers/  # LanguageProvider mantido
components/animations/ # Mantidos

# Utilitários gerais
lib/markdown.ts        # Mantido (se Opção A)
lib/extractHeadings.ts # Mantido
lib/translations.ts    # Mantido
lib/newsletter.ts      # Mantido
```

### 7.3. Limpeza do `.env`

Remover variáveis que não são mais necessárias:

```env
# REMOVER
DATABASE_URL      # Substituído por PAYLOAD_DATABASE_URI
# (manter se newsletter ou outras funcs precisam)
```

---

## 8. Fase 5 — Testes e Go-Live

### 8.1. Ambiente de staging

```bash
# Branch de migração
git checkout -b migrate/payload

# Deploy em staging (Vercel preview ou outro ambiente)
vercel deploy --preview
```

### 8.2. Checklist de validação

- [ ] Admin do Payload acessível em `/admin`
- [ ] Login funciona com usuário migrado
- [ ] Todos os blog posts visíveis na collection
- [ ] Preview de blog post com conteúdo correto
- [ ] Imagens carregadas corretamente
- [ ] Dados bilíngues (pt/en) corretos
- [ ] Projetos listados corretamente
- [ ] Tutoriais com séries relacionadas
- [ ] Talks, Experiences, Testimonials, Uses íntegros
- [ ] RSS feed (`/feed.xml`) funcionando
- [ ] Sitemap completo
- [ ] Search funcionando
- [ ] Giscus comments carregando
- [ ] Newsletter funcionando
- [ ] Lighthouse score mantido ou melhorado
- [ ] Build de produção (`npm run build`) sem erros

### 8.3. Estratégia de corte

```
Semana 1  → Setup Payload + Collections + Script migração
Semana 2  → Executar migração em staging + validar dados
Semana 3  → Adaptar páginas públicas + testar
Semana 4  → Remover código legado + testes finais
Dia do corte → Deploy em produção + monitorar 48h
```

### 8.4. Rollback

Ver [Plano de Rollback](#9-plano-de-rollback).

---

## 9. Plano de Rollback

### 9.1. Pré-condições para rollback seguro

1. **Banco original preservado** — backup feito na Fase 0
2. **Branch separada** — `main` permanece intacta
3. **Deploy reversível** — Vercel permite restore de deploy anterior

### 9.2. Procedimento de rollback

```bash
# 1. Restaurar banco
pg_restore --no-owner --dbname="$DATABASE_URL" \
  backups/pre-migration-<timestamp>.dump

# 2. Reverter código
git checkout main
git branch -D migrate/payload

# 3. Redeploy da main
vercel deploy --prod
```

### 9.3. Critérios para acionar rollback

- Dados corrompidos ou perdidos após migração
- Erro crítico em produção que afeta usuários
- Performance degradada por mais de 4h
- Falha no login do admin

---

## 10. Checklists

### 10.1. Pré-migração

- [ ] Backup do banco PostgreSQL (`pg_dump`)
- [ ] Backup de `public/uploads/`
- [ ] Branch `migrate/payload` criada
- [ ] `.env.example` atualizado com novas variáveis
- [ ] Lista de collections finalizada
- [ ] Script de migração testado em `--dry-run`

### 10.2. Pós-migração (1ª rodada)

- [ ] Payload Admin acessível
- [ ] Navegação em todas as collections
- [ ] CRUD básico funcionando (criar, editar, deletar)
- [ ] Upload de imagens funcional
- [ ] Draft/publish funcional
- [ ] Versões funcionando
- [ ] Busca textual funcionando

### 10.3. Pós-migração (2ª rodada — frontend)

- [ ] Página inicial carregando dados corretos
- [ ] Blog listing com paginação
- [ ] Post individual com conteúdo, TOC, comments
- [ ] Projetos com filtros
- [ ] Tutoriais com navegação de série
- [ ] Talks com data e links
- [ ] Uses organizado por categoria
- [ ] RSS feed válido
- [ ] Sitemap indexado
- [ ] Meta tags e SEO preservados
- [ ] Structured data (JSON-LD) mantido

### 10.4. Go-Live

- [ ] Build de produção sem erros
- [ ] Lighthouse ≥ performance atual
- [ ] Teste em mobile e desktop
- [ ] URLs e redirecionamentos intactos
- [ ] Certificado SSL válido
- [ ] Analytics tracking ativo
- [ ] Monitoramento de erros ativo
- [ ] Rollback documentado e acessível

---

> **Nota final:** Este plano parte do princípio que o conteúdo Markdown existente será mantido como texto simples (Opção A). Se no futuro quiser o editor Lexical completo, a migração de Markdown → Lexical pode ser feita gradualmente, post a post, sem impacto no frontend — já que a renderização continua usando `remark` para converter o texto em HTML.
