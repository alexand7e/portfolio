import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import SkillCard from "@/components/ui/SkillCard";
import { useLanguage } from "@/lib/useLanguage";

const skills = [
  {
    category: "Backend & Data Engineering",
    items: [
      { name: "Python", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "PostgreSQL", level: 90 },
      { name: "Apache Airflow", level: 85 },
      { name: "Apache Spark", level: 80 },
      { name: "ETL Pipelines", level: 90 },
    ]
  },
  {
    category: "Frontend & Mobile",
    items: [
      { name: "TypeScript", level: 90 },
      { name: "React", level: 85 },
      { name: "Next.js", level: 90 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Framer Motion", level: 80 },
      { name: "Responsive Design", level: 90 },
    ]
  },
  {
    category: "DevOps & Cloud",
    items: [
      { name: "Docker", level: 90 },
      { name: "Kubernetes", level: 80 },
      { name: "AWS/GCP", level: 85 },
      { name: "CI/CD", level: 90 },
      { name: "Nginx", level: 85 },
      { name: "Git & GitHub", level: 95 },
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
  const { t } = useLanguage();
  return (
    <DefaultSection
      ref={ref}
      id={`${id}`}
      className={"!bg-secondary"}
    >
      <SectionBody>
        <SectionTitle 
          title={t.skills.title}
          subtitle={t.skills.subtitle}
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