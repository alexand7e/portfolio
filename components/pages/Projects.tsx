import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard";
import { useLanguage } from "@/lib/useLanguage";

const projects = [
  {
    title: "Portfolio Pessoal",
    description: "Portfolio moderno desenvolvido com Next.js 14, TypeScript e Tailwind CSS. Inclui blog integrado, deploy automatizado com GitHub Actions e CI/CD pipeline completo.",
    technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Docker", "CI/CD"],
    github: "https://github.com/alexand7e/portfolio",
    demo: "https://alexand7e.dev.br"
  },
  {
    title: "SIA-PI - Inteligência Artificial",
    description: "Liderança de iniciativas de IA e estratégia de dados para inovação no setor público. Desenvolvimento de soluções de análise e visualização de dados governamentais.",
    technologies: ["Python", "Data Engineering", "AI/ML", "ETL Pipelines", "Apache Airflow", "PostgreSQL"],
    github: "#",
    demo: "#"
  },
  {
    title: "Teaser - Soluções Enterprise",
    description: "Desenvolvimento de soluções escaláveis e sistemas de automação para clientes enterprise. Arquitetura de microserviços e aplicações serverless.",
    technologies: ["Node.js", "TypeScript", "React", "Docker", "Kubernetes", "AWS/GCP"],
    github: "#",
    demo: "#"
  },
  {
    title: "ETL Pipeline - CAGED",
    description: "Pipeline ETL robusto para processamento de microdados do CAGED utilizando Python e Apache Airflow. Análise de dados do mercado de trabalho brasileiro.",
    technologies: ["Python", "Apache Airflow", "PostgreSQL", "ETL", "Data Analysis", "Pandas"],
    github: "https://github.com/alexand7e/Microdados-CAGED",
    demo: "#"
  },
  {
    title: "Dataset-PI - Análise Governamental",
    description: "Compilação e análise de datasets específicos do Estado do Piauí, incluindo indicadores socioeconômicos para pesquisa e tomada de decisão.",
    technologies: ["Python", "Jupyter", "Data Analysis", "Visualization", "PostgreSQL"],
    github: "https://github.com/alexand7e/Dataset-PI",
    demo: "#"
  },
  {
    title: "CI/CD Pipeline",
    description: "Pipeline completo de integração e deploy contínuo configurado com GitHub Actions, Docker e deploy automatizado no servidor.",
    technologies: ["GitHub Actions", "Docker", "CI/CD", "Deploy Automation", "Nginx"],
    github: "https://github.com/alexand7e/portfolio",
    demo: "#"
  }
];

export default function Projects({
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
      className={"!bg-secondary"}
    >
      <SectionBody>
        <SectionTitle 
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </SectionBody>
    </DefaultSection>
  )
}