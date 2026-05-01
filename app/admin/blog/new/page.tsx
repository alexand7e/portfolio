'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

interface BlogFormData {
  slug: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  content: string
  contentEn: string
  coverUrl: string
  coverImage: string
  published: boolean
  tags: string[]
  readTime: number | null
}

const inputClass =
  'mt-1 block w-full rounded-md border border-accent/30 bg-primary text-tertiary shadow-sm placeholder-tertiary/30 focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm px-3 py-2'

const labelClass = 'block text-sm font-medium text-tertiary/80'

const sectionClass = 'bg-primary border border-accent/30 rounded-xl px-6 py-6'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState<BlogFormData>({
    slug: '',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    content: '',
    contentEn: '',
    coverUrl: '',
    coverImage: '',
    published: false,
    tags: [],
    readTime: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          readTime: formData.readTime ? Number(formData.readTime) : null,
        }),
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar post')
      }
    } catch {
      setError('Erro ao criar post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-tertiary">Novo Post do Blog</h2>
        <Link
          href="/admin/blog"
          className="inline-flex items-center px-4 py-2 border border-accent/30 rounded-md text-sm font-medium text-tertiary/80 hover:border-accent/60 hover:text-tertiary transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className={sectionClass}>
          <h3 className="text-lg font-medium text-tertiary mb-1">Informações Básicas</h3>
          <p className="text-sm text-tertiary/50 mb-6">Informações principais do post em português.</p>

          <div className="space-y-5">
            <div>
              <label htmlFor="title" className={labelClass}>Título (PT)</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="slug" className={labelClass}>Slug (URL)</label>
              <input
                type="text"
                name="slug"
                id="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Descrição (PT)</label>
              <textarea
                name="description"
                id="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="content" className={labelClass}>Conteúdo (PT) — Markdown</label>
              <textarea
                name="content"
                id="content"
                rows={14}
                required
                value={formData.content}
                onChange={handleInputChange}
                className={`${inputClass} font-mono text-xs`}
                placeholder="# Título&#10;&#10;Escreva seu conteúdo em **markdown**..."
              />
            </div>
          </div>
        </div>

        {/* Versão em Inglês */}
        <div className={sectionClass}>
          <h3 className="text-lg font-medium text-tertiary mb-1">Versão em Inglês</h3>
          <p className="text-sm text-tertiary/50 mb-6">Traduções para o inglês (opcional).</p>

          <div className="space-y-5">
            <div>
              <label htmlFor="titleEn" className={labelClass}>Título (EN)</label>
              <input
                type="text"
                name="titleEn"
                id="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="descriptionEn" className={labelClass}>Descrição (EN)</label>
              <textarea
                name="descriptionEn"
                id="descriptionEn"
                rows={3}
                value={formData.descriptionEn}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="contentEn" className={labelClass}>Conteúdo (EN) — Markdown</label>
              <textarea
                name="contentEn"
                id="contentEn"
                rows={14}
                value={formData.contentEn}
                onChange={handleInputChange}
                className={`${inputClass} font-mono text-xs`}
              />
            </div>

            <ImageUpload
              label="Imagem de Capa"
              value={formData.coverImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
            />
          </div>
        </div>

        {/* Metadados */}
        <div className={sectionClass}>
          <h3 className="text-lg font-medium text-tertiary mb-1">Metadados</h3>
          <p className="text-sm text-tertiary/50 mb-6">Informações adicionais sobre o post.</p>

          <div className="space-y-5">
            <div>
              <label htmlFor="coverUrl" className={labelClass}>URL da Capa (externo)</label>
              <input
                type="url"
                name="coverUrl"
                id="coverUrl"
                value={formData.coverUrl}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div className="max-w-xs">
              <label htmlFor="readTime" className={labelClass}>Tempo de Leitura (minutos)</label>
              <input
                type="number"
                name="readTime"
                id="readTime"
                min="1"
                value={formData.readTime || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addTag() }
                  }}
                  className={`${inputClass} mt-0 flex-1`}
                  placeholder="Digite uma tag e pressione Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 border border-accent/30 rounded-md text-sm text-tertiary/80 hover:border-accent hover:text-accent transition-colors"
                >
                  Adicionar
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-accent/60 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-accent/30 bg-primary text-accent focus:ring-accent"
              />
              <label htmlFor="published" className="text-sm text-tertiary">
                Publicar imediatamente
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/blog"
            className="px-4 py-2 border border-accent/30 rounded-md text-sm font-medium text-tertiary/80 hover:border-accent/60 hover:text-tertiary transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-md text-sm font-medium bg-accent text-primary hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando...' : 'Criar Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
