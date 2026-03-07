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
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-tertiary">Projetos</h1>
          <p className="mt-2 text-sm text-tertiary/80">
            Gerencie todos os seus projetos aqui.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors sm:w-auto"
          >
            Novo Projeto
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-accent/20 md:rounded-lg">
              <table className="min-w-full divide-y divide-accent/20">
                <thead className="bg-primary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Título
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Destaque
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Criado em
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-secondary divide-y divide-accent/20">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {project.imageUrl && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={project.imageUrl}
                                alt={project.title}
                              />
                            </div>
                          )}
                          <div className={project.imageUrl ? 'ml-4' : ''}>
                            <div className="text-sm font-medium text-tertiary">
                              {project.title}
                            </div>
                            <div className="text-sm text-tertiary/80">
                              {project.description ? project.description.substring(0, 100) + '...' : 'Sem descrição'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(project.id, project.featured)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            project.featured
                              ? 'bg-accent/20 text-accent'
                              : 'bg-tertiary/20 text-tertiary/80'
                          }`}
                        >
                          {project.featured ? 'Destacado' : 'Normal'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/80">
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/80">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies && project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies && project.technologies.length > 3 && (
                            <span className="text-xs text-tertiary/60">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="text-accent hover:text-accent/80 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
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
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum projeto encontrado.</p>
                  <Link
                    href="/admin/projects/new"
                    className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-900"
                  >
                    Criar seu primeiro projeto
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}