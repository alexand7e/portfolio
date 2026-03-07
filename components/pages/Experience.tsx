import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React, { useState, useEffect } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import ExperienceCard from "@/components/ui/ExperienceCard";
import { useLanguage } from "@/lib/useLanguage";

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
  location: string | null;
  locationEn: string | null;
  technologies: string[];
  order: number;
}

interface ExperienceCardData {
  title: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience({
  className = "",
}: {
  className?: string;
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
          
          // Transform database data to component format
          const transformedExperiences: ExperienceCardData[] = data.map((exp) => {
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
          
          setExperiences(transformedExperiences);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [language]);

  if (loading) {
    return (
      <DefaultSection id="experience" className={className}>
        <SectionTitle
          title={t("experience.title")}
          subtitle={t("experience.subtitle")}
        />
        <SectionBody>
          <div className="grid gap-6">
            <div className="animate-pulse">
              <div className="h-32 bg-secondary rounded-lg mb-4"></div>
              <div className="h-32 bg-secondary rounded-lg mb-4"></div>
              <div className="h-32 bg-secondary rounded-lg"></div>
            </div>
          </div>
        </SectionBody>
      </DefaultSection>
    );
  }

  return (
    <DefaultSection id="experience" className={className}>
      <SectionTitle
        title={t("experience.title")}
        subtitle={t("experience.subtitle")}
      />
      <SectionBody>
        <div className="grid gap-6">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={index}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </SectionBody>
    </DefaultSection>
  );
}