import { prisma } from '@/lib/prisma';

type BlogPost = Awaited<ReturnType<typeof prisma.blog.findMany>>[number];
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { FiCalendar, FiClock, FiArrowRight, FiArrowLeft, FiTag } from 'react-icons/fi';
import { Metadata } from 'next';
import { SubpageLayout } from '@/components/ui/SubpageLayout';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos sobre tecnologia, ciência de dados e desenvolvimento web',
  alternates: {
    canonical: 'https://alexand7e.dev.br/blog',
  },
  openGraph: {
    title: 'Blog | Alexandre Barros',
    description: 'Artigos sobre tecnologia, ciência de dados e desenvolvimento web',
    type: 'website',
    url: 'https://alexand7e.dev.br/blog',
  },
};

export const dynamic = 'force-dynamic';

function getCoverImage(post: BlogPost): string | null {
  return post.coverImage || post.coverUrl || null;
}

function formatReadTime(minutes: number | null): string {
  if (!minutes) return 'Leitura rápida';
  return `${minutes} min`;
}

function PostDate({ date }: { date: Date | null }) {
  if (!date) return null;
  return (
    <span>{format(new Date(date), 'dd MMM yyyy', { locale: ptBR })}</span>
  );
}

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  const featured = posts[0] ?? null;
  const rest = posts.slice(1) as BlogPost[];

  return (
    <SubpageLayout>
      {/* Header */}
      <div className="bg-secondary border-b border-accent/20">
        <div className="px-6 lg:px-10 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors mb-8 text-sm"
          >
            <FiArrowLeft size={14} />
            Voltar ao portfólio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-3 tracking-tight">
            Blog
          </h1>
          <p className="text-tertiary/60 text-lg">
            Artigos sobre tecnologia, ciência de dados e desenvolvimento web
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-12">

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <FiTag size={24} className="text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-tertiary mb-2">Nenhum artigo ainda</h3>
            <p className="text-tertiary/50">Em breve publicarei artigos sobre tecnologia e desenvolvimento.</p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <section className="mb-14">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">
              Destaque
            </span>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="bg-secondary border border-accent/20 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5">
                <div className="flex flex-col lg:flex-row">
                  {/* Cover image */}
                  <div className="lg:w-1/2 relative">
                    {getCoverImage(featured) ? (
                      <div className="aspect-[16/9] lg:aspect-auto lg:h-full min-h-[240px] overflow-hidden">
                        <img
                          src={getCoverImage(featured)!}
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

                  {/* Content */}
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featured.tags.slice(0, 3).map((tag: string) => (
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
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={12} />
                        <PostDate date={featured.publishedAt ?? featured.createdAt} />
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock size={12} />
                        {formatReadTime(featured.readTime)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                      Ler artigo
                      <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Posts grid */}
        {rest.length > 0 && (
          <section>
            <span className="text-xs font-semibold tracking-widest text-accent/60 uppercase mb-6 block">
              Mais artigos
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post: BlogPost) => {
                const cover = getCoverImage(post);
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article className="bg-secondary border border-accent/20 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 h-full flex flex-col">
                      {/* Card image */}
                      <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
                        {cover ? (
                          <img
                            src={cover}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent/15 via-accent/5 to-transparent flex items-center justify-center">
                            <span className="text-4xl font-bold text-accent/20 select-none">
                              {post.title[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-accent/15 text-accent text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-base font-bold text-tertiary mb-2 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-tertiary/55 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                          {post.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-tertiary/35 pt-3 border-t border-accent/10">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar size={11} />
                            <PostDate date={post.publishedAt ?? post.createdAt} />
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiClock size={11} />
                            {formatReadTime(post.readTime)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </SubpageLayout>
  );
}
