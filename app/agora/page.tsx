import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { Metadata } from 'next'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { SubpageSideNav } from '@/components/ui/SubpageSideNav'

export const metadata: Metadata = {
  title: '/agora',
  description:
    'O que Alexandre Barros (gerente de IA na SIA-PI, UFPI) está fazendo, lendo e construindo agora mesmo.',
  keywords: [
    'agora', 'now', 'Alexandre Barros', 'alexandre barros sia',
    'gerente de ia sia', 'alexandre barros ufpi', 'SIA Piauí',
  ],
  alternates: { canonical: 'https://alexand7e.dev.br/agora' },
  openGraph: {
    title: '/agora — Alexandre Barros',
    description: 'O que estou fazendo, lendo e construindo agora.',
    url: 'https://alexand7e.dev.br/agora',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

export default async function AgoraPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'now_content' } })
  const rawContent = setting?.value ?? ''
  const updatedAt = await prisma.siteSetting.findUnique({ where: { key: 'now_updated_at' } })

  let contentHtml = ''
  if (rawContent) {
    const processed = await remark().use(remarkHtml).process(rawContent)
    contentHtml = processed.toString()
  }

  return (
    <main className="min-h-screen bg-primary">
      <SubpageSideNav />
      <div className="bg-secondary border-b border-accent/20">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors mb-8 text-sm"
          >
            <FiArrowLeft size={14} />
            Voltar ao início
          </Link>
          <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">/agora</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-4 leading-tight">
            O que estou fazendo
          </h1>
          <p className="text-tertiary/60 text-lg leading-relaxed">
            Uma snapshot do meu momento atual — projetos, leituras e foco.
          </p>
          {updatedAt?.value && (
            <p className="text-tertiary/30 text-sm mt-4">
              Atualizado em {new Date(updatedAt.value).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!contentHtml ? (
          <div className="text-center py-16 text-tertiary/40">
            <p>Conteúdo sendo preparado. Volte em breve!</p>
          </div>
        ) : (
          <article
            className="
              prose prose-lg max-w-none
              prose-headings:text-tertiary prose-headings:font-bold
              prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-tertiary/80 prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-tertiary
              prose-ul:text-tertiary/80 prose-ol:text-tertiary/80 prose-li:text-tertiary/80
              prose-hr:border-accent/20
              prose-blockquote:border-l-accent prose-blockquote:text-tertiary/60
            "
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        )}

        <div className="mt-14 pt-8 border-t border-accent/10 text-center">
          <p className="text-tertiary/30 text-xs">
            Esta página é inspirada no movimento{' '}
            <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-accent/60 hover:text-accent">
              nownownow.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
