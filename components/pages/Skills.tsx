"use client";
import React from "react";
import SiaContainer from "@/components/ui/SiaContainer";
import ColumnGrid from "@/components/ui/ColumnGrid";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";
import { FiDatabase } from "react-icons/fi";

const skills = [
  {
    category: "Backend & Data Engineering",
    items: ["Python", "Node.js", "PostgreSQL", "Apache Airflow", "Apache Spark", "ETL Pipelines"]
  },
  {
    category: "Frontend & Mobile",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion", "Responsive Design"]
  },
  {
    category: "DevOps & Cloud",
    items: ["Docker", "Kubernetes", "AWS/GCP", "CI/CD", "Nginx", "Git & GitHub"]
  }
];

export default function Skills({
  id
}: {
  id?: string
}) {
  const { t, language } = useLanguage();

  return (
    <section id={`${id}`} className="relative py-16 md:py-20">
      <SiaContainer>
        <ColumnGrid>
          {/* Coluna principal (3/4) */}
          <Reveal className="md:col-span-3 border-b md:border-b-0 md:border-r border-hairline p-10 md:p-12">
            <div className="flex items-center gap-3">
              <FiDatabase size={20} className="text-accent" />
              <h2 className="text-2xl font-bold text-accent">{t("skills.title")}</h2>
            </div>

            <div className="mt-10">
              <span className="text-4xl md:text-5xl font-bold text-accent">18+</span>
              <p className="text-tertiary/70 mt-1">
                {language === "en"
                  ? "technologies across my stack"
                  : "tecnologias no meu stack"}
              </p>
            </div>

            <div className="mt-10 space-y-8">
              {skills.map((group) => (
                <div key={group.category}>
                  <p className="text-xs uppercase tracking-widest text-tertiary/50 mb-3">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-3 py-1.5 rounded-full border border-hairline-strong text-tertiary/80 hover:text-accent hover:border-accent/50 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Coluna secundária (1/4) */}
          <Reveal delay={0.1} className="md:col-span-1 p-10 md:p-12 flex flex-col justify-end gap-6">
            <div>
              <span className="text-3xl md:text-4xl font-bold text-tertiary">4+</span>
              <p className="text-tertiary/70 mt-1 text-sm">
                {language === "en"
                  ? "years working with data & AI in the public and private sectors"
                  : "anos atuando com dados & IA no setor público e privado"}
              </p>
            </div>
            <p className="text-sm text-tertiary/60 leading-relaxed">
              {t("skills.subtitle")}
            </p>
          </Reveal>
        </ColumnGrid>
      </SiaContainer>
    </section>
  )
}
