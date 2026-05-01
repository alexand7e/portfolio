'use client'

import { useState } from 'react'
import { FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Inscrição realizada!')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Algo deu errado.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
          <FiCheck size={28} className="text-accent" />
        </div>
        <p className="text-tertiary font-semibold text-lg">{message}</p>
        <p className="text-tertiary/50 text-sm">Obrigado por se inscrever!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-tertiary/70 mb-1.5">
            Nome <span className="text-tertiary/30 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alexandre"
            className="w-full bg-primary border border-accent/20 rounded-lg px-4 py-3 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tertiary/70 mb-1.5">
            E-mail <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            required
            className="w-full bg-primary border border-accent/20 rounded-lg px-4 py-3 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <FiAlertCircle size={14} />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
      >
        {status === 'loading' ? (
          'Inscrevendo...'
        ) : (
          <>
            <FiSend size={14} />
            Inscrever-se
          </>
        )}
      </button>
    </form>
  )
}
