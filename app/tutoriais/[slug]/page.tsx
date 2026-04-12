import { prisma } from '@/lib/prisma'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { FiClock, FiArrowLeft, FiArrowRight, FiTag } from 'react-icons/fi'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import GiscusComments from '@/components/ui/GiscusComments'
import SeriesNav from '@/components/ui/SeriesNav'
import { SubpageSideNav } from '@/components/ui/SubpageSideNav'

interface Props {
  params: { slug: string }
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

async function getTutorial(slug: string) {
  const tutorial = await prisma.tutorial.findFirst({
    where: { slug, published: true },
    include: {
      series: {
        include: {
          tutorials: {
            where: { published: true },
            orderBy: { seriesOrder: 'asc' },
            select: { slug: true, title: true, seriesOrder: true },
          },
        },
      },
    },
  })
  if (!tutorial) return null
  const processed = await remark().use(remarkHtml).process(tutorial.content)
  return { ...tutorial, contentHtml: processed.toString() }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tutorial = await prisma.tutorial.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, tags: true, coverImage: true, coverUrl: true },
  })
  if (!tutorial) return { title: 'Tutorial não encontrado' }

  const cover = tutorial.coverImage || tutorial.coverUrl || undefined
  const baseUrl = 'https://alexand7e.dev.br'

  return {
    title: `${tutorial.title} — Tutoriais`,
    description: tutorial.description,
    keywords: [...tutorial.tags, 'tutorial', 'alexandre barros', 'sia', 'ufpi'],
    alternates: { canonical: `${baseUrl}/tutoriais/${params.slug}` },
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      type: 'article',
      url: `${baseUrl}/tutoriais/${params.slug}`,
      images: cover ? [{ url: cover, width: 1200, height: 630, alt: tutorial.title }] : undefined,
    },
  }
}

export default async function TutorialPage({ params }: Props) {
  const tutorial = await getTutorial(params.slug)
  if (!tutorial) notFound()

  const cover = tutorial.coverImage || tutorial.coverUrl || null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: tutorial.title,
    description: tutorial.description,
    image: cover || 'https://github.com/alexand7e.png',
    author: {
      '@type': 'Person',
      name: 'Alexandre Barros dos Santos',
      url: 'https://alexand7e.dev.br',
    },
    totalTime: tutorial.estimatedTime ? `PT${tutorial.estimatedTime}M` : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-primary lg:pl-40">
        <SubpageSideNav />
        <div className="bg-secondary border-b border-accent/20">
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
            <Link
              href="/tutoriais"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors text-sm"
            >
              <FiArrowLeft size={14} />
              Tutoriais
            </Link>
          </div>
        </div>

        {/* Cover */}
        {cover && (
          <div className="w-full max-h-[440px] overflow-hidden">
            <img src={cover} alt={tutorial.title} className="w-full h-full object-cover" style={{ maxHeight: '440px' }} />
          </div>
        )}

        {/* Header */}
        <div className={`bg-secondary border-b border-accent/20 ${!cover ? 'pt-10' : ''}`}>
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor[tutorial.difficulty]}`}>
                {difficultyLabel[tutorial.difficulty]}
              </span>
              {tutorial.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent/15 text-accent text-xs rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-4 leading-tight">
              {tutorial.title}
            </h1>
            <p className="text-lg text-tertiary/60 mb-7 leading-relaxed max-w-2xl">
              {tutorial.description}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-tertiary/40">
              <span>Alexandre Barros</span>
              {tutorial.estimatedTime && (
                <span className="flex items-center gap-2">
                  <FiClock size={14} />
                  {tutorial.estimatedTime} min
                </span>
              )}
              {tutorial.series && (
                <span className="text-accent/70">
                  Série: {tutorial.series.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Series nav (top) */}
        {tutorial.series && (
          <div className="max-w-5xl mx-auto px-6 pt-8">
            <SeriesNav
              series={tutorial.series}
              currentSlug={tutorial.slug}
              type="tutorial"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <article
            className="
              prose prose-lg max-w-none
              prose-headings:text-tertiary prose-headings:font-bold
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-tertiary/80 prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-tertiary
              prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-secondary prose-pre:border prose-pre:border-accent/20 prose-pre:rounded-xl
              prose-blockquote:border-l-accent prose-blockquote:text-tertiary/60
              prose-img:rounded-xl prose-img:border prose-img:border-accent/20
              prose-ul:text-tertiary/80 prose-ol:text-tertiary/80 prose-li:text-tertiary/80
              prose-hr:border-accent/20
            "
            dangerouslySetInnerHTML={{ __html: tutorial.contentHtml }}
          />

          {/* Series nav (bottom) */}
          {tutorial.series && (
            <div className="mt-12">
              <SeriesNav
                series={tutorial.series}
                currentSlug={tutorial.slug}
                type="tutorial"
                showPrevNext
              />
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-tertiary/40">Escrito por</p>
              <p className="font-semibold text-tertiary">Alexandre Barros</p>
            </div>
            <Link
              href="/tutoriais"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/30 rounded-lg text-accent text-sm font-medium hover:border-accent hover:bg-accent/5 transition-all"
            >
              <FiArrowLeft size={14} />
              Ver todos os tutoriais
            </Link>
          </div>

          {/* Comments */}
          <div className="mt-12">
            <GiscusComments />
          </div>
        </div>
      </main>
    </>
  )
}
