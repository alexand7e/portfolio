import { Metadata } from 'next'
import ProjectsPage from '@/components/pages/ProjectsPage'

export const metadata: Metadata = {
  title: 'Projetos | Alexandre Oliveira',
  description: 'Explore todos os meus projetos em desenvolvimento full-stack, data engineering e soluções de IA.',
  openGraph: {
    title: 'Projetos | Alexandre Oliveira',
    description: 'Explore todos os meus projetos em desenvolvimento full-stack, data engineering e soluções de IA.',
    type: 'website',
  },
}

export default function Projects() {
  return <ProjectsPage />
}