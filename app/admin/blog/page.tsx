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
    } catch (error) {
      setError('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      })

      if (response.ok) {
        fetchPosts() // Refresh the list
      } else {
        setError('Erro ao atualizar post')
      }
    } catch (error) {
      setError('Erro ao atualizar post')
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts() // Refresh the list
      } else {
        setError('Erro ao excluir post')
      }
    } catch (error) {
      setError('Erro ao excluir post')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <div className="text-lg text-tertiary">Carregando posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-tertiary mb-2">Blog</h1>
            <p className="text-tertiary/70 text-lg">
              Gerencie todos os posts do seu blog aqui.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary bg-accent hover:bg-accent/90 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              <span className="mr-2">+</span>
              Novo Post
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Blog Posts Table */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-accent/10">
            <thead className="bg-accent/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Post
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">
                  Criado em
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-secondary/20 divide-y divide-accent/10">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-accent/5 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent text-lg font-semibold">📝</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-tertiary truncate">
                          {post.title}
                        </div>
                        <div className="text-sm text-tertiary/70 truncate">
                          {post.description ? post.description.substring(0, 80) + '...' : 'Sem descrição'}
                        </div>
                        {post.readTime && (
                          <div className="text-xs text-tertiary/50 mt-1">
                            {post.readTime} min de leitura
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePublished(post.id, post.published)}
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                        post.published
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-tertiary/10 text-tertiary/70 border border-tertiary/20'
                      }`}
                    >
                      {post.published ? '✅ Publicado' : '📝 Rascunho'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags && post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-md border border-accent/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags && post.tags.length > 2 && (
                        <span className="text-xs text-tertiary/60 px-2 py-1">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary/70">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-accent hover:text-accent/80 transition-colors font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-400 hover:text-red-300 transition-colors font-medium"
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
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-tertiary/70 text-lg mb-4">Nenhum post encontrado</p>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary bg-accent hover:bg-accent/90 rounded-xl transition-colors duration-200"
              >
                <span className="mr-2">+</span>
                Criar seu primeiro post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}