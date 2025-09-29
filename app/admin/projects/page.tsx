'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Project {
  id: string
  slug: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  imageUrl: string | null
  demoUrl: string | null
  githubUrl: string | null
  technologies: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        setError('Erro ao carregar projetos')
      }
    } catch (error) {
      setError('Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !featured }),
      })

      if (response.ok) {
        fetchProjects() // Refresh the list
      } else {
        setError('Erro ao atualizar projeto')
      }
    } catch (error) {
      setError('Erro ao atualizar projeto')
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProjects() // Refresh the list
      } else {
        setError('Erro ao excluir projeto')
      }
    } catch (error) {
      setError('Erro ao excluir projeto')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando projetos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-tertiary mb-2">Projetos</h1>
            <p className="text-tertiary/70 text-lg">
              Gerencie todos os seus projetos aqui.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary bg-accent hover:bg-accent/90 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              <span className="mr-2">+</span>
              Novo Projeto
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-accent/10">
            <thead className="bg-accent/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Projeto
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Tecnologias
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Criado em
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-secondary/20 divide-y divide-accent/10">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-accent/5 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {project.imageUrl && (
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={project.imageUrl}
                            alt={project.title}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-tertiary truncate">
                          {project.title}
                        </div>
                        <div className="text-sm text-tertiary/70 truncate">
                          {project.description ? project.description.substring(0, 80) + '...' : 'Sem descrição'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(project.id, project.featured)}
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                        project.featured
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-tertiary/10 text-tertiary/70 border border-tertiary/20'
                      }`}
                    >
                      {project.featured ? '⭐ Destacado' : 'Normal'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies && project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-md border border-accent/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 2 && (
                        <span className="text-xs text-tertiary/60 px-2 py-1">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/70">
                    {formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-accent hover:text-accent/80 transition-colors font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-red-400 hover:text-red-300 transition-colors font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {projects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-tertiary/70 text-lg mb-4">Nenhum projeto encontrado</p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary bg-accent hover:bg-accent/90 rounded-xl transition-colors duration-200"
              >
                <span className="mr-2">+</span>
                Criar seu primeiro projeto
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}