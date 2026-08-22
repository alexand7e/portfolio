import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Corrige cargos e datas divergentes do perfil oficial e acrescenta duas
// experiencias que faltavam. Idempotente: casa pelo par empresa+cargo
// atual no banco e, se ja tiver sido corrigido, casa pelo cargo novo.

type Correcao = {
  de: { company: string; position: string }
  para: {
    company?: string
    position?: string
    positionEn?: string
    startDate?: Date
    endDate?: Date | null
    current?: boolean
    order?: number
  }
}

const correcoes: Correcao[] = [
  {
    de: { company: 'SIA-PI (Secretaria de Inteligência Artificial)', position: 'Manager - Inteligência Artificial' },
    para: {
      position: 'Gerente de Programas em IA',
      positionEn: 'AI Programs Manager',
      startDate: new Date('2025-04-01T00:00:00Z'),
      endDate: null,
      current: true,
      order: 1,
    },
  },
  {
    de: { company: 'Teaser Soluções', position: 'Co-Founder & CTO' },
    para: {
      position: 'Co-fundador e Gerente de Tecnologia',
      positionEn: 'Co-founder & Technology Manager',
      startDate: new Date('2024-10-01T00:00:00Z'),
      endDate: null,
      current: true,
      order: 2,
    },
  },
  {
    de: { company: 'SIA-PI - Governo do Piauí', position: 'Coordenador de Dados Estratégicos' },
    para: {
      startDate: new Date('2024-06-01T00:00:00Z'),
      endDate: new Date('2025-04-01T00:00:00Z'),
      current: false,
      order: 4,
    },
  },
  {
    de: { company: 'Servfaz - Serviços de Mão de Obra', position: 'Analista de Dados' },
    para: {
      startDate: new Date('2023-07-01T00:00:00Z'),
      endDate: new Date('2024-06-01T00:00:00Z'),
      current: false,
      order: 6,
    },
  },
]

const novas = [
  {
    company: 'Fundação de Amparo à Pesquisa do Estado do Piauí (FAPEPI)',
    companyEn: 'Piauí State Research Support Foundation (FAPEPI)',
    position: 'Bolsista',
    positionEn: 'Research Fellow',
    description: 'Equipe de pesquisa do Estudo de Emprego e Renda no Estado do Piauí.',
    descriptionEn: 'Research team for the Employment and Income Study in the State of Piauí.',
    startDate: new Date('2023-09-01T00:00:00Z'),
    endDate: new Date('2025-01-01T00:00:00Z'),
    current: false,
    location: 'Teresina, PI',
    technologies: ['Análise de Dados', 'Estatística', 'R'],
    order: 5,
  },
  {
    company: 'Governo do Estado do Piauí',
    companyEn: 'Government of the State of Piauí',
    position: 'Analista de gestão de orçamento',
    positionEn: 'Budget Management Analyst',
    description:
      'Área de orçamento na Superintendência de Planejamento e Orçamento Estadual, com foco em controle orçamentário e relatórios de acompanhamento legal e interno.',
    descriptionEn:
      'Budget area at the State Planning and Budget Superintendency, focused on budget control and legal and internal monitoring reports.',
    startDate: new Date('2022-02-01T00:00:00Z'),
    endDate: new Date('2023-07-01T00:00:00Z'),
    current: false,
    location: 'Teresina, PI',
    technologies: ['Orçamento Público', 'Excel', 'Power BI'],
    order: 7,
  },
]

async function main() {
  for (const { de, para } of correcoes) {
    const alvo = await prisma.experience.findFirst({
      where: {
        company: de.company,
        position: { in: [de.position, para.position ?? de.position] },
      },
    })

    if (!alvo) {
      console.warn(`nao encontrada: ${de.position} @ ${de.company}`)
      continue
    }

    await prisma.experience.update({ where: { id: alvo.id }, data: para })
    console.log(`corrigida: ${para.position ?? alvo.position} @ ${alvo.company}`)
  }

  for (const nova of novas) {
    const existe = await prisma.experience.findFirst({
      where: { company: nova.company, position: nova.position },
    })
    if (existe) {
      await prisma.experience.update({ where: { id: existe.id }, data: nova })
      console.log(`atualizada: ${nova.position} @ ${nova.company}`)
    } else {
      await prisma.experience.create({ data: nova })
      console.log(`criada: ${nova.position} @ ${nova.company}`)
    }
  }

  // Freelance & Projetos fica atras das atuais, por decisao do dono.
  await prisma.experience.updateMany({
    where: { company: 'Freelance & Projetos' },
    data: { order: 3 },
  })
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
