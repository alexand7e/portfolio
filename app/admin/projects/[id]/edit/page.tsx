'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

interface ProjectFormData {
  slug: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  imageUrl: string
  coverImage: string
  demoUrl: string
  githubUrl: string
  technologies: string[]
  featured: boolean
}

interface ProjectEditPageProps {
  params: {
    id: string
  }
}

export default function ProjectEditPage({ params }: ProjectEditPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [techInput, setTechInput] = useState('')
  
  const [formData, setFormData] = useState<ProjectFormData>({
    slug: '',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    imageUrl: '',
    coverImage: '',
    demoUrl: '',
    githubUrl: '',
    technologies: [],
    featured: false
  })

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${params.id}`)
        if (response.ok) {
          const project = await response.json()
          setFormData({
            slug: project.slug || '',
            title: project.title || '',
            titleEn: project.titleEn || '',
            description: project.description || '',
            descriptionEn: project.descriptionEn || '',
            imageUrl: project.imageUrl || '',
            coverImage: project.coverImage || '',
            demoUrl: project.demoUrl || '',
            githubUrl: project.githubUrl || '',
            technologies: project.technologies || [],
            featured: project.featured || false
          })
        } else {
          setError('Projeto não encontrado')
        }
      } catch (error) {
        setError('Erro ao carregar projeto')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
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
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/projects')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao atualizar projeto')
      }
    } catch (error) {
      setError('Erro ao atualizar projeto')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-500">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-tertiary sm:text-3xl sm:truncate">
              Editar Projeto
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/admin/projects"
              className="inline-flex items-center px-4 py-2 border border-secondary rounded-md shadow-sm text-sm font-medium text-tertiary bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-secondary shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-tertiary">Informações Básicas</h3>
                <p className="mt-1 text-sm text-tertiary/80">
                  Informações principais do projeto em português.
                </p>
              </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-tertiary">
                      Título (PT)
                    </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                      className="mt-1 focus:ring-accent focus:border-accent block w-full shadow-sm sm:text-sm border-tertiary/30 rounded-md bg-primary text-tertiary"
                  />
                </div>

                <div className="col-span-6">
                    <label htmlFor="slug" className="block text-sm font-medium text-tertiary">
                      Slug (URL)
                    </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                      className="mt-1 focus:ring-accent focus:border-accent block w-full shadow-sm sm:text-sm border-tertiary/30 rounded-md bg-primary text-tertiary"
                  />
                </div>

                <div className="col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-tertiary">
                      Descrição (PT)
                    </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                      className="mt-1 focus:ring-accent focus:border-accent block w-full shadow-sm sm:text-sm border-tertiary/30 rounded-md bg-primary text-tertiary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="bg-secondary shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-tertiary">Versão em Inglês</h3>
                <p className="mt-1 text-sm text-tertiary/80">
                  Traduções para o inglês (opcional).
                </p>
              </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                    Título (EN)
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    id="titleEn"
                    value={formData.titleEn}
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
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="bg-secondary shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-tertiary">Links e Recursos</h3>
                <p className="mt-1 text-sm text-tertiary/80">
                  URLs e recursos relacionados ao projeto.
                </p>
              </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <ImageUpload
                    label="Imagem de Capa (Upload)"
                    value={formData.coverImage}
                    onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
                    URL da Demo
                  </label>
                  <input
                    type="url"
                    name="demoUrl"
                    id="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                    URL do GitHub
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Tecnologias
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

                <div className="col-span-6">
                  <div className="flex items-center">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Projeto em destaque
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="flex justify-end">
            <Link
              href="/admin/projects"
              className="bg-secondary py-2 px-4 border border-tertiary/30 rounded-md shadow-sm text-sm font-medium text-tertiary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary bg-accent hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}