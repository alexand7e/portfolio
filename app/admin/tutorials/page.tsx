'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'

interface Tutorial {
  id: string
  slug: string
  title: string
  difficulty: string
  published: boolean
  tags: string[]
  estimatedTime: number | null
  createdAt: string
}

const difficultyLabel: Record<string, string> = {
  BEGINNER: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
}

const difficultyColor: Record<string, string> = {
  BEGINNER: 'bg-green-500/15 text-green-400',
  INTERMEDIATE: 'bg-yellow-500/15 text-yellow-400',
  ADVANCED: 'bg-red-500/15 text-red-400',
}

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTutorials() }, [])

  const fetchTutorials = async () => {
    try {
      const res = await fetch('/api/admin/tutorials')
      if (res.ok) setTutorials(await res.json())
    } finally { setLoading(false) }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Deletar "${title}"?`)) return
    await fetch(`/api/admin/tutorials/${id}`, { method: 'DELETE' })
    setTutorials((prev) => prev.filter((t) => t.id !== id))
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    const res = await fetch(`/api/admin/tutorials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    if (res.ok) {
      setTutorials((prev) => prev.map((t) => t.id === id ? { ...t, published: !published } : t))
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Carregando...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title="Tutoriais" description="Gerencie os tutoriais do site" />
        <Link
          href="/admin/tutorials/new"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <FiPlus size={16} />
          Novo Tutorial
        </Link>
      </div>

      <div className="bg-secondary border border-accent/20 rounded-xl overflow-hidden">
        {tutorials.length === 0 ? (
          <div className="text-center py-16 text-tertiary/40">
            <p className="mb-4">Nenhum tutorial ainda.</p>
            <Link href="/admin/tutorials/new" className="text-accent hover:underline text-sm">Criar primeiro tutorial</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-tertiary/40 uppercase text-xs tracking-wide border-b border-accent/10">
                  <th className="px-6 py-3 text-left">Título</th>
                  <th className="px-6 py-3 text-left">Dificuldade</th>
                  <th className="px-6 py-3 text-left">Tags</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {tutorials.map((t) => (
                  <tr key={t.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-tertiary line-clamp-1">{t.title}</p>
                      <p className="text-tertiary/40 text-xs mt-0.5">{t.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyColor[t.difficulty]}`}>
                        {difficultyLabel[t.difficulty]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {t.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">{tag}</span>
                        ))}
                        {t.tags.length > 2 && <span className="text-tertiary/30 text-xs">+{t.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${t.published ? 'bg-green-500/15 text-green-400' : 'bg-tertiary/10 text-tertiary/50'}`}>
                        {t.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(t.id, t.published)}
                          className="p-1.5 text-tertiary/50 hover:text-accent transition-colors"
                          title={t.published ? 'Despublicar' : 'Publicar'}
                        >
                          {t.published ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                        <Link href={`/admin/tutorials/${t.id}/edit`} className="p-1.5 text-tertiary/50 hover:text-accent transition-colors">
                          <FiEdit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(t.id, t.title)} className="p-1.5 text-tertiary/50 hover:text-red-400 transition-colors">
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
