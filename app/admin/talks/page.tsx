'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { FiPlus, FiTrash2, FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Talk {
  id: string
  slug: string
  title: string
  event: string
  date: string
  published: boolean
  tags: string[]
}

export default function AdminTalksPage() {
  const [talks, setTalks] = useState<Talk[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', event: '', date: '', location: '', description: '',
    slidesUrl: '', videoUrl: '', tags: [] as string[], published: false,
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => { fetchTalks() }, [])

  const fetchTalks = async () => {
    try {
      const res = await fetch('/api/admin/talks')
      if (res.ok) setTalks(await res.json())
    } finally { setLoading(false) }
  }

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/talks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: generateSlug(form.title) }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ title: '', event: '', date: '', location: '', description: '', slidesUrl: '', videoUrl: '', tags: [], published: false })
        fetchTalks()
      }
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar esta talk?')) return
    await fetch(`/api/admin/talks/${id}`, { method: 'DELETE' })
    setTalks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/talks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    setTalks((prev) => prev.map((t) => t.id === id ? { ...t, published: !published } : t))
  }

  const inputClass = "w-full bg-primary border border-accent/20 rounded-lg px-4 py-3 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm"

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Carregando...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title="Talks" description="Palestras e apresentações" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <FiPlus size={16} />
          Nova Talk
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-secondary border border-accent/20 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-tertiary border-b border-accent/10 pb-3">Nova Talk</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Título *</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Título da palestra" />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Evento *</label>
              <input name="event" value={form.event} onChange={handleChange} required className={inputClass} placeholder="Nome do evento" />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Data *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Local</label>
              <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Teresina, PI" />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Slides URL</label>
              <input name="slidesUrl" value={form.slidesUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Vídeo URL</label>
              <input name="videoUrl" value={form.videoUrl} onChange={handleChange} className={inputClass} placeholder="https://youtube.com/..." />
            </div>
          </div>
          <div>
            <label className="block text-sm text-tertiary/70 mb-1.5">Descrição</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Breve descrição..." />
          </div>
          <div>
            <label className="block text-sm text-tertiary/70 mb-1.5">Tags (Enter)</label>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} className={inputClass} placeholder="IA, dados..." />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent/15 text-accent text-xs rounded-full cursor-pointer" onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))}>
                  {tag} ×
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="published" id="talk-published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-accent" />
            <label htmlFor="talk-published" className="text-sm text-tertiary/70">Publicar</label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-accent/20 rounded-lg text-tertiary/60 text-sm hover:border-accent/40 transition-colors">Cancelar</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-accent hover:bg-accent/90 text-primary text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-secondary border border-accent/20 rounded-xl overflow-hidden">
        {talks.length === 0 ? (
          <div className="text-center py-16 text-tertiary/40">Nenhuma talk registrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-tertiary/40 uppercase text-xs tracking-wide border-b border-accent/10">
                  <th className="px-6 py-3 text-left">Título / Evento</th>
                  <th className="px-6 py-3 text-left">Data</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {talks.map((talk) => (
                  <tr key={talk.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-tertiary">{talk.title}</p>
                      <p className="text-tertiary/40 text-xs mt-0.5">{talk.event}</p>
                    </td>
                    <td className="px-6 py-4 text-tertiary/60 text-sm">
                      {format(new Date(talk.date), 'dd MMM yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${talk.published ? 'bg-green-500/15 text-green-400' : 'bg-tertiary/10 text-tertiary/50'}`}>
                        {talk.published ? 'Publicada' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleTogglePublish(talk.id, talk.published)} className="p-1.5 text-tertiary/50 hover:text-accent transition-colors">
                          {talk.published ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                        <button onClick={() => handleDelete(talk.id)} className="p-1.5 text-tertiary/50 hover:text-red-400 transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
