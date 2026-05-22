'use client'

import { useEffect, useState } from 'react'
import { FiList } from 'react-icons/fi'

export type TocHeading = {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')
  const [hovered, setHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!headings.length) return
    const handleScroll = () => {
      const pos = window.scrollY + 120
      let cur = headings[0]?.id ?? ''
      for (const { id } of headings) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= pos) cur = id
      }
      setActiveId(cur)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length < 2) return null

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      {/*
        Desktop: faixa absolute de largura zero na borda direita do container
        relativo (relative max-w-5xl) do artigo. O conteúdo sticky aparece apenas
        dentro dos limites verticais desse container — nunca sobrepõe hero/título.
        O spacer h-12 compensa o py-12 do container pai, alinhando o primeiro dot
        com o primeiro heading do artigo.
      */}
      <nav
        className="hidden xl:block absolute right-0 top-0 h-full w-0 overflow-visible pointer-events-none"
        aria-label="Navegação do artigo"
      >
        {/* Espaçador = py-12 do container pai */}
        <div aria-hidden className="h-12" />

        <div
          className="sticky top-24 w-56 flex flex-col items-end gap-3 -translate-x-32 pointer-events-auto"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {headings.map(({ id, text, level }) => {
            const isActive = activeId === id
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="group flex items-center gap-3 w-full"
                aria-label={text}
                title={text}
              >
                {/* Label — texto completo, quebra linha, alinhado à direita */}
                <span
                  className={`
                    flex-1 text-right text-[11px] leading-snug
                    transition-all duration-200
                    ${isActive
                      ? 'text-accent font-medium opacity-100'
                      : hovered
                        ? 'text-tertiary/50 opacity-100 group-hover:text-tertiary/80'
                        : 'opacity-0 pointer-events-none'
                    }
                  `}
                >
                  {text}
                </span>

                {/* Dot */}
                <span
                  className={`
                    block rounded-full shrink-0 transition-all duration-200
                    ${level === 2 ? 'w-2.5 h-2.5' : 'w-2 h-2'}
                    ${isActive
                      ? 'bg-accent scale-125 shadow-sm shadow-accent/50'
                      : 'bg-tertiary/30 group-hover:bg-tertiary/60'
                    }
                  `}
                />
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile: botão flutuante + painel dropdown */}
      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        {mobileOpen && (
          <div className="absolute bottom-14 right-0 w-72 bg-secondary/95 backdrop-blur-sm border border-accent/20 rounded-2xl shadow-2xl shadow-black/40 p-4 mb-2 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-tertiary/40 flex items-center gap-1.5 mb-3 pl-3">
              <FiList size={12} />
              Neste artigo
            </p>
            <ul className="space-y-0.5">
              {headings.map(({ id, text, level }) => {
                const isActive = activeId === id
                const pl = level === 2 ? 'pl-3' : level === 3 ? 'pl-6' : 'pl-9'
                return (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={`
                        w-full text-left block py-2 text-xs leading-snug transition-all border-l-2 pr-2 ${pl}
                        ${isActive
                          ? 'border-accent text-accent font-semibold'
                          : 'border-accent/10 text-tertiary/50 hover:text-tertiary/80 hover:border-accent/40'
                        }
                      `}
                    >
                      {text}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary text-sm font-semibold rounded-full shadow-lg shadow-accent/30 hover:bg-accent/90 transition-all active:scale-95"
          aria-label="Navegar entre seções"
        >
          <FiList size={16} />
          Seções
        </button>
      </div>
    </>
  )
}
