import { useLanguage } from "@/lib/useLanguage";
import DefaultSection from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SectionBody from "@/components/ui/SectionBody";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectCardData {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}



export default function Projects({
  className = "",
}: {
  className?: string;
}) {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data: Project[] = await response.json();
          
          // Transform database data to component format
          const transformedProjects: ProjectCardData[] = data.map((project) => ({
            title: language === 'en' && project.titleEn ? project.titleEn : project.title,
            description: language === 'en' && project.descriptionEn ? project.descriptionEn : project.description,
            technologies: project.technologies,
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
            imageUrl: project.imageUrl
          }));
          
          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language]);

  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  if (loading) {
    return (
      <DefaultSection id="projects" className={className}>
        <SectionTitle
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        />
        <SectionBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-secondary rounded-lg mb-4"></div>
                <div className="h-4 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </SectionBody>
      </DefaultSection>
    );
  }

  return (
    <DefaultSection id="projects" className={className}>
      <SectionTitle
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
      />
      <SectionBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              githubUrl={project.githubUrl}
              liveUrl={project.liveUrl}
              imageUrl={project.imageUrl}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-8 gap-4">
          {projects.length > 6 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="secondary"
              size="md"
            >
              {showAll ? t("projects.showLess") : t("projects.showMore")}
            </Button>
          )}
          <Button
            onClick={() => window.location.href = '/projects'}
            variant="primary"
            size="md"
          >
            {language === 'en' ? 'View All Projects' : 'Ver Todos os Projetos'}
          </Button>
        </div>
      </SectionBody>
    </DefaultSection>
  );
}