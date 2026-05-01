import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Dados das experiências
const experiences = [
  {
    company: "SIA-PI (Secretaria de Inteligência Artificial)",
    companyEn: "SIA-PI (Artificial Intelligence Secretariat)",
    position: "Manager - Inteligência Artificial",
    positionEn: "Manager - Artificial Intelligence",
    description: "Liderando iniciativas de IA e estratégia de dados para inovação no setor público. Promovendo a disseminação e uso qualificado de ferramentas de IA em diferentes áreas da gestão pública.",
    descriptionEn: "Leading AI initiatives and data strategy for innovation in the public sector. Promoting the dissemination and qualified use of AI tools in different areas of public management.",
    startDate: new Date('2024-01-01'),
    endDate: null,
    current: true,
    location: "Teresina, PI",
    locationEn: "Teresina, PI",
    technologies: ["Python", "AI/ML", "Data Strategy", "Public Innovation", "Team Leadership"],
    order: 1
  },
  {
    company: "Teaser Soluções",
    companyEn: "Teaser Solutions",
    position: "Co-Founder & CTO",
    positionEn: "Co-Founder & CTO",
    description: "Desenvolvendo soluções escaláveis e sistemas de automação para clientes enterprise. Liderando equipes de desenvolvimento e implementando soluções digitais inovadoras.",
    descriptionEn: "Developing scalable solutions and automation systems for enterprise clients. Leading development teams and implementing innovative digital solutions.",
    startDate: new Date('2024-01-01'),
    endDate: null,
    current: true,
    location: "Teresina, PI",
    locationEn: "Teresina, PI",
    technologies: ["Node.js", "TypeScript", "React", "Docker", "Kubernetes", "AWS/GCP"],
    order: 2
  },
  {
    company: "Freelance & Projetos",
    companyEn: "Freelance & Projects",
    position: "Data Engineer & Full-Stack Developer",
    positionEn: "Data Engineer & Full-Stack Developer",
    description: "Arquitetando soluções end-to-end: desde ingestão e processamento de dados (Python/Spark) até workflows automatizados (Airflow) e aplicações para usuários (TypeScript/React).",
    descriptionEn: "Architecting end-to-end solutions: from data ingestion and processing (Python/Spark) to automated workflows (Airflow) and user applications (TypeScript/React).",
    startDate: new Date('2023-01-01'),
    endDate: null,
    current: true,
    location: "Remote",
    locationEn: "Remote",
    technologies: ["Python", "Apache Spark", "Apache Airflow", "TypeScript", "React", "PostgreSQL"],
    order: 3
  },
  {
    company: "SIA-PI - Governo do Piauí",
    companyEn: "SIA-PI - Piauí Government",
    position: "Coordenador de Dados Estratégicos",
    positionEn: "Strategic Data Coordinator",
    description: "Coordenei iniciativas de dados estratégicos para o Estado, desenvolvendo soluções de análise e visualização de dados para tomada de decisão governamental.",
    descriptionEn: "Coordinated strategic data initiatives for the State, developing data analysis and visualization solutions for governmental decision making.",
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    current: false,
    location: "Teresina, PI",
    locationEn: "Teresina, PI",
    technologies: ["Python", "Data Analysis", "Data Visualization", "PostgreSQL", "Business Intelligence"],
    order: 4
  },
  {
    company: "Servfaz - Serviços de Mão de Obra",
    companyEn: "Servfaz - Labor Services",
    position: "Analista de Dados",
    positionEn: "Data Analyst",
    description: "Atuei na Superintendência de Transformação Digital da Secretaria de Planejamento do Piauí, realizando análise e consolidação de bases de dados governamentais.",
    descriptionEn: "Worked at the Digital Transformation Superintendency of Piauí's Planning Secretariat, performing analysis and consolidation of governmental databases.",
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    current: false,
    location: "Teresina, PI",
    locationEn: "Teresina, PI",
    technologies: ["Python", "SQL", "Data Analysis", "ETL", "Government Data"],
    order: 5
  }
]

// Dados dos projetos
const projects = [
  {
    slug: "portfolio-pessoal",
    title: "Portfolio Pessoal",
    titleEn: "Personal Portfolio",
    description: "Portfolio moderno desenvolvido com Next.js 14, TypeScript e Tailwind CSS. Inclui blog integrado, deploy automatizado com GitHub Actions e CI/CD pipeline completo.",
    descriptionEn: "Modern portfolio developed with Next.js 14, TypeScript and Tailwind CSS. Includes integrated blog, automated deploy with GitHub Actions and complete CI/CD pipeline.",
    content: "Um portfolio completo desenvolvido do zero com as mais modernas tecnologias web. O projeto inclui sistema de blog integrado, interface administrativa para gerenciamento de conteúdo, deploy automatizado e pipeline de CI/CD completo.",
    contentEn: "A complete portfolio developed from scratch with the most modern web technologies. The project includes integrated blog system, administrative interface for content management, automated deploy and complete CI/CD pipeline.",
    imageUrl: "/uploads/portfolio-preview.jpg",
    demoUrl: "https://alexand7e.dev.br",
    githubUrl: "https://github.com/alexand7e/portfolio",
    technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Docker", "CI/CD"],
    featured: true,
    status: "PUBLISHED"
  },
  {
    slug: "sia-pi-inteligencia-artificial",
    title: "SIA-PI - Inteligência Artificial",
    titleEn: "SIA-PI - Artificial Intelligence",
    description: "Liderança de iniciativas de IA e estratégia de dados para inovação no setor público. Desenvolvimento de soluções de análise e visualização de dados governamentais.",
    descriptionEn: "Leadership of AI initiatives and data strategy for innovation in the public sector. Development of governmental data analysis and visualization solutions.",
    content: "Projeto de transformação digital no setor público através da implementação de soluções de inteligência artificial e análise de dados. Inclui desenvolvimento de dashboards, pipelines de dados e sistemas de análise para tomada de decisão governamental.",
    contentEn: "Digital transformation project in the public sector through the implementation of artificial intelligence solutions and data analysis. Includes development of dashboards, data pipelines and analysis systems for governmental decision making.",
    imageUrl: "/uploads/sia-pi-preview.jpg",
    demoUrl: "#",
    githubUrl: "#",
    technologies: ["Python", "Data Engineering", "AI/ML", "ETL Pipelines", "Apache Airflow", "PostgreSQL"],
    featured: true,
    status: "PUBLISHED"
  },
  {
    slug: "teaser-solucoes-enterprise",
    title: "Teaser - Soluções Enterprise",
    titleEn: "Teaser - Enterprise Solutions",
    description: "Desenvolvimento de soluções escaláveis e sistemas de automação para clientes enterprise. Arquitetura de microserviços e aplicações serverless.",
    descriptionEn: "Development of scalable solutions and automation systems for enterprise clients. Microservices architecture and serverless applications.",
    content: "Plataforma completa de soluções enterprise incluindo sistemas de automação, arquitetura de microserviços e aplicações serverless. Foco em escalabilidade, performance e confiabilidade para clientes corporativos.",
    contentEn: "Complete enterprise solutions platform including automation systems, microservices architecture and serverless applications. Focus on scalability, performance and reliability for corporate clients.",
    imageUrl: "/uploads/teaser-preview.jpg",
    demoUrl: "#",
    githubUrl: "#",
    technologies: ["Node.js", "TypeScript", "React", "Docker", "Kubernetes", "AWS/GCP"],
    featured: true,
    status: "PUBLISHED"
  },
  {
    slug: "etl-pipeline-caged",
    title: "ETL Pipeline - CAGED",
    titleEn: "ETL Pipeline - CAGED",
    description: "Pipeline ETL robusto para processamento de microdados do CAGED utilizando Python e Apache Airflow. Análise de dados do mercado de trabalho brasileiro.",
    descriptionEn: "Robust ETL pipeline for processing CAGED microdata using Python and Apache Airflow. Analysis of Brazilian labor market data.",
    content: "Sistema completo de ETL para processamento e análise de microdados do CAGED (Cadastro Geral de Empregados e Desempregados). Inclui pipelines automatizados, validação de dados e dashboards de análise do mercado de trabalho.",
    contentEn: "Complete ETL system for processing and analyzing CAGED (General Registry of Employed and Unemployed) microdata. Includes automated pipelines, data validation and labor market analysis dashboards.",
    imageUrl: "/uploads/caged-preview.jpg",
    demoUrl: "#",
    githubUrl: "https://github.com/alexand7e/Microdados-CAGED",
    technologies: ["Python", "Apache Airflow", "PostgreSQL", "ETL", "Data Analysis", "Pandas"],
    featured: false,
    status: "PUBLISHED"
  },
  {
    slug: "dataset-pi-analise-governamental",
    title: "Dataset-PI - Análise Governamental",
    titleEn: "Dataset-PI - Governmental Analysis",
    description: "Compilação e análise de datasets específicos do Estado do Piauí, incluindo indicadores socioeconômicos para pesquisa e tomada de decisão.",
    descriptionEn: "Compilation and analysis of specific datasets from Piauí State, including socioeconomic indicators for research and decision making.",
    content: "Projeto de compilação e análise de dados específicos do Estado do Piauí, incluindo indicadores socioeconômicos, dados demográficos e estatísticas governamentais para suporte à pesquisa acadêmica e tomada de decisão pública.",
    contentEn: "Project for compilation and analysis of specific data from Piauí State, including socioeconomic indicators, demographic data and governmental statistics to support academic research and public decision making.",
    imageUrl: "/uploads/dataset-pi-preview.jpg",
    demoUrl: "#",
    githubUrl: "https://github.com/alexand7e/Dataset-PI",
    technologies: ["Python", "Jupyter", "Data Analysis", "Visualization", "PostgreSQL"],
    featured: false,
    status: "PUBLISHED"
  },
  {
    slug: "cicd-pipeline",
    title: "CI/CD Pipeline",
    titleEn: "CI/CD Pipeline",
    description: "Pipeline completo de integração e deploy contínuo configurado com GitHub Actions, Docker e deploy automatizado no servidor.",
    descriptionEn: "Complete continuous integration and deployment pipeline configured with GitHub Actions, Docker and automated server deployment.",
    content: "Sistema completo de CI/CD implementado com GitHub Actions, incluindo testes automatizados, build de containers Docker, deploy automatizado e monitoramento de aplicações em produção.",
    contentEn: "Complete CI/CD system implemented with GitHub Actions, including automated tests, Docker container builds, automated deployment and production application monitoring.",
    imageUrl: "/uploads/cicd-preview.jpg",
    demoUrl: "#",
    githubUrl: "https://github.com/alexand7e/portfolio",
    technologies: ["GitHub Actions", "Docker", "CI/CD", "Deploy Automation", "Nginx"],
    featured: false,
    status: "PUBLISHED"
  }
]

// Dados do blog post
const blogPost = {
  slug: "construindo-portfolio-nextjs",
  title: "Como Criei Meu Portfolio do Zero (e Por Que Você Deveria Fazer o Mesmo) 🚀",
  titleEn: "How I Built My Portfolio from Scratch (and Why You Should Do the Same) 🚀",
  description: "A jornada real de um Engenheiro de Dados que decidiu sair da zona de conforto e criar algo incrível. Spoiler: valeu cada minuto!",
  descriptionEn: "The real journey of a Data Engineer who decided to step out of his comfort zone and create something incredible. Spoiler: it was worth every minute!",
  content: `# Como Criei Meu Portfolio do Zero (e Por Que Você Deveria Fazer o Mesmo) 🚀

## 💭 Aquele Momento de "E Se..."

Sabe aquela sensação de estar navegando no LinkedIn e ver aqueles portfolios incríveis que fazem você pensar "caramba, eu deveria ter um desses"? 

Pois é, eu tive esse momento há algumas semanas. E não, não foi só mais uma daquelas ideias que ficam na cabeça e nunca saem do papel. Desta vez, eu realmente fiz acontecer.

E cara, que experiência foi essa! 🎯

---

## 🎪 Por Que Decidi Sair da Zona de Conforto

### A Realidade Crua
- **LinkedIn está saturado** de posts genéricos sobre "5 dicas para..."
- **Portfolios são raros** na área de dados (e isso é uma oportunidade!)
- **Mostrar > Contar**: Nada substitui ver algo funcionando na prática
- **Networking real**: Pessoas que realmente se interessam pelo seu trabalho

### O Gatilho Definitivo
Foi numa reunião com o **Marcos** (aquele frontend genial que conheci na SIA - Secretaria de Inteligência Artificial). Ele estava mostrando uns projetos dele e eu pensei: "porra, eu sou Engenheiro de Dados, mas também sei programar. Por que não?"

**E foi assim que começou tudo.**

---

## 🛠️ A Stack Que Escolhi (e Por Que)

### Next.js 14 - Não, Não É Só "Mais Um Framework React"
- **App Router**: Mudei de ideia 3 vezes sobre a arquitetura. Valeu a pena.
- **TypeScript nativo**: Sim, é mais verboso, mas quando você vê o erro antes de rodar... 🤯
- **SSR automático**: SEO que funciona sem você fazer nada
- **Image optimization**: Suas imagens ficam otimizadas automaticamente

### Tailwind CSS - O Amor à Primeira Vista
- **Utility-first**: No começo parece estranho, depois você não consegue viver sem
- **Responsivo por padrão**: Mobile-first que realmente funciona
- **Customização**: Criei um sistema de cores que faz sentido (não é só "azul bonito")

### Framer Motion - Porque Animações Importam
- **Performance**: 60fps sem esforço
- **Declarativo**: Você descreve o que quer, não como fazer
- **Gestos**: Swipe, drag, hover... tudo funciona

---

## 🚀 O Que Aprendi no Processo

### 1. **Design System é Vida**
Criar um sistema de cores e componentes consistente desde o início economiza HORAS depois.

### 2. **TypeScript Vale a Pena**
Sim, é mais código no início. Mas quando você refatora algo e não quebra nada... 🙏

### 3. **Performance Importa**
- Lazy loading de imagens
- Code splitting automático
- Otimização de bundle

### 4. **SEO Não É Opcional**
- Meta tags dinâmicas
- Structured data
- Sitemap automático
- Open Graph para redes sociais

---

## 💡 Dicas Para Quem Quer Começar

### Comece Simples
- Uma página só já é um começo
- Não precisa ser perfeito na primeira versão
- Foque no conteúdo primeiro, design depois

### Use o Que Você Já Sabe
- Se você sabe React, use Next.js
- Se você sabe Vue, use Nuxt
- Se você sabe Python, use FastAPI + algum frontend

### Deploy Cedo e Frequente
- Vercel/Netlify para frontend
- Railway/Render para backend
- GitHub Actions para CI/CD

---

## 🎯 Resultados Que Não Esperava

### Networking Orgânico
Pessoas começaram a me procurar no LinkedIn depois de ver o portfolio. Não foi marketing, foi consequência.

### Clareza Profissional
Escrever sobre o que você faz te força a organizar as ideias. Descobri coisas sobre mim mesmo no processo.

### Confiança Técnica
Quando você constrói algo do zero e funciona, você percebe que consegue fazer mais do que imaginava.

---

## 🔥 O Que Vem Por Aí

- **Blog integrado** (este post é o primeiro!)
- **Seção de projetos** com mais detalhes técnicos
- **Newsletter** para quem quiser acompanhar a jornada
- **Open source** de alguns componentes que criei

---

## 💬 Conclusão

Se você chegou até aqui, provavelmente está pensando em criar o seu próprio portfolio. 

**Minha dica?** 

**FAÇA.**

Não precisa ser perfeito. Não precisa ser revolucionário. Precisa ser **SEU**.

E se você criar algo legal, me marca no LinkedIn! Adoro ver o que a galera está construindo.

---

*Ah, e se você quiser trocar uma ideia sobre data engineering, IA ou qualquer coisa tech, só chamar. Sempre rola uma conversa boa! 🚀*

**Alexandre Barros**  
*Data Engineer | Full-Stack Developer | Tech Leader*`,
  contentEn: `# How I Built My Portfolio from Scratch (and Why You Should Do the Same) 🚀

## 💭 That "What If..." Moment

You know that feeling when you're browsing LinkedIn and see those incredible portfolios that make you think "damn, I should have one of those"?

Well, I had that moment a few weeks ago. And no, it wasn't just another one of those ideas that stay in your head and never come to fruition. This time, I actually made it happen.

And man, what an experience it was! 🎯

---

## 🎪 Why I Decided to Step Out of My Comfort Zone

### The Raw Reality
- **LinkedIn is saturated** with generic posts about "5 tips for..."
- **Portfolios are rare** in the data field (and that's an opportunity!)
- **Show > Tell**: Nothing replaces seeing something working in practice
- **Real networking**: People who are genuinely interested in your work

### The Definitive Trigger
It was in a meeting with **Marcos** (that brilliant frontend guy I met at SIA - Artificial Intelligence Secretariat). He was showing some of his projects and I thought: "damn, I'm a Data Engineer, but I also know how to code. Why not?"

**And that's how it all started.**

---

## 🛠️ The Stack I Chose (and Why)

### Next.js 14 - No, It's Not Just "Another React Framework"
- **App Router**: I changed my mind 3 times about the architecture. It was worth it.
- **Native TypeScript**: Yes, it's more verbose, but when you see the error before running... 🤯
- **Automatic SSR**: SEO that works without you doing anything
- **Image optimization**: Your images get optimized automatically

### Tailwind CSS - Love at First Sight
- **Utility-first**: At first it seems strange, then you can't live without it
- **Responsive by default**: Mobile-first that actually works
- **Customization**: I created a color system that makes sense (it's not just "pretty blue")

### Framer Motion - Because Animations Matter
- **Performance**: 60fps effortlessly
- **Declarative**: You describe what you want, not how to do it
- **Gestures**: Swipe, drag, hover... everything works

---

## 🚀 What I Learned in the Process

### 1. **Design System is Life**
Creating a consistent color and component system from the start saves HOURS later.

### 2. **TypeScript is Worth It**
Yes, it's more code at first. But when you refactor something and nothing breaks... 🙏

### 3. **Performance Matters**
- Lazy loading of images
- Automatic code splitting
- Bundle optimization

### 4. **SEO is Not Optional**
- Dynamic meta tags
- Structured data
- Automatic sitemap
- Open Graph for social networks

---

## 💡 Tips for Those Who Want to Start

### Start Simple
- Just one page is already a start
- It doesn't need to be perfect in the first version
- Focus on content first, design later

### Use What You Already Know
- If you know React, use Next.js
- If you know Vue, use Nuxt
- If you know Python, use FastAPI + some frontend

### Deploy Early and Often
- Vercel/Netlify for frontend
- Railway/Render for backend
- GitHub Actions for CI/CD

---

## 🎯 Results I Didn't Expect

### Organic Networking
People started reaching out to me on LinkedIn after seeing the portfolio. It wasn't marketing, it was a consequence.

### Professional Clarity
Writing about what you do forces you to organize your ideas. I discovered things about myself in the process.

### Technical Confidence
When you build something from scratch and it works, you realize you can do more than you imagined.

---

## 🔥 What's Coming Next

- **Integrated blog** (this post is the first!)
- **Projects section** with more technical details
- **Newsletter** for those who want to follow the journey
- **Open source** some components I created

---

## 💬 Conclusion

If you made it this far, you're probably thinking about creating your own portfolio.

**My tip?**

**DO IT.**

It doesn't need to be perfect. It doesn't need to be revolutionary. It needs to be **YOURS**.

And if you create something cool, tag me on LinkedIn! I love seeing what people are building.

---

*Oh, and if you want to chat about data engineering, AI or anything tech, just reach out. There's always a good conversation! 🚀*

**Alexandre Barros**  
*Data Engineer | Full-Stack Developer | Tech Leader*`,
  published: true,
  publishedAt: new Date('2025-08-25'),
  tags: ["Next.js", "React", "TypeScript", "Portfolio", "Carreira", "Tech"],
  readTime: 6
}

async function main() {
  console.log('🚀 Iniciando população do banco de dados...')

  try {
    // Limpar dados existentes (opcional - remova se quiser manter dados existentes)
    console.log('🧹 Limpando dados existentes...')
    await prisma.blog.deleteMany()
    await prisma.project.deleteMany()
    await prisma.experience.deleteMany()

    // Inserir experiências
    console.log('💼 Inserindo experiências...')
    for (const experience of experiences) {
      await prisma.experience.create({
        data: experience
      })
    }
    console.log(`✅ ${experiences.length} experiências inseridas`)

    // Inserir projetos
    console.log('🚀 Inserindo projetos...')
    for (const project of projects) {
      await prisma.project.create({
        data: { ...project, status: project.status as 'DRAFT' | 'PUBLISHED' }
      })
    }
    console.log(`✅ ${projects.length} projetos inseridos`)

    // Inserir post do blog
    console.log('📝 Inserindo post do blog...')
    await prisma.blog.create({
      data: blogPost
    })
    console.log('✅ 1 post do blog inserido')

    console.log('🎉 População do banco de dados concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default main