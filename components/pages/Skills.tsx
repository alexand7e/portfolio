import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillCard from "@/components/ui/SkillCard";

const skills = [
  {
    category: "Ciência de Dados & Análise",
    items: [
      { name: "Python", level: 95 },
      { name: "R", level: 90 },
      { name: "Jupyter Notebook", level: 95 },
      { name: "Pandas & NumPy", level: 90 },
      { name: "Análise Estatística", level: 95 },
      { name: "Econometria", level: 85 },
    ]
  },
  {
    category: "DevOps & Infraestrutura",
    items: [
      { name: "Docker", level: 85 },
      { name: "Apache Airflow", level: 80 },
      { name: "Git & GitHub", level: 90 },
      { name: "CI/CD", level: 75 },
      { name: "Cloud Computing", level: 70 },
      { name: "Linux", level: 80 },
    ]
  },
  {
    category: "Banco de Dados & Ferramentas",
    items: [
      { name: "PostgreSQL", level: 85 },
      { name: "Power BI", level: 80 },
      { name: "Excel Avançado", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Tableau", level: 70 },
      { name: "Metodologias Ágeis", level: 80 },
    ]
  }
];

export default function Skills({
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
      className={"!bg-secondary"}
    >
      <SectionBody>
        <SectionTitle 
          title="Skills"
          subtitle="Tecnologias e ferramentas que utilizo para análise de dados, desenvolvimento e gestão de projetos"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skillCategory, index) => (
            <SkillCard key={skillCategory.category} skillCategory={skillCategory} index={index} />
          ))}
        </div>
      </SectionBody>
    </DefaultSection>
  )
}