import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import ExperienceCard from "@/components/ui/ExperienceCard";
import { useLanguage } from "@/lib/useLanguage";

const experiences = [
  {
    title: "Manager - Inteligência Artificial",
    company: "SIA-PI (Secretaria de Inteligência Artificial)",
    period: "2024 - Presente",
    description: "Liderando iniciativas de IA e estratégia de dados para inovação no setor público. Promovendo a disseminação e uso qualificado de ferramentas de IA em diferentes áreas da gestão pública."
  },
  {
    title: "Co-Founder & CTO",
    company: "Teaser Soluções",
    period: "2024 - Presente",
    description: "Desenvolvendo soluções escaláveis e sistemas de automação para clientes enterprise. Liderando equipes de desenvolvimento e implementando soluções digitais inovadoras."
  },
  {
    title: "Data Engineer & Full-Stack Developer",
    company: "Freelance & Projetos",
    period: "2023 - Presente",
    description: "Arquitetando soluções end-to-end: desde ingestão e processamento de dados (Python/Spark) até workflows automatizados (Airflow) e aplicações para usuários (TypeScript/React)."
  },
  {
    title: "Coordenador de Dados Estratégicos",
    company: "SIA-PI - Governo do Piauí",
    period: "2024",
    description: "Coordenei iniciativas de dados estratégicos para o Estado, desenvolvendo soluções de análise e visualização de dados para tomada de decisão governamental."
  },
  {
    title: "Analista de Dados",
    company: "Servfaz - Serviços de Mão de Obra",
    period: "2023 - 2024",
    description: "Atuei na Superintendência de Transformação Digital da Secretaria de Planejamento do Piauí, realizando análise e consolidação de bases de dados governamentais."
  }
];

export default function Experience({
  ref,
  id
}: {
  ref?: React.Ref<any>
  id?: string
}) {
  const { t } = useLanguage();
  return (
    <DefaultSection
      ref={ref}
      id={`${id}`}
      className={"!bg-primary"}
    >
      <SectionBody>
        <SectionTitle 
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />
        <div className="max-w-4xl mx-auto pb-12">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} index={index} />
          ))}
        </div>
      </SectionBody>
    </DefaultSection>
  )
}