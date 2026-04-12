'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { FiSearch, FiX, FiFileText, FiBook, FiMic } from 'react-icons/fi'

interface SearchResult {
  type: 'blog' | 'tutorial' | 'talk'
  href: string
  title: string
  description: string
  tags: string[]
}

const typeIcon = {
  blog: <FiFileText size={14} />,
  tutorial: <FiBook size={14} />,
  talk: <FiMic size={14} />,
}

const typeLabel = {
  blog: 'Blog',
  tutorial: 'Tutorial',
  talk: 'Talk',
}

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else { setQuery(''); setResults([]) }
  }, [open])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 border border-accent/20 rounded-lg text-tertiary/50 text-sm hover:border-accent/50 hover:text-tertiary/80 transition-all"
        title="Buscar (Ctrl+K)"
      >
        <FiSearch size={14} />
        <span className="hidden sm:inline">Buscar</span>
        <kbd className="hidden sm:inline text-xs bg-primary/60 border border-accent/10 rounded px-1.5 py-0.5 ml-1">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-secondary border border-accent/30 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-accent/10">
          <FiSearch size={18} className="text-accent shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar posts, tutoriais, talks..."
            className="flex-1 bg-transparent text-tertiary placeholder-tertiary/30 focus:outline-none text-sm"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin shrink-0" />
          )}
          <button onClick={() => setOpen(false)} className="text-tertiary/40 hover:text-tertiary transition-colors">
            <FiX size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && query.length >= 2 && !loading && (
            <div className="px-5 py-8 text-center text-tertiary/40 text-sm">
              Nenhum resultado para &ldquo;{query}&rdquo;
            </div>
          )}

          {query.length < 2 && (
            <div className="px-5 py-8 text-center text-tertiary/30 text-sm">
              Digite para buscar em posts, tutoriais e talks
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2">
              {results.map((result, i) => (
                <li key={i}>
                  <Link
                    href={result.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-5 py-3 hover:bg-accent/10 transition-colors group"
                  >
                    <span className="text-accent/60 mt-0.5 shrink-0">{typeIcon[result.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-accent/60 uppercase tracking-wide">{typeLabel[result.type]}</span>
                      </div>
                      <p className="text-sm font-semibold text-tertiary group-hover:text-accent transition-colors line-clamp-1">
                        {result.title}
                      </p>
                      {result.description && (
                        <p className="text-xs text-tertiary/50 line-clamp-1 mt-0.5">{result.description}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-accent/10 flex items-center gap-4 text-xs text-tertiary/30">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span>Esc fechar</span>
        </div>
      </div>
    </div>
  )
}
