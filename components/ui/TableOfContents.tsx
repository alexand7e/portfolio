'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { FiList } from 'react-icons/fi'

export type TocHeading = {
  id: string
  text: string
  level: number
}

type TocGroup = {
  parent: TocHeading | null
  children: TocHeading[]
}

function groupHeadings(headings: TocHeading[]): TocGroup[] {
  const groups: TocGroup[] = []
  for (const h of headings) {
    if (h.level === 2) {
      groups.push({ parent: h, children: [] })
    } else {
      const last = groups[groups.length - 1]
      if (last && last.parent) last.children.push(h)
      else groups.push({ parent: null, children: [h] })
    }
  }
  return groups
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')
  const [hovered, setHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const activeBtnRef = useRef<HTMLButtonElement | null>(null)

  const groups = useMemo(() => groupHeadings(headings), [headings])

  const activeGroupIndex = useMemo(
    () =>
      groups.findIndex(
        g => g.parent?.id === activeId || g.children.some(c => c.id === activeId),
      ),
    [groups, activeId],
  )

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

      const docHeight =
        (document.documentElement.scrollHeight || 0) - window.innerHeight
      const p =
        docHeight > 0
          ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
          : 0
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  // Auto-scroll the active item into the TOC's own viewport (not the page).
  useEffect(() => {
    const btn = activeBtnRef.current
    const container = scrollRef.current
    if (!btn || !container) return

    const btnBox = btn.getBoundingClientRect()
    const containerBox = container.getBoundingClientRect()
    const offsetWithinContainer =
      btnBox.top - containerBox.top + container.scrollTop
    const visibleTop = container.scrollTop
    const visibleBottom = visibleTop + container.clientHeight
    const pad = 24

    if (offsetWithinContainer < visibleTop + pad) {
      container.scrollTo({
        top: Math.max(0, offsetWithinContainer - pad),
        behavior: 'smooth',
      })
    } else if (offsetWithinContainer + btn.offsetHeight > visibleBottom - pad) {
      container.scrollTo({
        top:
          offsetWithinContainer +
          btn.offsetHeight -
          container.clientHeight +
          pad,
        behavior: 'smooth',
      })
    }
  }, [activeId])

  if (headings.length < 2) return null

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth',
    })
    setMobileOpen(false)
  }

  return (
    <>
      {/*
        Desktop: faixa absolute de largura zero ancorada à borda direita do
        container relativo. O conteúdo sticky aparece dentro dos limites
        verticais do artigo (nunca sobrepõe hero/título). O spacer h-12
        compensa o py-12 do container pai e alinha o primeiro dot com o
        primeiro heading.
      */}
      <nav
        className="hidden xl:block absolute right-0 top-0 h-full w-0 overflow-visible pointer-events-none"
        aria-label="Navegação do artigo"
      >
        <div aria-hidden className="h-12" />

        <div
          className="sticky top-24 w-60 -translate-x-32 2xl:-translate-x-24 pointer-events-auto"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Bloco interno com scroll próprio, sem invadir layout do artigo. */}
          <div
            ref={scrollRef}
            className="
              relative max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain
              pr-3 pl-2 py-2
              [scrollbar-width:thin] [scrollbar-color:theme(colors.tertiary/20)_transparent]
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-thumb]:bg-tertiary/15
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
            "
          >
            {/* Trilha de progresso vertical */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-[7px] top-3 bottom-3 w-px bg-tertiary/10 rounded-full"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-[7px] top-3 w-px bg-gradient-to-b from-accent/80 to-accent rounded-full transition-[height] duration-300 ease-out"
              style={{ height: `calc((100% - 1.5rem) * ${progress / 100})` }}
            />

            <ul className="flex flex-col items-end gap-1.5">
              {groups.map((group, gi) => {
                const isGroupActive = gi === activeGroupIndex
                const showChildren =
                  isGroupActive && group.children.length > 0
                const parent = group.parent

                return (
                  <li
                    key={parent?.id ?? `orphan-${gi}`}
                    className="flex flex-col items-end w-full"
                  >
                    {parent && (
                      <TocItem
                        heading={parent}
                        isActive={parent.id === activeId}
                        labelMode={
                          isGroupActive || hovered
                            ? 'visible'
                            : 'hover-only'
                        }
                        childrenCount={
                          !isGroupActive && group.children.length > 0
                            ? group.children.length
                            : undefined
                        }
                        onClick={() => scrollTo(parent.id)}
                        btnRef={
                          parent.id === activeId ? activeBtnRef : undefined
                        }
                      />
                    )}

                    {/* Filhos: expandem suavemente quando o grupo está ativo. */}
                    <div
                      className={`
                        flex flex-col items-end w-full overflow-hidden
                        transition-[max-height,opacity,margin] duration-300 ease-out
                        ${
                          showChildren || !parent
                            ? 'max-h-[1200px] opacity-100 mt-1'
                            : 'max-h-0 opacity-0 mt-0'
                        }
                      `}
                    >
                      {group.children.map(child => (
                        <TocItem
                          key={child.id}
                          heading={child}
                          isActive={child.id === activeId}
                          labelMode={
                            isGroupActive || hovered
                              ? 'visible'
                              : 'hover-only'
                          }
                          onClick={() => scrollTo(child.id)}
                          btnRef={
                            child.id === activeId ? activeBtnRef : undefined
                          }
                          indent
                        />
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

{/* Mobile: botão flutuante + painel dropdown */}
      <div className="xl:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none">
        <div className="flex justify-end p-6 pointer-events-auto relative">
          {mobileOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-72 max-w-[calc(100vw-3rem)] bg-secondary/95 backdrop-blur-sm border border-accent/20 rounded-2xl shadow-2xl shadow-black/40 p-4 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-tertiary/40 flex items-center gap-1.5 mb-3 pl-3">
                <FiList size={12} />
                Neste artigo
              </p>
              <ul className="space-y-0.5">
                {headings.map(({ id, text, level }) => {
                  const isActive = activeId === id
                  const pl =
                    level === 2 ? 'pl-3' : level === 3 ? 'pl-6' : 'pl-9'
                  return (
                    <li key={id}>
                      <button
                        onClick={() => scrollTo(id)}
                        className={`
                          w-full text-left block py-2 text-xs leading-snug transition-all border-l-2 pr-2 ${pl}
                          ${
                            isActive
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
      </div>
    </>
  )
}

function TocItem({
  heading,
  isActive,
  labelMode,
  childrenCount,
  onClick,
  btnRef,
  indent,
}: {
  heading: TocHeading
  isActive: boolean
  labelMode: 'visible' | 'hover-only'
  childrenCount?: number
  onClick: () => void
  btnRef?: React.RefObject<HTMLButtonElement>
  indent?: boolean
}) {
  const showLabel = isActive || labelMode === 'visible'

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`group flex items-center gap-2.5 w-full py-0.5 ${
        indent ? 'pr-0' : ''
      }`}
      aria-label={heading.text}
      aria-current={isActive ? 'location' : undefined}
      title={heading.text}
    >
      <span
        className={`
          flex-1 text-right text-[11px] leading-snug transition-all duration-200
          ${indent ? 'text-[10.5px]' : ''}
          ${
            isActive
              ? 'text-accent font-medium opacity-100'
              : showLabel
                ? 'text-tertiary/55 opacity-100 group-hover:text-tertiary/85'
                : 'opacity-0 pointer-events-none'
          }
        `}
      >
        {heading.text}
        {childrenCount ? (
          <span className="ml-1.5 text-tertiary/30 tabular-nums">
            ({childrenCount})
          </span>
        ) : null}
      </span>

      <span
        className={`
          block shrink-0 rounded-full transition-all duration-200
          ${
            heading.level === 2
              ? 'w-2.5 h-2.5'
              : heading.level === 3
                ? 'w-1.5 h-1.5'
                : 'w-1 h-1'
          }
          ${
            isActive
              ? 'bg-accent scale-125 shadow-sm shadow-accent/50 ring-2 ring-accent/20'
              : heading.level === 2
                ? 'bg-tertiary/40 group-hover:bg-tertiary/70'
                : 'bg-tertiary/25 group-hover:bg-tertiary/55'
          }
        `}
      />
    </button>
  )
}
