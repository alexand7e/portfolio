'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/admin/StatsCard'
import QuickActions from '@/components/admin/QuickActions'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Stats {
  blogPosts: number
  projects: number
  experiences: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogPosts: 0, projects: 0, experiences: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando estatísticas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Dashboard" 
        description="Visão geral do seu portfólio" 
      />
        
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Posts do Blog"
          value={stats.blogPosts}
          icon="📝"
          linkHref="/admin/blog"
          linkText="Gerenciar posts"
          linkColor="text-blue-600 hover:text-blue-800"
        />
        <StatsCard
          title="Projetos"
          value={stats.projects}
          icon="🚀"
          linkHref="/admin/projects"
          linkText="Gerenciar projetos"
          linkColor="text-green-600 hover:text-green-800"
        />
        <StatsCard
          title="Experiências"
          value={stats.experiences}
          icon="💼"
          linkHref="/admin/experiences"
          linkText="Gerenciar experiências"
          linkColor="text-purple-600 hover:text-purple-800"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}