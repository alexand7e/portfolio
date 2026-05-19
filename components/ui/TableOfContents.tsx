'use client'

import { useEffect, useState } from 'react'
import { FiList, FiX } from 'react-icons/fi'

export type TocHeading = {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const offset = 100
      const scrollPos = window.scrollY + offset
      let current = headings[0]?.id ?? ''
      for (const { id } of headings) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) current = id
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length < 2) return null

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
    setMobileOpen(false)
  }

  const NavList = () => (
    <ul className="space-y-0.5">
      {headings.map(({ id, text, level }) => {
        const isActive = activeId === id
        const pl = level === 2 ? 'pl-3' : level === 3 ? 'pl-6' : 'pl-9'
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(id) }}
              className={`
                block py-1.5 text-xs leading-snug transition-all border-l-2 ${pl}
                ${isActive
                  ? 'border-accent text-accent font-medium'
                  : 'border-accent/10 text-tertiary/45 hover:text-tertiary/75 hover:border-accent/35'}
              `}
            >
              {text}
            </a>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Desktop sticky sidebar — segue o scroll, posicionado no meio do viewport */}
      <nav className="hidden xl:block sticky top-[35vh] w-64">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-tertiary/30 mb-4 pl-3">
          <FiList size={11} />
          Neste artigo
        </p>
        <NavList />
      </nav>

      {/* Mobile: floating button + dropdown panel */}
      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        {mobileOpen && (
          <div className="absolute bottom-14 right-0 w-72 bg-secondary border border-accent/20 rounded-xl shadow-2xl shadow-black/30 p-4 mb-2 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pl-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-tertiary/30">
                Neste artigo
              </p>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-tertiary/40 hover:text-tertiary/70 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>
            <NavList />
          </div>
        )}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary text-sm font-medium rounded-full shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all active:scale-95"
          aria-label="Navegar entre seções"
        >
          <FiList size={14} />
          Seções
        </button>
      </div>
    </>
  )
}
