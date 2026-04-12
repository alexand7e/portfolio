'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { FiTrash2, FiMail, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi'

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: 'ACTIVE' | 'PENDING' | 'UNSUBSCRIBED'
  locale: string
  createdAt: string
}

interface Counts {
  total: number
  active: number
  pending: number
  unsubscribed: number
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [counts, setCounts] = useState<Counts>({ total: 0, active: 0, pending: 0, unsubscribed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/newsletter')
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data.subscribers)
        setCounts(data.counts)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este inscrito?')) return
    await fetch('/api/admin/newsletter', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
    setCounts((prev) => ({ ...prev, total: prev.total - 1 }))
  }

  const statusColors = {
    ACTIVE: 'bg-green-500/15 text-green-400',
    PENDING: 'bg-yellow-500/15 text-yellow-400',
    UNSUBSCRIBED: 'bg-red-500/15 text-red-400',
  }

  const statusLabels = {
    ACTIVE: 'Ativo',
    PENDING: 'Pendente',
    UNSUBSCRIBED: 'Cancelado',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Newsletter"
        description="Gerencie os inscritos da newsletter"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, icon: <FiUsers size={18} />, color: 'text-tertiary' },
          { label: 'Ativos', value: counts.active, icon: <FiCheckCircle size={18} />, color: 'text-green-400' },
          { label: 'Pendentes', value: counts.pending, icon: <FiClock size={18} />, color: 'text-yellow-400' },
          { label: 'Cancelados', value: counts.unsubscribed, icon: <FiMail size={18} />, color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary border border-accent/20 rounded-xl p-5">
            <div className={`flex items-center gap-2 ${stat.color} mb-2`}>
              {stat.icon}
              <span className="text-xs font-medium uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-tertiary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-secondary border border-accent/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-accent/10 flex items-center justify-between">
          <h2 className="font-semibold text-tertiary">Inscritos</h2>
        </div>

        {subscribers.length === 0 ? (
          <div className="text-center py-16 text-tertiary/40">
            <FiMail size={32} className="mx-auto mb-3" />
            <p>Nenhum inscrito ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-tertiary/40 uppercase text-xs tracking-wide border-b border-accent/10">
                  <th className="px-6 py-3 text-left">E-mail</th>
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Idioma</th>
                  <th className="px-6 py-3 text-left">Data</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 text-tertiary font-medium">{sub.email}</td>
                    <td className="px-6 py-4 text-tertiary/60">{sub.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                        {statusLabels[sub.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-tertiary/60 uppercase text-xs">{sub.locale}</td>
                    <td className="px-6 py-4 text-tertiary/40 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Remover inscrito"
                      >
                        <FiTrash2 size={15} />
                      </button>
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
