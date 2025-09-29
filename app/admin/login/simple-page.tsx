'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
      } else {
        const session = await getSession()
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          setError('Acesso negado')
        }
      }
    } catch (error) {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#1c1c22',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: '#1C2026',
        padding: '40px',
        borderRadius: '8px',
        border: '1px solid #00ff99'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#E0E1DD', 
            fontSize: '24px', 
            fontWeight: 'bold',
            margin: '0 0 10px 0'
          }}>
            Painel Administrativo
          </h2>
          <p style={{ 
            color: '#E0E1DD', 
            fontSize: '14px',
            margin: 0
          }}>
            Faça login para acessar o painel
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#E0E1DD', 
              fontSize: '14px', 
              marginBottom: '5px' 
            }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #00ff99',
                borderRadius: '4px',
                backgroundColor: '#1c1c22',
                color: '#E0E1DD',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Email"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#E0E1DD', 
              fontSize: '14px', 
              marginBottom: '5px' 
            }}>
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #00ff99',
                borderRadius: '4px',
                backgroundColor: '#1c1c22',
                color: '#E0E1DD',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Senha"
            />
          </div>

          {error && (
            <div style={{ 
              color: '#ff6b6b', 
              fontSize: '14px', 
              textAlign: 'center', 
              backgroundColor: '#ff6b6b20',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00ff99',
              color: '#1c1c22',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
