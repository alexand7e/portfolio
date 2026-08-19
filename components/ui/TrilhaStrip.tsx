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
  FiFileText,
  FiMapPin,
  FiPause,
  FiPlay,
  FiVideo,
} from "react-icons/fi";

export type TrilhaItem = {
  slug: string;
  title: string;
  titleEn: string | null;
  event: string;
  eventEn: string | null;
  location: string | null;
  date: string;
  coverImage: string | null;
  tags: string[];
  slidesUrl: string | null;
  videoUrl: string | null;
};

type Totals = { talks: number; events: number; places: number };

// Hosts liberados em next.config.mjs. Capa fora dessa lista passa sem o
// otimizador, que dispensa configuracao e evita quebrar em producao.
const OPTIMIZED_HOSTS = ["github.com", "api.github.com"];

function isOptimizable(src: string) {
  if (!/^https?:\/\//i.test(src)) return true;
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

const DRIFT_PX_PER_SEC = 16;

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
                  {en
                    ? "What I teach, and where"
                    : "O que eu ensino, e onde"}
                </h2>
              </div>

              <dl className="flex items-center gap-6 text-tertiary/60">
                {[
                  { n: totals.talks, l: en ? "aulas" : "aulas" },
                  { n: totals.events, l: en ? "events" : "eventos" },
                  { n: totals.places, l: en ? "cities" : "cidades" },
                ].map((s) => (
                  <div key={s.l} className="flex flex-col">
                    <dt className="sr-only">{s.l}</dt>
                    <dd className="text-accent text-xl md:text-2xl font-bold">
                      {s.n}
                    </dd>
                    <span className="text-[11px] uppercase tracking-widest">
                      {s.l}
                    </span>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Filtro por tema + controles da faixa */}
          <Reveal delay={0.06}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" role="group"
                   aria-label={en ? "Filter by topic" : "Filtrar por tema"}>
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
              className="group relative shrink-0 w-[260px] md:w-[300px] bg-primary"
            >
              <Link
                href={`/talks#${item.slug}`}
                className="flex flex-col h-full p-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden border border-hairline bg-secondary">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt=""
                      fill
                      sizes="300px"
                      unoptimized={!isOptimizable(item.coverImage)}
                      className="object-cover grayscale contrast-[1.05] transition-[filter,transform] duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-tertiary/25 text-[11px] uppercase tracking-widest">
                      {en ? "no photo" : "sem foto"}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 text-[11px] uppercase tracking-widest text-tertiary/50">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  {item.location && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1 truncate">
                        <FiMapPin size={10} />
                        {item.location}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="mt-2 text-sm font-bold text-tertiary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {en && item.titleEn ? item.titleEn : item.title}
                </h3>

                <p className="mt-1 text-xs text-tertiary/60 line-clamp-1">
                  {en && item.eventEn ? item.eventEn : item.event}
                </p>

                <div className="mt-auto pt-4 flex items-center gap-3 text-tertiary/40">
                  {item.slidesUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <FiFileText size={11} />
                      {en ? "slides" : "slides"}
                    </span>
                  )}
                  {item.videoUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <FiVideo size={11} />
                      {en ? "video" : "vídeo"}
                    </span>
                  )}
                </div>
              </Link>
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
