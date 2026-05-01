'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { FiSave, FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'

export default function AdminSettingsPage() {
  const [nowContent, setNowContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setNowContent(data.now_content || '')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        now_content: nowContent,
        now_updated_at: new Date().toISOString(),
      }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Carregando...</div></div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <AdminPageHeader title="Configurações" description="Página /agora e configurações gerais" />
        <Link href="/agora" target="_blank" className="inline-flex items-center gap-2 text-accent/70 hover:text-accent text-sm transition-colors">
          <FiExternalLink size={14} />
          Ver /agora
        </Link>
      </div>

      <section className="bg-secondary border border-accent/20 rounded-xl p-6 space-y-5">
        <div className="border-b border-accent/10 pb-3">
          <h2 className="font-semibold text-tertiary text-lg">/agora</h2>
          <p className="text-tertiary/50 text-sm mt-1">
            Conteúdo exibido em{' '}
            <code className="text-accent text-xs bg-accent/10 px-1.5 py-0.5 rounded">alexand7e.dev.br/agora</code>.
            Suporta Markdown.
          </p>
        </div>

        <textarea
          value={nowContent}
          onChange={(e) => setNowContent(e.target.value)}
          rows={20}
          className="w-full bg-primary border border-accent/20 rounded-lg px-4 py-3 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm font-mono"
          placeholder={`## O que estou fazendo\n\nAtualmente trabalhando na **SIA-PI** como Gerente de IA...\n\n## Lendo\n\n- Livro X\n\n## Construindo\n\n- Projeto Y`}
        />

        <div className="flex items-center justify-between">
          {saved && (
            <span className="text-green-400 text-sm">Salvo com sucesso!</span>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            <FiSave size={15} />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </section>
    </div>
  )
}
