import { getPostData, getAllPostSlugs } from '@/lib/markdown';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiClock, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { Metadata } from 'next';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostData(params.slug);
  
  return {
    title: `${post.title} - Alexandre Barros`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostData(params.slug);

  return (
    <main className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-secondary border-b border-accent/30">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
          >
            <FiArrowLeft size={16} />
            Voltar ao blog
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-tertiary/70 mb-4">
            <div className="flex items-center gap-2">
              <FiCalendar size={16} />
              <span>{format(new Date(post.date), 'dd MMMM yyyy', { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock size={16} />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUser size={16} />
              <span>{post.author}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-tertiary/80 mb-6">
            {post.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg prose-invert max-w-none">
          <div 
            className="text-tertiary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-accent/30">
          <div className="text-center">
            <p className="text-tertiary/70 mb-4">
              Gostou do artigo? Compartilhe com outros desenvolvedores!
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold"
            >
              <FiArrowLeft size={16} />
              Ver todos os artigos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
