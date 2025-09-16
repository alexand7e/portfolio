'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ExperienceFormData {
  company: string
  companyEn: string
  position: string
  positionEn: string
  description: string
  descriptionEn: string
  startDate: string
  endDate: string
  current: boolean
  technologies: string[]
}

interface ExperienceEditPageProps {
  params: {
    id: string
  }
}

export default function ExperienceEditPage({ params }: ExperienceEditPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [techInput, setTechInput] = useState('')
  
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    companyEn: '',
    position: '',
    positionEn: '',
    description: '',
    descriptionEn: '',
    startDate: '',
    endDate: '',
    current: false,
    technologies: []
  })

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/admin/experiences/${params.id}`)
        if (response.ok) {
          const experience = await response.json()
          
          // Formatar datas para o formato do input date
          const formatDateForInput = (dateString: string | null) => {
            if (!dateString) return ''
            return new Date(dateString).toISOString().split('T')[0]
          }
          
          setFormData({
            company: experience.company || '',
            companyEn: experience.companyEn || '',
            position: experience.position || '',
            positionEn: experience.positionEn || '',
            description: experience.description || '',
            descriptionEn: experience.descriptionEn || '',
            startDate: formatDateForInput(experience.startDate),
            endDate: formatDateForInput(experience.endDate),
            current: experience.current || false,
            technologies: experience.technologies || []
          })
        } else {
          setError('Experiência não encontrada')
        }
      } catch (error) {
        setError('Erro ao carregar experiência')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchExperience()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const current = e.target.checked
    setFormData(prev => ({
      ...prev,
      current,
      endDate: current ? '' : prev.endDate
    }))
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/experiences/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/experiences')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao atualizar experiência')
      }
    } catch (error) {
      setError('Erro ao atualizar experiência')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-500">Carregando experiência...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Editar Experiência Profissional
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/experiences"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Informações da Empresa</h3>
              <p className="mt-1 text-sm text-gray-500">
                Informações sobre a empresa e cargo em português.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Empresa (PT) *
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Cargo (PT) *
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição (PT) *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Descreva suas responsabilidades e conquistas nesta posição..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Versão em Inglês</h3>
              <p className="mt-1 text-sm text-gray-500">
                Traduções para o inglês (opcional).
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="companyEn" className="block text-sm font-medium text-gray-700">
                    Empresa (EN)
                  </label>
                  <input
                    type="text"
                    name="companyEn"
                    id="companyEn"
                    value={formData.companyEn}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="positionEn" className="block text-sm font-medium text-gray-700">
                    Cargo (EN)
                  </label>
                  <input
                    type="text"
                    name="positionEn"
                    id="positionEn"
                    value={formData.positionEn}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                    Descrição (EN)
                  </label>
                  <textarea
                    name="descriptionEn"
                    id="descriptionEn"
                    rows={4}
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Describe your responsibilities and achievements in this position..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Período e Tecnologias</h3>
              <p className="mt-1 text-sm text-gray-500">
                Datas de início e fim, e tecnologias utilizadas.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="col-span-6">
                  <div className="flex items-center">
                    <input
                      id="current"
                      name="current"
                      type="checkbox"
                      checked={formData.current}
                      onChange={handleCurrentChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="current" className="ml-2 block text-sm text-gray-900">
                      Trabalho atual (ainda trabalho aqui)
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Tecnologias Utilizadas
                  </label>
                  <div className="mt-1 flex">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-l-md"
                      placeholder="Digite uma tecnologia"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/admin/experiences"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}