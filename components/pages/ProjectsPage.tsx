'use client'

import { useLanguage } from "@/lib/useLanguage";
import { SubpageLayout } from "@/components/ui/SubpageLayout";
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
  status: string;
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

type SortOption = 'newest' | 'oldest' | 'title';
type FilterOption = 'all' | 'featured' | 'web' | 'mobile' | 'data';

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data: Project[] = await response.json();
          setAllProjects(data);
          processProjects(data, sortBy, filterBy, searchTerm);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language]);

  useEffect(() => {
    processProjects(allProjects, sortBy, filterBy, searchTerm);
  }, [sortBy, filterBy, searchTerm, allProjects, language]);

  const processProjects = (data: Project[], sort: SortOption, filter: FilterOption, search: string) => {
    let filtered = [...data];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(project => {
        const title = language === 'en' && project.titleEn ? project.titleEn : project.title;
        const description = language === 'en' && project.descriptionEn ? project.descriptionEn : project.description;
        const searchLower = search.toLowerCase();
        
        return title.toLowerCase().includes(searchLower) ||
               description.toLowerCase().includes(searchLower) ||
               project.technologies.some(tech => tech.toLowerCase().includes(searchLower));
      });
    }

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(project => {
        switch (filter) {
          case 'featured':
            return project.featured;
          case 'web':
            return project.technologies.some(tech => 
              ['Next.js', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript'].some(webTech => 
                tech.toLowerCase().includes(webTech.toLowerCase())
              )
            );
          case 'mobile':
            return project.technologies.some(tech => 
              ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile'].some(mobileTech => 
                tech.toLowerCase().includes(mobileTech.toLowerCase())
              )
            );
          case 'data':
            return project.technologies.some(tech => 
              ['Python', 'Data', 'AI', 'ML', 'Analytics', 'ETL', 'Pipeline'].some(dataTech => 
                tech.toLowerCase().includes(dataTech.toLowerCase())
              )
            );
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          const titleA = language === 'en' && a.titleEn ? a.titleEn : a.title;
          const titleB = language === 'en' && b.titleEn ? b.titleEn : b.title;
          return titleA.localeCompare(titleB);
        default:
          return 0;
      }
    });

    // Transform to component format
    const transformedProjects: ProjectCardData[] = filtered.map((project) => ({
      title: language === 'en' && project.titleEn ? project.titleEn : project.title,
      description: language === 'en' && project.descriptionEn ? project.descriptionEn : project.description,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      imageUrl: project.imageUrl
    }));

    setProjects(transformedProjects);
  };

  const getSortLabel = (option: SortOption) => {
    const labels = {
      newest: language === 'en' ? 'Newest' : 'Mais Recentes',
      oldest: language === 'en' ? 'Oldest' : 'Mais Antigos',
      title: language === 'en' ? 'Title' : 'Título'
    };
    return labels[option];
  };

  const getFilterLabel = (option: FilterOption) => {
    const labels = {
      all: language === 'en' ? 'All Projects' : 'Todos os Projetos',
      featured: language === 'en' ? 'Featured' : 'Destacados',
      web: language === 'en' ? 'Web Development' : 'Desenvolvimento Web',
      mobile: language === 'en' ? 'Mobile Apps' : 'Apps Mobile',
      data: language === 'en' ? 'Data & AI' : 'Dados & IA'
    };
    return labels[option];
  };

  if (loading) {
    return (
      <SubpageLayout>
        <div className="px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-secondary rounded-lg mb-4"></div>
                <div className="h-4 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </SubpageLayout>
    );
  }

  return (
    <SubpageLayout>
      <div className="bg-secondary border-b border-accent/20">
        <div className="px-6 lg:px-10 py-10">
          <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-3 tracking-tight">
            {t("projects.title")}
          </h1>
          <p className="text-tertiary/60 text-lg">
            {language === 'en' ? 'Explore all my projects with advanced filtering and search' : 'Explore todos os meus projetos com filtros avançados e busca'}
          </p>
        </div>
      </div>
      <div className="px-6 lg:px-10 py-12">
        <div>
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search projects...' : 'Buscar projetos...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-accent/20 rounded-lg text-tertiary placeholder-tertiary/60 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            
            {/* Filter and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-tertiary mb-2">
                  {language === 'en' ? 'Filter by Category' : 'Filtrar por Categoria'}
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="w-full px-4 py-2 bg-secondary border border-accent/20 rounded-lg text-tertiary focus:outline-none focus:border-accent transition-colors"
                >
                  {(['all', 'featured', 'web', 'mobile', 'data'] as FilterOption[]).map(option => (
                    <option key={option} value={option}>
                      {getFilterLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-tertiary mb-2">
                  {language === 'en' ? 'Sort by' : 'Ordenar por'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2 bg-secondary border border-accent/20 rounded-lg text-tertiary focus:outline-none focus:border-accent transition-colors"
                >
                  {(['newest', 'oldest', 'title'] as SortOption[]).map(option => (
                    <option key={option} value={option}>
                      {getSortLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-tertiary/80">
              {language === 'en' 
                ? `Showing ${projects.length} of ${allProjects.length} projects`
                : `Mostrando ${projects.length} de ${allProjects.length} projetos`
              }
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
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
          ) : (
            <div className="text-center py-12">
              <div className="text-tertiary/60 text-lg mb-4">
                {language === 'en' 
                  ? 'No projects found matching your criteria'
                  : 'Nenhum projeto encontrado com os critérios selecionados'
                }
              </div>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                  setSortBy('newest');
                }}
                variant="primary"
                size="md"
              >
                {language === 'en' ? 'Clear Filters' : 'Limpar Filtros'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </SubpageLayout>
  );
}