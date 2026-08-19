import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Aulas de exemplo, so para ver a Trilha funcionando em desenvolvimento.
// Sao upsert por slug: rodar de novo nao duplica. Troque por dados reais
// pelo painel admin quando quiser.
const talks = [
  {
    slug: 'python-para-analise-de-dados-ufpi',
    title: 'Python para Análise de Dados',
    titleEn: 'Python for Data Analysis',
    description: 'Introdução prática a pandas e visualização para quem vem da economia.',
    event: 'Semana de Economia — UFPI',
    eventEn: 'Economics Week — UFPI',
    location: 'Teresina, PI',
    date: new Date('2025-04-18'),
    tags: ['Python', 'Dados'],
    slidesUrl: 'https://example.com/slides/python-ufpi',
    published: true,
  },
  {
    slug: 'engenharia-de-dados-no-setor-publico',
    title: 'Engenharia de Dados no Setor Público',
    titleEn: 'Data Engineering in the Public Sector',
    description: 'Pipelines, qualidade e governança de dados em governo.',
    event: 'Encontro de Gestão Pública',
    eventEn: 'Public Management Meeting',
    location: 'Teresina, PI',
    date: new Date('2025-06-05'),
    tags: ['Engenharia de Dados', 'Setor Público'],
    slidesUrl: 'https://example.com/slides/eng-dados',
    videoUrl: 'https://example.com/video/eng-dados',
    published: true,
  },
  {
    slug: 'seguranca-em-aplicacoes-de-ia',
    title: 'Segurança em Aplicações de IA',
    titleEn: 'Security in AI Applications',
    description: 'Superfícies de ataque, prompt injection e mitigação.',
    event: 'Semana de Segurança da Informação',
    eventEn: 'Information Security Week',
    location: 'Parnaíba, PI',
    date: new Date('2025-09-12'),
    tags: ['Segurança', 'IA'],
    published: true,
  },
  {
    slug: 'llms-na-gestao-publica',
    title: 'LLMs na Gestão Pública',
    titleEn: 'LLMs in Public Management',
    description: 'Casos de uso, limites e soberania de dados.',
    event: 'SIA-PI — Ciclo de Formação',
    eventEn: 'SIA-PI — Training Cycle',
    location: 'Teresina, PI',
    date: new Date('2026-02-20'),
    tags: ['IA', 'Setor Público'],
    slidesUrl: 'https://example.com/slides/llms',
    published: true,
  },
  {
    slug: 'do-notebook-a-producao',
    title: 'Do Notebook à Produção',
    titleEn: 'From Notebook to Production',
    description: 'Como sair do experimento e entregar algo que roda.',
    event: 'Meetup de Dados do Piauí',
    eventEn: 'Piauí Data Meetup',
    location: 'Teresina, PI',
    date: new Date('2026-05-14'),
    tags: ['Python', 'Engenharia de Dados'],
    videoUrl: 'https://example.com/video/notebook-producao',
    published: true,
  },
  {
    slug: 'fundamentos-de-machine-learning',
    title: 'Fundamentos de Machine Learning',
    titleEn: 'Machine Learning Foundations',
    description: 'O mínimo teórico para não usar modelo como caixa-preta.',
    event: 'Curso de Extensão — UFPI',
    eventEn: 'Extension Course — UFPI',
    location: 'Picos, PI',
    date: new Date('2026-07-30'),
    tags: ['IA', 'Python'],
    published: true,
  },
]

async function main() {
  for (const talk of talks) {
    await prisma.talk.upsert({
      where: { slug: talk.slug },
      update: talk,
      create: talk,
    })
  }
  console.log(`${talks.length} aulas inseridas ou atualizadas.`)
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}

export default main
