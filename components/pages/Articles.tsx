"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SiaContainer from "@/components/ui/SiaContainer";
import ColumnGrid from "@/components/ui/ColumnGrid";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";
import { FiEdit3, FiArrowRight } from "react-icons/fi";

interface Post {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  tags: string[];
  readTime: number | null;
}

export default function Articles() {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => setPosts((Array.isArray(data) ? data : []).slice(0, 3)))
      .catch(() => {})
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative py-16 md:py-20">
      <SiaContainer>
        <ColumnGrid>
          {/* Coluna título */}
          <Reveal className="md:col-span-1 border-b md:border-b-0 md:border-r border-hairline p-10 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FiEdit3 size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-accent">{t("blog.title")}</h2>
              </div>
              <p className="text-tertiary/70 leading-relaxed mt-6 text-sm">
                {t("blog.subtitle")}
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mt-10 text-sm text-tertiary/80 hover:text-accent transition-colors"
            >
              {language === "en" ? "View all articles" : "Ver todos os artigos"}
              <FiArrowRight size={14} />
            </Link>
          </Reveal>

          {/* Coluna cards */}
          <div className="md:col-span-3 p-10 md:p-12">
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Reveal
                  key={post.id}
                  delay={0.08 + i * 0.06}
                  className="flex flex-col gap-2 group"
                >
                  <span className="text-[10px] uppercase tracking-widest text-accent/80">
                    {(post.tags && post.tags[0]) || "Post"}
                  </span>
                  <h3 className="text-base font-bold text-tertiary leading-snug group-hover:text-accent transition-colors">
                    {language === "en" && post.titleEn ? post.titleEn : post.title}
                  </h3>
                  <p className="text-xs text-tertiary/70 leading-relaxed line-clamp-3">
                    {language === "en" && post.descriptionEn ? post.descriptionEn : post.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-accent/80 mt-auto pt-2">
                    {language === "en" ? "Read" : "Ler"} <FiArrowRight size={12} />
                  </span>
                  </Reveal>
              ))}
            </div>
          </div>
        </ColumnGrid>
      </SiaContainer>
    </section>
  );
}
