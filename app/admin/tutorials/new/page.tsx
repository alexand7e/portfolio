'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi'
import Link from 'next/link'

export default function NewTutorialPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [form, setForm] = useState({
    title: '', titleEn: '', slug: '', description: '', descriptionEn: '',
    content: '', contentEn: '', coverUrl: '', difficulty: 'BEGINNER',
    estimatedTime: '', tags: [] as string[], technologies: [] as string[],
    published: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setForm((prev) => ({ ...prev, title, slug: generateSlug(title) }))
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!form.tags.includes(tagInput.trim())) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      if (!form.technologies.includes(techInput.trim())) {
        setForm((prev) => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }))
      }
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/admin/tutorials')
      } else {
        const data = await res.json()
        setError(data.error || 'Erro ao salvar tutorial.')
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-primary border border-accent/20 rounded-lg px-4 py-3 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-tertiary/70 mb-1.5"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title="Novo Tutorial" description="Crie um novo tutorial" />
        <Link href="/admin/tutorials" className="inline-flex items-center gap-2 text-tertiary/60 hover:text-accent text-sm transition-colors">
          <FiArrowLeft size={14} />
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

        {/* Basic Info PT */}
        <section className="bg-secondary border border-accent/20 rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-tertiary text-lg border-b border-accent/10 pb-3">Conteúdo (Português)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Título *</label>
              <input name="title" value={form.title} onChange={handleTitleChange} required className={inputClass} placeholder="Título do tutorial" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} placeholder="slug-do-tutorial" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={inputClass} placeholder="Breve descrição do tutorial" />
          </div>
          <div>
            <label className={labelClass}>Conteúdo (Markdown) *</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={14} className={`${inputClass} font-mono`} placeholder="# Introdução&#10;&#10;Conteúdo do tutorial em Markdown..." />
          </div>
        </section>

        {/* English */}
        <section className="bg-secondary border border-accent/20 rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-tertiary text-lg border-b border-accent/10 pb-3">English Version (optional)</h2>
          <div>
            <label className={labelClass}>Title (EN)</label>
            <input name="titleEn" value={form.titleEn} onChange={handleChange} className={inputClass} placeholder="Tutorial title in English" />
          </div>
          <div>
            <label className={labelClass}>Description (EN)</label>
            <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows={3} className={inputClass} placeholder="Brief description in English" />
          </div>
          <div>
            <label className={labelClass}>Content (EN, Markdown)</label>
            <textarea name="contentEn" value={form.contentEn} onChange={handleChange} rows={10} className={`${inputClass} font-mono`} placeholder="# Introduction..." />
          </div>
        </section>

        {/* Metadata */}
        <section className="bg-secondary border border-accent/20 rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-tertiary text-lg border-b border-accent/10 pb-3">Metadados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Dificuldade</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className={inputClass}>
                <option value="BEGINNER">Iniciante</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="ADVANCED">Avançado</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Tempo estimado (min)</label>
              <input type="number" name="estimatedTime" value={form.estimatedTime} onChange={handleChange} className={inputClass} placeholder="30" min="1" />
            </div>
            <div>
              <label className={labelClass}>Cover URL</label>
              <input name="coverUrl" value={form.coverUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags (Enter para adicionar)</label>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} className={inputClass} placeholder="python, machine-learning, IA..." />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-accent text-xs rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400"><FiX size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className={labelClass}>Tecnologias (Enter para adicionar)</label>
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={addTech} className={inputClass} placeholder="Python, pandas, scikit-learn..." />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.technologies.map((tech) => (
                <span key={tech} className="flex items-center gap-1.5 px-3 py-1 bg-secondary border border-accent/20 text-tertiary/70 text-xs rounded-full">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-400"><FiX size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="published" id="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-accent" />
            <label htmlFor="published" className="text-sm text-tertiary/70">Publicar imediatamente</label>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <Link href="/admin/tutorials" className="px-5 py-2.5 border border-accent/20 rounded-lg text-tertiary/70 text-sm hover:border-accent/40 transition-colors">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            <FiSave size={15} />
            {saving ? 'Salvando...' : 'Salvar Tutorial'}
          </button>
        </div>
      </form>
    </div>
  )
}
