'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  tags: string[]
  readTime: number | null
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        setError('Erro ao carregar posts')
      }
    } catch {
      setError('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      })
      if (response.ok) {
        fetchPosts()
      } else {
        setError('Erro ao atualizar post')
      }
    } catch {
      setError('Erro ao atualizar post')
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchPosts()
      } else {
        setError('Erro ao excluir post')
      }
    } catch {
      setError('Erro ao excluir post')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-tertiary">Carregando posts...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-tertiary">Posts do Blog</h1>
          <p className="mt-1 text-sm text-tertiary/60">
            Gerencie todos os posts do seu blog aqui.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-accent text-primary hover:bg-accent/80 transition-colors shadow-sm"
          >
            + Novo Post
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-accent/30">
        <table className="min-w-full divide-y divide-accent/20">
          <thead className="bg-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-tertiary/60 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-tertiary/60 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-tertiary/60 uppercase tracking-wider">
                Criado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-tertiary/60 uppercase tracking-wider">
                Tags
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-secondary divide-y divide-accent/20">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-primary/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-tertiary">{post.title}</div>
                  <div className="text-sm text-tertiary/50 mt-0.5 line-clamp-1">
                    {post.description || 'Sem descrição'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => togglePublished(post.id, post.published)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                      post.published
                        ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60'
                        : 'bg-yellow-900/40 text-yellow-400 hover:bg-yellow-900/60'
                    }`}
                  >
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/60">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-tertiary/50">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-16 bg-secondary">
            <p className="text-tertiary/50 mb-2">Nenhum post encontrado.</p>
            <Link
              href="/admin/blog/new"
              className="text-accent hover:text-accent/80 transition-colors text-sm"
            >
              Criar seu primeiro post →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
