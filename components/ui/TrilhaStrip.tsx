"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/useLanguage";
import SiaContainer from "@/components/ui/SiaContainer";
import Reveal from "@/components/animations/Reveal";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiPause,
  FiPlay,
} from "react-icons/fi";

export type TrilhaItem = {
  slug: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  event: string;
  eventEn: string | null;
  date: string;
  tags: string[];
  slidesUrl: string | null;
  repos: string[];
  hasPreview: boolean;
};

type Totals = { talks: number; events: number; repos: number };

const DRIFT_PX_PER_SEC = 16;

// github.com/dono/nome -> "nome"; com /tree/branch -> "nome@branch"
function repoLabel(url: string) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const name = parts[1] ?? url;
    const branch = parts[2] === "tree" ? parts.slice(3).join("/") : null;
    return branch ? `${name}@${branch}` : name;
  } catch {
    return url;
  }
}

export default function TrilhaStrip({
  id,
  items,
  totals,
}: {
  id?: string;
  items: TrilhaItem[];
  totals: Totals;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const reduce = useReducedMotion();

  const scroller = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [stopped, setStopped] = useState(false);
  const [engaged, setEngaged] = useState(false);
  // Preview que o Google recusar (arquivo restrito) sai de cena e o card
  // volta a ser so texto, sem moldura quebrada.
  const [semPreview, setSemPreview] = useState<string[]>([]);

  // Os temas vem das tags reais, pelos mais frequentes — nada fixo no codigo.
  const topics = useMemo(() => {
    const freq = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) freq.set(tag, (freq.get(tag) ?? 0) + 1);
    }
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [items]);

  const shown = useMemo(
    () => (topic ? items.filter((i) => i.tags.includes(topic)) : items),
    [items, topic]
  );

  // Deriva lenta: para no hover, no foco, no toque e quando o visitante
  // pausa. Tambem nao roda sob prefers-reduced-motion.
  const drifting = !reduce && !stopped && !engaged;

  useEffect(() => {
    if (!drifting) return;
    const el = scroller.current;
    if (!el) return;

    let frame = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const elapsed = (now - previous) / 1000;
      previous = now;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 1) {
        const next = el.scrollLeft + DRIFT_PX_PER_SEC * elapsed;
        el.scrollLeft = next >= max ? 0 : next;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [drifting]);

  const nudge = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(en ? "en-US" : "pt-BR", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <section id={id} className="relative py-16 md:py-20">
      <SiaContainer>
        <div className="flex flex-col gap-6 px-10 md:px-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-widest text-accent/80">
                  {en ? "Teaching" : "Aulas & Palestras"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-tertiary leading-snug">
                  {en ? "What I teach, and where" : "O que eu ensino, e onde"}
                </h2>
              </div>

              <dl className="flex items-center gap-6 text-tertiary/60">
                {[
                  { n: totals.talks, l: en ? "classes" : "aulas" },
                  { n: totals.events, l: en ? "events" : "eventos" },
                  { n: totals.repos, l: en ? "repos" : "repositórios" },
                ].map((s) => (
                  <div key={s.l} className="flex flex-col">
                    <dt className="sr-only">{s.l}</dt>
                    <dd className="text-accent text-xl md:text-2xl font-bold">{s.n}</dd>
                    <span className="text-[11px] uppercase tracking-widest">{s.l}</span>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Filtro por tema + controles da faixa */}
          <Reveal delay={0.06}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={en ? "Filter by topic" : "Filtrar por tema"}
              >
                <FilterChip
                  active={topic === null}
                  onClick={() => setTopic(null)}
                  label={en ? "All" : "Todos"}
                />
                {topics.map((tag) => (
                  <FilterChip
                    key={tag}
                    active={topic === tag}
                    onClick={() => setTopic(topic === tag ? null : tag)}
                    label={tag}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-tertiary/60">
                {!reduce && (
                  <button
                    type="button"
                    onClick={() => setStopped((v) => !v)}
                    aria-pressed={stopped}
                    className="p-2 rounded-full border border-hairline hover:border-accent hover:text-accent transition-colors"
                    aria-label={
                      stopped
                        ? en ? "Resume movement" : "Retomar movimento"
                        : en ? "Pause movement" : "Pausar movimento"
                    }
                  >
                    {stopped ? <FiPlay size={14} /> : <FiPause size={14} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => nudge(-1)}
                  className="p-2 rounded-full border border-hairline hover:border-accent hover:text-accent transition-colors"
                  aria-label={en ? "Previous" : "Anterior"}
                >
                  <FiChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => nudge(1)}
                  className="p-2 rounded-full border border-hairline hover:border-accent hover:text-accent transition-colors"
                  aria-label={en ? "Next" : "Próximo"}
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* A faixa sangra ate a borda: e ela que da a largura da pagina */}
        <div
          ref={scroller}
          tabIndex={0}
          role="region"
          aria-label={en ? "Classes and talks" : "Aulas e palestras"}
          onMouseEnter={() => setEngaged(true)}
          onMouseLeave={() => setEngaged(false)}
          onFocusCapture={() => setEngaged(true)}
          onBlurCapture={() => setEngaged(false)}
          onTouchStart={() => setEngaged(true)}
          className="mt-8 flex gap-px overflow-x-auto scroll-smooth border-y border-hairline bg-hairline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shown.map((item) => (
            <motion.article
              key={item.slug}
              layout={!reduce}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="group relative shrink-0 w-[300px] md:w-[340px] bg-primary flex flex-col p-7"
            >
              {item.hasPreview && !semPreview.includes(item.slug) && (
                <div className="relative w-full aspect-[16/10] mb-4 overflow-hidden border border-hairline bg-secondary">
                  <Image
                    src={`/api/talks/${item.slug}/preview`}
                    alt=""
                    fill
                    sizes="340px"
                    loading="lazy"
                    onError={() => setSemPreview((s) => [...s, item.slug])}
                    className="object-cover object-top grayscale contrast-[1.05] transition-[filter,transform] duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-tertiary/45">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span aria-hidden>·</span>
                <span className="truncate">
                  {en && item.eventEn ? item.eventEn : item.event}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-tertiary leading-snug line-clamp-3">
                <Link
                  href={`/talks#${item.slug}`}
                  className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  {en && item.titleEn ? item.titleEn : item.title}
                </Link>
              </h3>

              {item.description && (
                <p className="mt-2 text-xs text-tertiary/60 leading-relaxed line-clamp-3">
                  {en && item.descriptionEn ? item.descriptionEn : item.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-hairline-strong text-tertiary/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 flex flex-col gap-1.5">
                {item.slidesUrl && (
                  <a
                    href={item.slidesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[11px] text-tertiary/70 hover:text-accent transition-colors"
                  >
                    <FiFileText size={12} className="shrink-0" />
                    <span className="truncate">{en ? "slides" : "apresentação"}</span>
                    <FiExternalLink size={10} className="shrink-0 opacity-50" />
                  </a>
                )}
                {item.repos.map((repo) => (
                  <a
                    key={repo}
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[11px] text-tertiary/70 hover:text-accent transition-colors"
                  >
                    <FiGithub size={12} className="shrink-0" />
                    <span className="truncate font-mono">{repoLabel(repo)}</span>
                    <FiExternalLink size={10} className="shrink-0 opacity-50" />
                  </a>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="px-10 md:px-12 mt-6">
          <Link
            href="/talks"
            className="inline-flex items-center gap-2 text-sm text-tertiary/70 hover:text-accent transition-colors"
          >
            {en ? "See all classes and talks" : "Ver todas as aulas e palestras"}
            <FiArrowRight size={14} />
          </Link>
        </div>
      </SiaContainer>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
        active
          ? "border-accent text-accent bg-accent/5"
          : "border-hairline-strong text-tertiary/70 hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}
