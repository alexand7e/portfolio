import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import ExperienceCard from "@/components/ui/ExperienceCard";

const experiences = [
  {
    title: "Gerente de Programas em IA",
    company: "Secretaria de Inteligência Artificial, Economia Digital, Ciência, Tecnologia e Inovação (SIA)",
    period: "Abr 2025 - Presente",
    description: "Lidero e apoio projetos estratégicos para o Estado, promovendo a disseminação e uso qualificado de ferramentas de IA em diferentes áreas da gestão pública. Atuo sob a Diretoria de Desenvolvimento de IA, com interface direta com as Coordenações de Formação em IA, Políticas e Ética, e Popularização da Ciência."
  },
  {
    title: "Coordenador de Dados Estratégicos",
    company: "Secretaria de Inteligência Artificial (SIA) - Governo do Piauí",
    period: "Jun 2024 - Abr 2025",
    description: "Coordenei iniciativas de dados estratégicos para o Estado, desenvolvendo soluções de análise e visualização de dados para tomada de decisão governamental."
  },
  {
    title: "Gerente de Tecnologia",
    company: "Teaser Soluções",
    period: "Out 2024 - Presente",
    description: "Gerenciei projetos de tecnologia e inovação, liderando equipes de desenvolvimento e implementando soluções digitais para clientes."
  },
  {
    title: "Bolsista de Pesquisa",
    company: "Fundação de Amparo à Pesquisa do Estado do Piauí (FAPEPI)",
    period: "Set 2023 - Jan 2025",
    description: "Integrei equipe de pesquisa no estudo de Emprego e Renda no Estado do Piauí, aplicando metodologias de análise de dados e ciência econômica."
  },
  {
    title: "Analista de Dados",
    company: "Servfaz - Serviços de Mão de Obra",
    period: "Jul 2023 - Jun 2024",
    description: "Atuei na Superintendência de Transformação Digital da Secretaria de Planejamento do Piauí, realizando análise e consolidação de bases de dados governamentais."
  },
  {
    title: "Analista de Gestão de Orçamento",
    company: "Governo do Estado do Piauí",
    period: "Fev 2022 - Jul 2023",
    description: "Desenvolvi relatórios de acompanhamento orçamentário legal e interno na Superintendência de Planejamento e Orçamento Estadual, com foco no controle orçamentário."
  }
];

export default function Experience({
  ref,
  id
}: {
  ref?: React.Ref<any>
  id?: string
}) {
  return (
    <DefaultSection
      ref={ref}
      id={`${id}`}
      className={"!bg-primary"}
    >
      <SectionBody>
        <SectionTitle 
          title="Experience"
          subtitle="Minha jornada profissional focada em transformação digital, IA e gestão pública"
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