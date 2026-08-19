'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiGithub, FiLinkedin, FiMail, FiSend, FiCheck, FiAlertCircle, FiArrowUp } from 'react-icons/fi'

const SITEMAP = [
  { title: 'Páginas', links: [{ label: 'Home', href: '/' }, { label: 'Projetos', href: '/projects' }, { label: 'Blog', href: '/blog' }, { label: 'Tutoriais', href: '/tutoriais' }] },
  { title: 'Conteúdo', links: [{ label: 'Talks', href: '/talks' }, { label: 'Uses', href: '/uses' }, { label: 'Agora', href: '/agora' }, { label: 'Newsletter', href: '/newsletter' }] },
]

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
    <footer className="mt-16 border-t border-hairline bg-secondary/40">
      <div className="mx-4 md:mx-14 xl:mx-16">
        {/* Newsletter + sitemap */}
        <div className="grid md:grid-cols-3 border-b border-hairline">
          <div className="md:col-span-2 py-12 px-10 md:px-12">
            <span className="text-xs uppercase tracking-widest text-accent">Faça parte da rede</span>
            <h3 className="text-2xl md:text-3xl font-bold text-tertiary mt-3">
              Inscreva-se na newsletter
            </h3>
            <p className="text-tertiary/50 text-sm mt-2">
              Receba artigos sobre IA e dados no seu e-mail
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 text-accent text-sm mt-6">
                <FiCheck size={14} />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 mt-6 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="flex-1 bg-transparent border border-hairline rounded-lg px-4 py-2.5 text-tertiary placeholder-tertiary/30 focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 disabled:opacity-60 text-primary font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {status === 'loading' ? '...' : (<><FiSend size={12} />Inscrever</>)}
                </button>
              </form>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs mt-3">
                <FiAlertCircle size={12} />
                <span>{message}</span>
              </div>
            )}
          </div>

          <div className="py-12 px-10 md:px-12 border-t md:border-t-0 md:border-l border-hairline">
            <div className="grid grid-cols-2 gap-8">
              {SITEMAP.map((group) => (
                <div key={group.title}>
                  <p className="text-xs uppercase tracking-widest text-tertiary/40 mb-4">{group.title}</p>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-sm text-tertiary/60 hover:text-accent transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social + afiliações */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 px-10 md:px-12">
          <div className="flex items-center gap-4 text-tertiary/40">
            <a href="https://github.com/alexand7e" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="GitHub"><FiGithub size={18} /></a>
            <a href="https://linkedin.com/in/alexandrebarros" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="LinkedIn"><FiLinkedin size={18} /></a>
            <a href="mailto:contato@alexand7e.dev.br" className="hover:text-accent transition-colors" aria-label="E-mail"><FiMail size={18} /></a>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-tertiary/40 uppercase tracking-widest">
            <span className="border border-hairline rounded-full px-3 py-1">SIA-PI</span>
            <span className="border border-hairline rounded-full px-3 py-1">UFPI</span>
            <span className="border border-hairline rounded-full px-3 py-1">Teaser</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-10 md:px-12 border-t border-hairline">
          <p className="text-tertiary/40 text-sm">
            © {new Date().getFullYear()} Alexandre Barros
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-sm text-tertiary/50 hover:text-accent transition-colors"
          >
            <FiArrowUp size={14} />
            Ir para o topo
          </a>
        </div>
      </div>
    </footer>
  )
}
