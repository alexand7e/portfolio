import { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import NewsletterForm from './NewsletterForm'
import { SubpageLayout } from '@/components/ui/SubpageLayout'

export const metadata: Metadata = {
  title: 'Newsletter',
  description:
    'Assine a newsletter de Alexandre Barros (SIA-PI) e receba artigos sobre IA, dados e tecnologia pública direto no seu e-mail.',
  keywords: [
    'newsletter', 'Alexandre Barros', 'SIA', 'alexandre barros sia',
    'Secretaria de Inteligência Artificial', 'IA', 'dados', 'data science',
    'tecnologia pública',
  ],
  alternates: { canonical: 'https://alexand7e.dev.br/newsletter' },
  openGraph: {
    title: 'Newsletter — Alexandre Barros',
    description: 'Artigos sobre IA, dados e tecnologia pública direto no e-mail.',
    url: 'https://alexand7e.dev.br/newsletter',
    type: 'website',
  },
}

export default function NewsletterPage() {
  return (
    <SubpageLayout>
      <div className="bg-secondary border-b border-accent/20">
        <div className="px-6 lg:px-10 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/70 transition-colors mb-8 text-sm"
          >
            <FiArrowLeft size={14} />
            Voltar ao início
          </Link>

          <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">
              Newsletter
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-4 leading-tight">
            Dados, IA e<br className="hidden md:block" /> Tecnologia Pública
          </h1>

          <p className="text-tertiary/60 text-lg leading-relaxed max-w-xl">
            Artigos práticos sobre inteligência artificial, engenharia de dados e
            transformação digital — escritos por quem trabalha na{' '}
            <span className="text-accent font-medium">
              Secretaria de Inteligência Artificial do Piauí (SIA)
            </span>
            .
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            {
              icon: '📊',
              title: 'Dados & IA',
              desc: 'Tutoriais, análises e experiências do dia a dia com dados e modelos de linguagem.',
            },
            {
              icon: '🏛️',
              title: 'Tech no Setor Público',
              desc: 'Desafios reais de implementar IA e dados em contextos governamentais.',
            },
            {
              icon: '🛠️',
              title: 'Ferramentas & Stack',
              desc: 'O que estou usando, testando e recomendando — sem hype.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-secondary border border-accent/20 rounded-xl p-6"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-tertiary font-semibold mb-1">{item.title}</h3>
              <p className="text-tertiary/55 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary border border-accent/30 rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-tertiary mb-2">
            Fique por dentro
          </h2>
          <p className="text-tertiary/55 mb-8 text-sm">
            Sem spam. Cancele quando quiser.
          </p>
          <NewsletterForm />
        </div>

        <p className="text-center text-tertiary/30 text-xs mt-8">
          Suas informações nunca serão compartilhadas com terceiros.
        </p>
      </div>
    </SubpageLayout>
  )
}
