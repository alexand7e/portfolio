'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { FiPlus, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string | null
  text: string
  published: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', company: '', text: '', published: false })

  useEffect(() => { fetchTestimonials() }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      if (res.ok) setTestimonials(await res.json())
    } finally { setLoading(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ name: '', role: '', company: '', text: '', published: false })
        fetchTestimonials()
      }
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este depoimento?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    setTestimonials((prev) => prev.filter((t) => t.id !== id))
  }

  const handleToggle = async (id: string, published: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, published: !published } : t))
  }

  const inputClass = "w-full bg-primary border border-accent/20 rounded-lg px-4 py-3 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm"

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Carregando...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title="Depoimentos" description="Gerencie os testimonials da home" />
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-medium px-4 py-2 rounded-lg text-sm transition-colors">
          <FiPlus size={16} />
          Novo Depoimento
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-secondary border border-accent/20 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-tertiary border-b border-accent/10 pb-3">Novo Depoimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Nome *</label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="João Silva" />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Cargo *</label>
              <input name="role" value={form.role} onChange={handleChange} required className={inputClass} placeholder="Product Manager" />
            </div>
            <div>
              <label className="block text-sm text-tertiary/70 mb-1.5">Empresa</label>
              <input name="company" value={form.company} onChange={handleChange} className={inputClass} placeholder="Tech Co." />
            </div>
          </div>
          <div>
            <label className="block text-sm text-tertiary/70 mb-1.5">Depoimento *</label>
            <textarea name="text" value={form.text} onChange={handleChange} required rows={4} className={inputClass} placeholder="Alexandre é um profissional excepcional..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="published" id="t-pub" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-accent" />
            <label htmlFor="t-pub" className="text-sm text-tertiary/70">Publicar na home</label>
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
        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-tertiary/40">Nenhum depoimento ainda.</div>
        ) : (
          <div className="divide-y divide-accent/10">
            {testimonials.map((t) => (
              <div key={t.id} className="px-6 py-5 hover:bg-accent/5 transition-colors flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-tertiary text-sm">{t.name}</p>
                    <span className="text-tertiary/30 text-xs">·</span>
                    <p className="text-tertiary/50 text-xs">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                  </div>
                  <p className="text-sm text-tertiary/60 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${t.published ? 'bg-green-500/15 text-green-400' : 'bg-tertiary/10 text-tertiary/50'}`}>
                    {t.published ? 'Público' : 'Oculto'}
                  </span>
                  <button onClick={() => handleToggle(t.id, t.published)} className="p-1.5 text-tertiary/50 hover:text-accent transition-colors">
                    {t.published ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-tertiary/50 hover:text-red-400 transition-colors">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
