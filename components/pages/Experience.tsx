"use client";
import React, { useState, useEffect } from "react";
import SiaContainer from "@/components/ui/SiaContainer";
import ColumnGrid from "@/components/ui/ColumnGrid";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";
import { FiBriefcase } from "react-icons/fi";

interface Experience {
  id: string;
  company: string;
  companyEn: string | null;
  position: string;
  positionEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  technologies: string[];
}

interface ExperienceCardData {
  title: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience({
  id
}: {
  id?: string
}) {
  const { language, t } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        if (response.ok) {
          const data: Experience[] = await response.json();

          const transformed: ExperienceCardData[] = data.map((exp) => {
            const startYear = new Date(exp.startDate).getFullYear();
            const endYear = exp.current ? 'Presente' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '');
            const period = exp.current ? `${startYear} - Presente` : `${startYear}${endYear ? ` - ${endYear}` : ''}`;

            return {
              title: language === 'en' && exp.positionEn ? exp.positionEn : exp.position,
              company: language === 'en' && exp.companyEn ? exp.companyEn : exp.company,
              period,
              description: language === 'en' && exp.descriptionEn ? exp.descriptionEn : (exp.description || '')
            };
          });

          setExperiences(transformed);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [language]);

  return (
    <section id={`${id}`} className="relative py-16 md:py-20">
      <SiaContainer>
        <ColumnGrid>
          {/* Coluna título (1/4) */}
          <Reveal className="md:col-span-1 border-b md:border-b-0 md:border-r border-hairline p-10 md:p-12 flex flex-col justify-between min-h-[16rem]">
            <div className="flex items-center gap-3">
              <FiBriefcase size={20} className="text-accent" />
              <h2 className="text-2xl font-bold text-accent">{t("experience.title")}</h2>
            </div>
            <div className="mt-10">
              <p className="text-2xl md:text-3xl font-bold text-tertiary">
                {language === "en" ? "Since" : "Desde"} <span className="text-accent">2022</span>
              </p>
              <p className="text-sm text-tertiary/70 mt-2">
                {language === "en"
                  ? "building with data, AI and full-stack"
                  : "construindo com dados, IA e full-stack"}
              </p>
            </div>
          </Reveal>

          {/* Coluna conteúdo (3/4) */}
          <div className="md:col-span-3 p-10 md:p-12">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />
                ))}
              </div>
            ) : experiences.length === 0 ? (
              <p className="text-tertiary/50 text-sm">—</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {experiences.map((exp, index) => (
                  <Reveal
                    key={index}
                    delay={0.08 + index * 0.06}
                    className="flex flex-col gap-2 border border-hairline rounded-lg p-6"
                  >
                    <span className="text-xs text-accent font-semibold uppercase tracking-widest">
                      {exp.period}
                    </span>
                    <h3 className="text-lg font-bold text-tertiary">{exp.title}</h3>
                    <p className="text-sm text-accent/80">{exp.company}</p>
                    <p className="text-sm text-tertiary/70 leading-relaxed">{exp.description}</p>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </ColumnGrid>
      </SiaContainer>
    </section>
  );
}
