'use client'

import { useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Inscrição realizada!')
        setEmail('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Algo deu errado.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <footer className="border-t border-accent/10 bg-primary py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Esquerda: copyright + links */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-tertiary/40 text-sm">
              © {new Date().getFullYear()} Alexandre Barros
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/alexand7e"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary/40 hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <a
                href="https://linkedin.com/in/alexandrebarros"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary/40 hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
              <a
                href="mailto:contato@alexand7e.dev.br"
                className="text-tertiary/40 hover:text-accent transition-colors"
                aria-label="E-mail"
              >
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* Direita: newsletter mini-form */}
          <div className="flex flex-col items-center md:items-end gap-2">
            {status === 'success' ? (
              <div className="flex items-center gap-2 text-accent text-sm">
                <FiCheck size={14} />
                <span>{message}</span>
              </div>
            ) : (
              <>
                <p className="text-tertiary/40 text-xs">
                  Receba artigos sobre IA e dados no seu e-mail
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="bg-primary border border-accent/20 rounded-lg px-3 py-2 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent/60 transition-colors text-sm w-48"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-medium px-3 py-2 rounded-lg transition-colors text-xs"
                  >
                    {status === 'loading' ? (
                      '...'
                    ) : (
                      <>
                        <FiSend size={12} />
                        Inscrever
                      </>
                    )}
                  </button>
                </form>
                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <FiAlertCircle size={12} />
                    <span>{message}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
