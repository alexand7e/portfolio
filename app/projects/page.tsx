import { Metadata } from 'next'
import ProjectsPage from '@/components/pages/ProjectsPage'

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Explore todos os meus projetos em desenvolvimento full-stack, data engineering e soluções de IA.',
  alternates: {
    canonical: 'https://www.alexand7e.dev.br/projects',
  },
  openGraph: {
    title: 'Projetos | Alexandre Barros',
    description: 'Explore todos os meus projetos em desenvolvimento full-stack, data engineering e soluções de IA.',
    type: 'website',
    url: 'https://www.alexand7e.dev.br/projects',
  },
}

export default function Projects() {
  return <ProjectsPage />
}