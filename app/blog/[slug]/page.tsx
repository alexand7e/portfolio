import { prisma } from '@/lib/prisma';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  const post = await prisma.blog.findFirst({
    where: { slug, published: true },
  });
  if (!post) return null;

  const processed = await remark().use(remarkHtml).process(post.content);
  return { ...post, contentHtml: processed.toString() };
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blog.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await prisma.blog.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, tags: true, publishedAt: true, coverImage: true, coverUrl: true },
  });

  if (!post) return { title: 'Post não encontrado' };

  const cover = post.coverImage || post.coverUrl || undefined;

  return {
    title: `${post.title} - Alexandre Barros`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: ['Alexandre Barros'],
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) notFound();

  const date = post.publishedAt ?? post.createdAt;
  const readTimeLabel = post.readTime ? `${post.readTime} min de leitura` : 'Leitura rápida';
  const cover = post.coverImage || post.coverUrl || null;

  return (
    <main className="min-h-screen bg-primary">

      {/* Top nav */}
      <div className="bg-secondary/80 backdrop-blur border-b border-accent/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors text-sm"
          >
            <FiArrowLeft size={14} />
            Voltar ao blog
          </Link>
        </div>
      </div>

      {/* Hero image */}
      {cover && (
        <div className="w-full max-h-[480px] overflow-hidden">
          <img
            src={cover}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ maxHeight: '480px' }}
          />
        </div>
      )}

      {/* Article header */}
      <div className={`bg-secondary border-b border-accent/20 ${!cover ? 'pt-10' : ''}`}>
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-accent/15 text-accent text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-tertiary/60 mb-7 leading-relaxed max-w-2xl">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-tertiary/40 pb-2">
            <span className="flex items-center gap-2">
              <FiUser size={14} />
              Alexandre Barros
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar size={14} />
              {format(new Date(date), 'dd MMMM yyyy', { locale: ptBR })}
            </span>
            <span className="flex items-center gap-2">
              <FiClock size={14} />
              {readTimeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
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
            prose-blockquote:border-l-accent prose-blockquote:text-tertiary/60 prose-blockquote:bg-secondary/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
            prose-img:rounded-xl prose-img:border prose-img:border-accent/20
            prose-ul:text-tertiary/80 prose-ol:text-tertiary/80
            prose-li:text-tertiary/80
            prose-hr:border-accent/20
          "
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-tertiary/40">Escrito por</p>
            <p className="font-semibold text-tertiary">Alexandre Barros</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/30 rounded-lg text-accent text-sm font-medium hover:border-accent hover:bg-accent/5 transition-all"
          >
            <FiArrowLeft size={14} />
            Ver todos os artigos
          </Link>
        </div>
      </div>
    </main>
  );
}
