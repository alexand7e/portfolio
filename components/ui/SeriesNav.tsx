import Link from 'next/link'
import { FiArrowLeft, FiArrowRight, FiList } from 'react-icons/fi'

interface SeriesItem {
  slug: string
  title: string
  seriesOrder: number | null
}

interface SeriesData {
  title: string
  slug: string
  tutorials: SeriesItem[]
}

interface Props {
  series: SeriesData
  currentSlug: string
  type: 'tutorial' | 'blog'
  showPrevNext?: boolean
}

export default function SeriesNav({ series, currentSlug, type, showPrevNext = false }: Props) {
  const base = type === 'tutorial' ? '/tutoriais' : '/blog'
  const items = series.tutorials
  const currentIndex = items.findIndex((i) => i.slug === currentSlug)
  const prev = currentIndex > 0 ? items[currentIndex - 1] : null
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  if (showPrevNext) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        {prev ? (
          <Link
            href={`${base}/${prev.slug}`}
            className="flex-1 group bg-secondary border border-accent/20 rounded-xl p-5 hover:border-accent/50 transition-all"
          >
            <div className="flex items-center gap-2 text-tertiary/40 text-xs mb-2">
              <FiArrowLeft size={12} />
              Anterior
            </div>
            <p className="text-sm font-semibold text-tertiary group-hover:text-accent transition-colors line-clamp-2">
              {prev.title}
            </p>
          </Link>
        ) : <div className="flex-1" />}

        {next ? (
          <Link
            href={`${base}/${next.slug}`}
            className="flex-1 group bg-secondary border border-accent/20 rounded-xl p-5 hover:border-accent/50 transition-all text-right"
          >
            <div className="flex items-center justify-end gap-2 text-tertiary/40 text-xs mb-2">
              Próximo
              <FiArrowRight size={12} />
            </div>
            <p className="text-sm font-semibold text-tertiary group-hover:text-accent transition-colors line-clamp-2">
              {next.title}
            </p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    )
  }

  return (
    <div className="bg-secondary border border-accent/20 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-accent/10 flex items-center gap-2">
        <FiList size={15} className="text-accent" />
        <span className="text-sm font-semibold text-tertiary">
          Série: {series.title}
        </span>
        <span className="text-xs text-tertiary/40 ml-auto">
          {currentIndex + 1} / {items.length}
        </span>
      </div>
      <ol className="divide-y divide-accent/10">
        {items.map((item, i) => {
          const isCurrent = item.slug === currentSlug
          return (
            <li key={item.slug}>
              {isCurrent ? (
                <div className="flex items-center gap-3 px-5 py-3 bg-accent/10">
                  <span className="text-xs font-bold text-accent w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm font-semibold text-accent line-clamp-1">{item.title}</span>
                </div>
              ) : (
                <Link
                  href={`${base}/${item.slug}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-accent/5 transition-colors group"
                >
                  <span className="text-xs text-tertiary/30 w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm text-tertiary/60 group-hover:text-tertiary line-clamp-1 transition-colors">
                    {item.title}
                  </span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
