"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import SiaContainer from "@/components/ui/SiaContainer";
import ColumnGrid from "@/components/ui/ColumnGrid";
import Reveal from "@/components/animations/Reveal";
import { useLanguage } from "@/lib/useLanguage";
import { FiFolder, FiGithub, FiArrowRight } from "react-icons/fi";

interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export default function Projects({
  id
}: {
  id?: string
}) {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          setProjects(await response.json());
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const displayed = (featured.length ? featured : projects).slice(0, 4);

  return (
    <section id={`${id}`} className="relative py-16 md:py-20">
      <SiaContainer>
        <ColumnGrid>
          {/* Coluna texto */}
          <Reveal className="md:col-span-2 border-b md:border-b-0 md:border-r border-hairline p-10 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FiFolder size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-accent">{t("projects.title")}</h2>
              </div>
              <p className="text-tertiary/70 leading-relaxed mt-6 max-w-md">
                {t("projects.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border-2 border-accent px-5 py-2.5 text-accent rounded-full font-bold hover:bg-accent hover:text-primary transition-all text-sm"
              >
                {language === "en" ? "View All Projects" : "Ver Todos os Projetos"}
                <FiArrowRight size={14} />
              </Link>
              <a
                href="https://github.com/alexand7e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-tertiary/80 rounded-full font-bold border border-hairline-strong hover:border-accent hover:text-accent transition-all text-sm"
              >
                <FiGithub size={14} />
                GitHub
              </a>
            </div>
          </Reveal>

          {/* Coluna cards */}
          <div className="md:col-span-2 p-10 md:p-12">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-40 bg-secondary rounded-lg animate-pulse" />
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <p className="text-tertiary/50 text-sm">—</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {displayed.map((project, i) => (
                  <Reveal
                    key={project.id}
                    delay={0.08 + i * 0.06}
                    className="flex flex-col gap-2 border border-hairline rounded-lg p-5 hover:border-accent/40 transition-colors"
                  >
                    <h3 className="text-base font-bold text-tertiary">
                      {language === "en" && project.titleEn ? project.titleEn : project.title}
                    </h3>
                    <p className="text-xs text-tertiary/70 leading-relaxed line-clamp-3">
                      {language === "en" && project.descriptionEn ? project.descriptionEn : project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full border border-hairline-strong text-tertiary/70">
                          {tech}
                        </span>
                      ))}
                     </div>
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
