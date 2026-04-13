import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FiArrowLeft, FiFileText, FiBook, FiTag } from 'react-icons/fi'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Props {
  params: { tag: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `#${tag}`,
    description: `Posts, tutoriais e conteúdo com a tag "${tag}" por Alexandre Barros (SIA-PI, UFPI).`,
    alternates: { canonical: `https://alexand7e.dev.br/tags/${tag}` },
  }
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag)

  const [posts, tutorials] = await Promise.all([
    prisma.blog.findMany({
      where: { published: true, tags: { has: tag } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, description: true, tags: true, readTime: true },
    }),
    prisma.tutorial.findMany({
      where: { published: true, tags: { has: tag } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, description: true, tags: true, difficulty: true, estimatedTime: true },
    }),
  ])

  const total = posts.length + tutorials.length
  if (total === 0) notFound()

  const difficultyColor: Record<string, string> = {
    BEGINNER: 'bg-green-500/15 text-green-400',
    INTERMEDIATE: 'bg-yellow-500/15 text-yellow-400',
    ADVANCED: 'bg-red-500/15 text-red-400',
  }
  const difficultyLabel: Record<string, string> = {
    BEGINNER: 'Iniciante',
    INTERMEDIATE: 'Intermediário',
    ADVANCED: 'Avançado',
  }

  return (
    <main className="min-h-screen bg-primary">
      <div className="bg-secondary border-b border-accent/20">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors mb-8 text-sm">
            <FiArrowLeft size={14} />
            Blog
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <FiTag size={20} className="text-accent" />
            <span className="text-xs font-bold tracking-widest text-accent uppercase">Tag</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-2 tracking-tight">
            #{tag}
          </h1>
          <p className="text-tertiary/50 text-sm">{total} resultado{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {posts.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent/70 mb-6 flex items-center gap-2">
              <FiFileText size={13} />
              Posts do Blog
            </h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-secondary border border-accent/20 rounded-xl p-5 hover:border-accent/50 transition-all">
                    <h3 className="font-bold text-tertiary group-hover:text-accent transition-colors mb-1.5">{post.title}</h3>
                    <p className="text-sm text-tertiary/55 line-clamp-2 mb-3">{post.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((t) => (
                        <span key={t} className={`px-2 py-0.5 text-xs rounded-full ${t === tag ? 'bg-accent/20 text-accent font-medium' : 'bg-accent/10 text-accent/70'}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {tutorials.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent/70 mb-6 flex items-center gap-2">
              <FiBook size={13} />
              Tutoriais
            </h2>
            <div className="space-y-4">
              {tutorials.map((tutorial) => (
                <Link key={tutorial.slug} href={`/tutoriais/${tutorial.slug}`} className="group block">
                  <div className="bg-secondary border border-accent/20 rounded-xl p-5 hover:border-accent/50 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${difficultyColor[tutorial.difficulty]}`}>
                        {difficultyLabel[tutorial.difficulty]}
                      </span>
                    </div>
                    <h3 className="font-bold text-tertiary group-hover:text-accent transition-colors mb-1.5">{tutorial.title}</h3>
                    <p className="text-sm text-tertiary/55 line-clamp-2 mb-3">{tutorial.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tutorial.tags.map((t) => (
                        <span key={t} className={`px-2 py-0.5 text-xs rounded-full ${t === tag ? 'bg-accent/20 text-accent font-medium' : 'bg-accent/10 text-accent/70'}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
