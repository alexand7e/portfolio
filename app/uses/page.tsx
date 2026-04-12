import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi'
import { Metadata } from 'next'
import { SubpageSideNav } from '@/components/ui/SubpageSideNav'

export const metadata: Metadata = {
  title: '/uses',
  description:
    'Ferramentas, hardware, software e recursos que Alexandre Barros (SIA, UFPI) usa no dia a dia para trabalhar com dados, IA e desenvolvimento.',
  keywords: [
    'uses', 'ferramentas', 'setup', 'Alexandre Barros', 'alexandre barros sia',
    'data science tools', 'desenvolvimento', 'produtividade',
  ],
  alternates: { canonical: 'https://alexand7e.dev.br/uses' },
  openGraph: {
    title: '/uses — Alexandre Barros',
    description: 'Ferramentas e recursos que uso no dia a dia.',
    url: 'https://alexand7e.dev.br/uses',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

export default async function UsesPage() {
  const items = await prisma.useItem.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  })

  const grouped = items.reduce(
    (acc, item) => {
      const cat = item.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, typeof items>
  )

  const categories = Object.keys(grouped).sort()

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
          <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">/uses</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-4 leading-tight">
            O que eu uso
          </h1>
          <p className="text-tertiary/60 text-lg leading-relaxed">
            Ferramentas, hardware e recursos do meu setup de trabalho com dados,
            IA e desenvolvimento. Sem afiliados, sem hype.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-14">
        {categories.length === 0 && (
          <div className="text-center py-16 text-tertiary/40">
            <p>Conteúdo sendo preparado. Volte em breve!</p>
          </div>
        )}

        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-6 flex items-center gap-3">
              {category}
              <span className="flex-1 h-px bg-accent/20" />
            </h2>
            <div className="space-y-4">
              {grouped[category].map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary border border-accent/20 rounded-xl p-5 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-tertiary mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-tertiary/60 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-accent/60 hover:text-accent transition-colors mt-0.5"
                        title="Visitar"
                      >
                        <FiExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="pt-8 border-t border-accent/10 text-center">
          <p className="text-tertiary/30 text-sm">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  )
}
