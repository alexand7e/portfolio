'use client'

import { useEffect, useState } from 'react'
import { FiLinkedin } from 'react-icons/fi'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string | null
  text: string
  textEn: string | null
  avatarUrl: string | null
  linkedIn: string | null
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-accent uppercase">Depoimentos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-tertiary mt-2">
            O que dizem sobre meu trabalho
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-primary border border-accent/20 rounded-xl p-6 flex flex-col gap-4 hover:border-accent/40 transition-colors"
            >
              <p className="text-tertiary/70 leading-relaxed text-sm flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-accent/10">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-accent/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    {t.name[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-tertiary text-sm">{t.name}</p>
                  <p className="text-tertiary/50 text-xs truncate">
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
                {t.linkedIn && (
                  <a
                    href={t.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tertiary/30 hover:text-accent transition-colors"
                  >
                    <FiLinkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
