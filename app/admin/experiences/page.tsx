'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Experience {
  id: string
  company: string
  companyEn: string
  position: string
  positionEn: string
  description: string
  descriptionEn: string
  startDate: string
  endDate: string | null
  current: boolean
  technologies: string[]
  createdAt: string
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experiences')
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      } else {
        setError('Erro ao carregar experiências')
      }
    } catch (error) {
      setError('Erro ao carregar experiências')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setExperiences(experiences.filter(exp => exp.id !== id))
      } else {
        setError('Erro ao excluir experiência')
      }
    } catch (error) {
      setError('Erro ao excluir experiência')
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM yyyy', { locale: ptBR })
  }

  const formatPeriod = (startDate: string, endDate: string | null, current: boolean) => {
    const start = formatDate(startDate)
    if (current) {
      return `${start} - Atual`
    }
    if (endDate) {
      return `${start} - ${formatDate(endDate)}`
    }
    return start
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <div className="text-lg text-tertiary">Carregando experiências...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-tertiary mb-2">Experiências</h1>
            <p className="text-tertiary/70 text-lg">
              Gerencie suas experiências profissionais aqui.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/admin/experiences/new"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary bg-accent hover:bg-accent/90 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              <span className="mr-2">+</span>
              Nova Experiência
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

      {/* Experiences Table */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-accent/10">
            <thead className="bg-accent/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Experiência
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Período
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Tecnologias
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Status
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
              {experiences.map((experience) => (
                <tr key={experience.id} className="hover:bg-accent/5 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent text-lg font-semibold">💼</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-tertiary truncate">
                          {experience.company}
                        </div>
                        <div className="text-sm text-tertiary/70 truncate">
                          {experience.position}
                        </div>
                        {experience.companyEn && (
                          <div className="text-xs text-tertiary/50 mt-1 truncate">
                            EN: {experience.companyEn} - {experience.positionEn}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/70">
                    {formatPeriod(experience.startDate, experience.endDate, experience.current)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {experience.technologies && experience.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-md border border-accent/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {experience.technologies && experience.technologies.length > 2 && (
                        <span className="text-xs text-tertiary/60 px-2 py-1">
                          +{experience.technologies.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                      experience.current
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'bg-tertiary/10 text-tertiary/70 border border-tertiary/20'
                    }`}>
                      {experience.current ? '⭐ Atual' : 'Finalizada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/70">
                    {formatDistanceToNow(new Date(experience.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/experiences/${experience.id}/edit`}
                        className="text-accent hover:text-accent/80 transition-colors font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(experience.id)}
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
          
          {experiences.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-tertiary/70 text-lg mb-4">Nenhuma experiência encontrada</p>
              <Link
                href="/admin/experiences/new"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary bg-accent hover:bg-accent/90 rounded-xl transition-colors duration-200"
              >
                <span className="mr-2">+</span>
                Criar sua primeira experiência
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}