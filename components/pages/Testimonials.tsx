"use client";
import React, { useEffect, useState } from "react";
import { FiLinkedin, FiMessageSquare, FiCheck } from "react-icons/fi";
import SiaContainer from "@/components/ui/SiaContainer";
import ColumnGrid from "@/components/ui/ColumnGrid";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";

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
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="relative py-16 md:py-20">
      <SiaContainer>
        <ColumnGrid>
          {/* Coluna texto */}
          <Reveal className="md:col-span-2 border-b md:border-b-0 md:border-r border-hairline p-10 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FiMessageSquare size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-accent">
                  {language === "en" ? "Testimonials" : "Depoimentos"}
                </h2>
              </div>
              <p className="text-tertiary/70 leading-relaxed mt-6 max-w-md">
                {language === "en"
                  ? "What colleagues and partners say about working with me."
                  : "O que colegas e parceiros dizem sobre trabalhar comigo."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-10">
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-hairline-strong text-tertiary/80">
                <FiCheck size={12} className="text-accent" />
                {language === "en" ? "Verified experience" : "Experiência verificada"}
              </span>
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-hairline-strong text-tertiary/80">
                <FiLinkedin size={12} className="text-accent" />
                LinkedIn
              </span>
            </div>
          </Reveal>

          {/* Coluna cards */}
          <div className="md:col-span-2 p-10 md:p-12">
            <div className="grid sm:grid-cols-2 gap-4">
              {testimonials.map((t, i) => (
                <Reveal
                  key={t.id}
                  delay={0.08 + i * 0.06}
                  className="flex flex-col gap-3 border border-hairline rounded-lg p-5 hover:border-accent/40 transition-colors"
                >
                  <p className="text-sm text-tertiary/80 leading-relaxed flex-1">
                    &ldquo;{language === "en" && t.textEn ? t.textEn : t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-hairline">
                    {t.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.avatarUrl}
                        alt={t.name}
                        className="w-9 h-9 rounded-full object-cover border border-accent/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                        {t.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-tertiary text-sm">{t.name}</p>
                      <p className="text-tertiary/60 text-xs truncate">
                        {t.role}{t.company ? ` · ${t.company}` : ''}
                      </p>
                    </div>
                    {t.linkedIn && (
                      <a
                        href={t.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tertiary/40 hover:text-accent transition-colors"
                      >
                        <FiLinkedin size={16} />
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </ColumnGrid>
      </SiaContainer>
    </section>
  )
}
