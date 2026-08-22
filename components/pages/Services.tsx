"use client";
import React from "react";
import SiaContainer from "@/components/ui/SiaContainer";
import ColumnGrid from "@/components/ui/ColumnGrid";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";
import { FiDatabase, FiCpu, FiCode, FiCloud } from "react-icons/fi";

export default function Services() {
  const { language } = useLanguage();

  const items = [
    {
      icon: <FiDatabase size={22} />,
      title: language === "en" ? "Data Engineering" : "Engenharia de Dados",
      text: language === "en"
        ? "Pipelines, ETL and data architecture for reliable decisions."
        : "Pipelines, ETL e arquitetura de dados para decisões confiáveis.",
    },
    {
      icon: <FiCpu size={22} />,
      title: language === "en" ? "AI & Machine Learning" : "IA & Machine Learning",
      text: language === "en"
        ? "Models and AI solutions for business and government."
        : "Modelos e soluções de IA para negócio e governo.",
    },
    {
      icon: <FiCode size={22} />,
      title: language === "en" ? "Full-Stack Development" : "Desenvolvimento Full-Stack",
      text: language === "en"
        ? "Web and mobile apps with React/Next.js and APIs."
        : "Apps web e mobile com React/Next.js e APIs.",
    },
    {
      icon: <FiCloud size={22} />,
      title: language === "en" ? "DevOps & Cloud" : "DevOps & Cloud",
      text: language === "en"
        ? "CI/CD, containers and cloud infrastructure."
        : "CI/CD, containers e infraestrutura em nuvem.",
    },
  ];

  return (
    <section id="services" className="relative py-16 md:py-20">
      <SiaContainer>
        <ColumnGrid>
          {items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.06}
              className="p-10 md:p-12 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-hairline last:md:border-r-0"
            >
              <span className="text-accent">{item.icon}</span>
              <h3 className="text-base font-bold text-tertiary leading-snug">{item.title}</h3>
              <p className="text-sm text-tertiary/70 leading-relaxed">{item.text}</p>
            </Reveal>
          ))}
        </ColumnGrid>
      </SiaContainer>
    </section>
  );
}
