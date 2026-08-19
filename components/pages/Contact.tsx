"use client";
import React from "react";
import SiaContainer from "@/components/ui/SiaContainer";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";
import { FiShield, FiCpu, FiMail, FiArrowRight } from "react-icons/fi";

export default function Contact({
  id
}: {
  id?: string
}) {
  const { t, language } = useLanguage();

  const audiences = [
    {
      icon: <FiShield size={24} />,
      title: language === "en" ? "Public sector & government" : "Setor público & governo",
      text: language === "en"
        ? "AI, data engineering and digital transformation for public institutions."
        : "IA, engenharia de dados e transformação digital para instituições públicas.",
    },
    {
      icon: <FiCpu size={24} />,
      title: language === "en" ? "Startups & dev teams" : "Startups & equipes de dev",
      text: language === "en"
        ? "Full-stack and AI solutions to build and scale products."
        : "Soluções full-stack e de IA para construir e escalar produtos.",
    },
  ];

  return (
    <section id={`${id}`} className="relative py-16 md:py-20">
      <SiaContainer>
        {/* Cabeçalho central */}
        <Reveal className="text-center pb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-accent">{t("contact.title")}</h2>
          <p className="text-tertiary/70 max-w-2xl mx-auto mt-4">
            {t("contact.subtitle")}
          </p>
        </Reveal>

        {/* 2 cards de público */}
        <div className="grid md:grid-cols-2 border-t border-hairline">
          {audiences.map((aud, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              className={`p-10 md:p-12 flex flex-col gap-4 ${i === 0 ? "md:border-r border-b md:border-b-0" : ""} border-hairline`}
            >
              <span className="text-accent">{aud.icon}</span>
              <h3 className="text-lg font-bold text-tertiary">{aud.title}</h3>
              <p className="text-sm text-tertiary/70 leading-relaxed">{aud.text}</p>
              <a
                href="mailto:alexand7e@gmail.com"
                className="group inline-flex items-center gap-2 mt-4 text-sm font-bold text-accent hover:opacity-80 transition-opacity"
              >
                <FiMail size={14} />
                {t("home.contactButton")}
                <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          ))}
        </div>
      </SiaContainer>
    </section>
  )
}
