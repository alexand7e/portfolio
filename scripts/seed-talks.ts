import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Slugs do seed sintetico anterior, removidos ao rodar este script.
const SINTETICOS = [
  'python-para-analise-de-dados-ufpi',
  'engenharia-de-dados-no-setor-publico',
  'seguranca-em-aplicacoes-de-ia',
  'llms-na-gestao-publica',
  'do-notebook-a-producao',
  'fundamentos-de-machine-learning',
]

// Dados reais, de "cursos e apresentacoes".
// Sem fotografia por opcao: o card se apoia em contexto, data, slides e repo.
// Links do Google normalizados para a forma canonica, sem querystring — o
// parametro ouid do link original identifica a conta e nao precisa ir ao ar.
const talks = [
  {
    slug: 'ia-aplicada-a-negocios-do-dia-a-dia',
    title: 'IA Aplicada a negócios do dia a dia',
    titleEn: 'AI Applied to Everyday Business',
    description: 'Palestra de 30 minutos para a Street Piauí.',
    event: 'Street Piauí',
    date: new Date('2026-08-08T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/presentation/d/1dKjVe_wVMvk1CVTBP_2Z9IW5tGQzth8c/edit',
    tags: ['IA', 'Negócios'],
    repos: [],
    published: true,
  },
  {
    slug: 'apache-airflow-3-mini-aula',
    title: 'Apache Airflow 3.x — mini aula',
    titleEn: 'Apache Airflow 3.x — Short Class',
    description: 'Mini aula de 1h para os trainees da Fábrica de Gênios.',
    event: 'Fábrica de Gênios',
    date: new Date('2026-06-08T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/presentation/d/1b7eJHWWxK2TQtegJawdwLPQikf4WkNCH8aDnpruTe1E/edit',
    tags: ['Airflow', 'Engenharia de Dados'],
    repos: ['https://github.com/alexand7e/airflow-simplificado'],
    published: true,
  },
  {
    slug: 'langchain-na-sala-de-aula',
    title: 'LangChain na sala de aula: construindo ferramentas de IA para o ensino',
    titleEn: 'LangChain in the Classroom: Building AI Tools for Teaching',
    description:
      'Palestra no evento Piauí para o Mundo, reunindo professores e alunos que iriam para intercâmbio pela Seduc-PI.',
    event: 'Piauí para o Mundo — Seduc-PI',
    date: new Date('2026-06-12T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/presentation/d/1um2cgBAgXvP3UaZar9LaNl5ilQuqM_zsYgmAlnu22Es/edit',
    tags: ['IA', 'LangChain', 'Python'],
    repos: ['https://github.com/alexand7e/langchain-simplificado'],
    published: true,
  },
  {
    slug: 'python-simplificado-do-zero-ao-primeiro-script',
    title: 'Python simplificado: do zero ao primeiro script, com a ajuda da Inteligência Artificial',
    titleEn: 'Simplified Python: From Zero to Your First Script, with AI',
    description:
      'Curso de 5 módulos de Python para servidores públicos, em duas turmas, entre o fim de junho e o começo de julho.',
    event: 'Formação para servidores públicos',
    date: new Date('2026-06-29T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/document/d/1hiGaRuSPza_owpBZspt-Kmmfx4FG9o-7Vi6j7PsF1sw/edit',
    tags: ['Python', 'IA', 'Setor Público'],
    repos: [
      'https://github.com/alexand7e/python-simplificado',
      'https://github.com/alexand7e/curso-python-3',
      'https://github.com/alexand7e/curso-python-2',
    ],
    published: true,
  },
  {
    slug: 'engenharia-de-dados-em-2026',
    title:
      'Engenharia de Dados em 2026: Containers, Serviços, Airflow, Spark, Polars e… Pandas?',
    titleEn: 'Data Engineering in 2026: Containers, Services, Airflow, Spark, Polars and… Pandas?',
    description: 'Apresentação para os alunos do curso de computação da UESPI, no evento deles.',
    event: 'UESPI — Curso de Computação',
    date: new Date('2026-07-07T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/presentation/d/1P34s5stz1kfS2Z92hD8x3iH5MvG03rKURZkTJKH1tfU/edit',
    tags: ['Engenharia de Dados', 'Airflow', 'Spark', 'Docker'],
    repos: ['https://github.com/alexand7e/airflow-simplificado/tree/feat/spark-bigdata'],
    published: true,
  },
  {
    slug: 'workshop-airflow-e-docker-icev',
    title: 'Workshop: Fundamentos e Projetos com Airflow e Docker',
    titleEn: 'Workshop: Airflow and Docker Fundamentals and Projects',
    description:
      'Workshop para os alunos de engenharia de software do Icev, marcando o primeiro evento do projeto.',
    event: 'Icev — Engenharia de Software',
    date: new Date('2024-11-30T00:00:00Z'),
    slidesUrl: 'https://drive.google.com/file/d/1w5imoJ9Ych1zeEO4cwISBJwcnriVFezQ/view',
    tags: ['Airflow', 'Docker', 'Engenharia de Dados'],
    repos: ['https://github.com/alexand7e/icev-airflow'],
    published: true,
  },

  // ── Sem data no documento de origem ───────────────────────────────
  // Entram despublicadas para nao inventar data. Defina a data real e
  // publique pelo painel admin quando for o caso.
  {
    slug: 'seguranca-da-informacao-e-gestao-de-dados',
    title: 'Segurança da informação e Gestão de Dados para Servidores Públicos',
    titleEn: 'Information Security and Data Management for Public Servants',
    description: 'Apresentação para servidores públicos e públicos iniciantes. Repositório em estudo.',
    event: 'Formação para servidores públicos',
    date: new Date('2026-12-31T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/presentation/d/1Ybf5C7oTbg-M0gMmn9lMHkIORunQj4D8Fy1KJsQQNYw/edit',
    tags: ['Segurança', 'Dados', 'Setor Público'],
    repos: [],
    published: false,
  },
  {
    slug: 'ia-como-ferramenta',
    title:
      'Inteligência Artificial como ferramenta: o que ela é de verdade, o que ela não é, e como usá-la sem terceirizar o seu julgamento',
    titleEn: 'AI as a Tool: What It Really Is, What It Is Not, and How to Use It Without Outsourcing Your Judgment',
    description: 'Material introdutório adaptado do Capacitia.',
    event: 'Capacitia — material adaptado',
    date: new Date('2026-12-31T00:00:00Z'),
    slidesUrl: 'https://docs.google.com/presentation/d/15v1Tz3QQPhfPFrgXAjf1lKXmEB-lwK7oQtVDqJ6_BhI/edit',
    tags: ['IA'],
    repos: [],
    published: false,
  },
]

async function main() {
  const removidos = await prisma.talk.deleteMany({ where: { slug: { in: SINTETICOS } } })
  console.log(`${removidos.count} registros sinteticos removidos.`)

  for (const talk of talks) {
    await prisma.talk.upsert({
      where: { slug: talk.slug },
      update: talk,
      create: talk,
    })
  }

  const publicadas = talks.filter((t) => t.published).length
  console.log(`${talks.length} aulas gravadas (${publicadas} publicadas, ${talks.length - publicadas} sem data).`)
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
