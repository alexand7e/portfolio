import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FiArrowLeft, FiCalendar, FiMapPin, FiVideo, FiFileText } from 'react-icons/fi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Metadata } from 'next'
import { SubpageSideNav } from '@/components/ui/SubpageSideNav'

export const metadata: Metadata = {
  title: 'Talks',
  description:
    'Palestras, apresentações e aparições públicas de Alexandre Barros sobre inteligência artificial, dados e tecnologia — SIA-PI, UFPI e eventos de tecnologia.',
  keywords: [
    'palestras', 'talks', 'Alexandre Barros', 'alexandre barros sia',
    'alexandre barros ufpi', 'inteligência artificial piauí', 'SIA',
    'apresentações IA', 'eventos data science',
  ],
  alternates: { canonical: 'https://alexand7e.dev.br/talks' },
  openGraph: {
    title: 'Palestras — Alexandre Barros',
    description: 'Palestras e apresentações sobre IA e dados.',
    url: 'https://alexand7e.dev.br/talks',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

export default async function TalksPage() {
  const talks = await prisma.talk.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  })

  const upcoming = talks.filter((t) => new Date(t.date) >= new Date())
  const past = talks.filter((t) => new Date(t.date) < new Date())

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
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-3 tracking-tight">
            Palestras & Talks
          </h1>
          <p className="text-tertiary/60 text-lg">
            Apresentações sobre IA, dados e transformação digital no setor público
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {talks.length === 0 && (
          <div className="text-center py-16 text-tertiary/40">
            <p>Nenhuma palestra registrada ainda.</p>
          </div>
        )}

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-6 flex items-center gap-3">
              Próximas
              <span className="flex-1 h-px bg-accent/20" />
            </h2>
            <TalkList talks={upcoming} />
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent/60 mb-6 flex items-center gap-3">
              Anteriores
              <span className="flex-1 h-px bg-accent/10" />
            </h2>
            <TalkList talks={past} muted />
          </section>
        )}
      </div>
    </main>
  )
}

function TalkList({ talks, muted = false }: { talks: Awaited<ReturnType<typeof prisma.talk.findMany>>, muted?: boolean }) {
  return (
    <div className="space-y-5">
      {talks.map((talk) => (
        <div
          key={talk.id}
          className={`bg-secondary border ${muted ? 'border-accent/10' : 'border-accent/20'} rounded-xl p-6 hover:border-accent/40 transition-colors`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Date badge */}
            <div className="shrink-0 bg-accent/10 rounded-lg px-4 py-3 text-center min-w-[72px]">
              <p className="text-accent text-xl font-bold leading-none">
                {format(new Date(talk.date), 'dd', { locale: ptBR })}
              </p>
              <p className="text-accent/70 text-xs uppercase mt-1">
                {format(new Date(talk.date), 'MMM yyyy', { locale: ptBR })}
              </p>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-tertiary mb-1">{talk.title}</h3>
              <p className="text-sm font-medium text-accent/80 mb-2">{talk.event}</p>

              {talk.description && (
                <p className="text-sm text-tertiary/60 leading-relaxed mb-4">{talk.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-tertiary/40">
                {talk.location && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin size={12} />
                    {talk.location}
                  </span>
                )}
                {talk.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent rounded-full">{tag}</span>
                ))}
              </div>

              {(talk.slidesUrl || talk.videoUrl) && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {talk.slidesUrl && (
                    <a
                      href={talk.slidesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
                    >
                      <FiFileText size={13} />
                      Slides
                    </a>
                  )}
                  {talk.videoUrl && (
                    <a
                      href={talk.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
                    >
                      <FiVideo size={13} />
                      Vídeo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
