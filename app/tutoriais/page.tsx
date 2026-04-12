import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiTag, FiArrowRight } from 'react-icons/fi'
import { Metadata } from 'next'
import { SubpageSideNav } from '@/components/ui/SubpageSideNav'

export const metadata: Metadata = {
  title: 'Tutoriais',
  description:
    'Tutoriais práticos sobre IA, engenharia de dados, Python e tecnologia pública por Alexandre Barros (SIA-PI, UFPI).',
  keywords: [
    'tutoriais IA', 'alexandre barros sia', 'alexandre barros ufpi',
    'Python tutorial', 'engenharia de dados', 'machine learning tutorial',
    'inteligência artificial piauí', 'data science brasil',
  ],
  alternates: { canonical: 'https://alexand7e.dev.br/tutoriais' },
  openGraph: {
    title: 'Tutoriais | Alexandre Barros',
    description: 'Tutoriais práticos de IA e dados por Alexandre Barros (SIA-PI).',
    url: 'https://alexand7e.dev.br/tutoriais',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

const difficultyLabel: Record<string, string> = {
  BEGINNER: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
}

const difficultyColor: Record<string, string> = {
  BEGINNER: 'bg-green-500/15 text-green-400',
  INTERMEDIATE: 'bg-yellow-500/15 text-yellow-400',
  ADVANCED: 'bg-red-500/15 text-red-400',
}

export default async function TutoriaisPage() {
  const tutorials = await prisma.tutorial.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    include: { series: { select: { title: true, slug: true } } },
  })

  const featured = tutorials[0] ?? null
  const rest = tutorials.slice(1)

  return (
    <main className="min-h-screen bg-primary lg:pl-40">
      <SubpageSideNav />
      <div className="bg-secondary border-b border-accent/20">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors mb-8 text-sm"
          >
            <FiArrowLeft size={14} />
            Voltar ao início
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-3 tracking-tight">
            Tutoriais
          </h1>
          <p className="text-tertiary/60 text-lg">
            Guias hands-on sobre IA, dados e desenvolvimento
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {tutorials.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <FiTag size={24} className="text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-tertiary mb-2">Nenhum tutorial ainda</h3>
            <p className="text-tertiary/50">Em breve publico tutoriais práticos.</p>
          </div>
        )}

        {/* Featured */}
        {featured && (
          <section className="mb-14">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">
              Destaque
            </span>
            <Link href={`/tutoriais/${featured.slug}`} className="group block">
              <div className="bg-secondary border border-accent/20 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 relative">
                    {featured.coverImage || featured.coverUrl ? (
                      <div className="aspect-[16/9] lg:aspect-auto lg:h-full min-h-[240px] overflow-hidden">
                        <img
                          src={(featured.coverImage || featured.coverUrl)!}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] lg:aspect-auto lg:h-full min-h-[240px] bg-gradient-to-br from-accent/20 via-accent/10 to-transparent flex items-center justify-center">
                        <span className="text-7xl font-bold text-accent/20 select-none">
                          {featured.title[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyColor[featured.difficulty]}`}>
                        {difficultyLabel[featured.difficulty]}
                      </span>
                      {featured.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 bg-accent/15 text-accent text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-tertiary mb-3 leading-snug group-hover:text-accent transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-tertiary/60 mb-6 leading-relaxed line-clamp-3">
                      {featured.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-tertiary/40 mb-6">
                      {featured.estimatedTime && (
                        <span className="flex items-center gap-1.5">
                          <FiClock size={12} />
                          {featured.estimatedTime} min
                        </span>
                      )}
                      {featured.series && (
                        <span className="text-accent/70">Série: {featured.series.title}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                      Ver tutorial
                      <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <section>
            <span className="text-xs font-semibold tracking-widest text-accent/60 uppercase mb-6 block">
              Mais tutoriais
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((tutorial) => {
                const cover = tutorial.coverImage || tutorial.coverUrl
                return (
                  <Link key={tutorial.slug} href={`/tutoriais/${tutorial.slug}`} className="group block">
                    <article className="bg-secondary border border-accent/20 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 h-full flex flex-col">
                      <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
                        {cover ? (
                          <img src={cover} alt={tutorial.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent/15 via-accent/5 to-transparent flex items-center justify-center">
                            <span className="text-4xl font-bold text-accent/20 select-none">{tutorial.title[0].toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyColor[tutorial.difficulty]}`}>
                            {difficultyLabel[tutorial.difficulty]}
                          </span>
                          {tutorial.tags.slice(0, 1).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-accent/15 text-accent text-xs rounded-full">{tag}</span>
                          ))}
                        </div>
                        <h3 className="text-base font-bold text-tertiary mb-2 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                          {tutorial.title}
                        </h3>
                        <p className="text-tertiary/55 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-tertiary/35 pt-3 border-t border-accent/10">
                          {tutorial.estimatedTime ? (
                            <span className="flex items-center gap-1.5"><FiClock size={11} />{tutorial.estimatedTime} min</span>
                          ) : <span />}
                          {tutorial.series && (
                            <span className="text-accent/60 truncate max-w-[120px]">{tutorial.series.title}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
