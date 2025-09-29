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
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título (PT)
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição (PT)
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Traduções para o inglês (opcional)
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                  Título (EN)
                </label>
                <input
                  type="text"
                  name="titleEn"
                  id="titleEn"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.titleEn}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                  Descrição (EN)
                </label>
                <textarea
                  name="descriptionEn"
                  id="descriptionEn"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Links e Imagens
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  id="imageUrl"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <ImageUpload
                  label="Imagem de Capa (Upload)"
                  value={formData.coverImage}
                  onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                />
              </div>

              <div>
                <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
                  URL do Demo
                </label>
                <input
                  type="url"
                  name="demoUrl"
                  id="demoUrl"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                  URL do GitHub
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  id="githubUrl"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Tecnologias
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Adicionar tecnologia"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <button
                type="button"
                onClick={addTechnology}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Projeto em destaque
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/admin/projects"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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