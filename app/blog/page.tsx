import { getSortedPostsData, BlogPostMeta } from '@/lib/markdown';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { FiCalendar, FiClock, FiUser, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Alexandre Barros',
  description: 'Artigos sobre tecnologia, ciência de dados e desenvolvimento web',
};

// Forçar revalidação a cada 60 segundos
export const revalidate = 60;

export default async function BlogPage() {
  let posts: BlogPostMeta[] = [];
  try {
    posts = getSortedPostsData();
  } catch (error) {
    console.error('Error loading posts:', error);
    posts = [];
  }

  return (
    <main className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-secondary border-b border-accent/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
          >
            <FiArrowLeft size={16} />
            Voltar ao portfólio
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-4">
            Blog
          </h1>
          
          <p className="text-xl text-tertiary/80">
            Artigos sobre tecnologia, ciência de dados e desenvolvimento web
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-tertiary mb-6">Post em Destaque</h2>
            <div className="bg-secondary border border-accent rounded-xl p-6 hover:border-accent/70 transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3">
                  <div className="flex items-center gap-4 text-sm text-tertiary/70 mb-3">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={16} />
                      <span>{format(new Date(posts[0].date), 'dd MMM yyyy', { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>{posts[0].readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUser size={16} />
                      <span>{posts[0].author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-tertiary mb-3">
                    {posts[0].title}
                  </h3>
                  
                  <p className="text-tertiary/80 mb-4 line-clamp-3">
                    {posts[0].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {posts[0].tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${posts[0].slug}`}
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold"
                  >
                    Ler artigo completo
                    <FiArrowRight size={16} />
                  </Link>
                </div>
                
                <div className="lg:w-1/3 flex items-center justify-center">
                  <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* All Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, index) => (
            <article
              key={post.slug}
              className="bg-secondary border border-accent/30 rounded-lg p-6 hover:border-accent/70 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4 text-sm text-tertiary/70 mb-3">
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} />
                  <span>{format(new Date(post.date), 'dd MMM yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock size={14} />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-tertiary mb-3 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-tertiary/80 mb-4 line-clamp-3">
                {post.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-semibold"
              >
                Ler mais
                <FiArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
        
        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-tertiary mb-2">Nenhum artigo ainda</h3>
            <p className="text-tertiary/70">
              Em breve publicarei artigos sobre tecnologia e desenvolvimento.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
