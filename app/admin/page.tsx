'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/admin/StatsCard'
import QuickActions from '@/components/admin/QuickActions'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Stats {
  blogPosts: number
  projects: number
  experiences: number
  tutorials: number
  subscribers: number
  talks: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogPosts: 0, projects: 0, experiences: 0, tutorials: 0, subscribers: 0, talks: 0 })
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Posts"
          value={stats.blogPosts}
          icon="📝"
          linkHref="/admin/blog"
          linkText="Ver posts"
          linkColor="text-blue-400 hover:text-blue-300"
        />
        <StatsCard
          title="Tutoriais"
          value={stats.tutorials}
          icon="📚"
          linkHref="/admin/tutorials"
          linkText="Ver tutoriais"
          linkColor="text-cyan-400 hover:text-cyan-300"
        />
        <StatsCard
          title="Inscritos"
          value={stats.subscribers}
          icon="✉️"
          linkHref="/admin/newsletter"
          linkText="Newsletter"
          linkColor="text-accent hover:text-accent/80"
        />
        <StatsCard
          title="Talks"
          value={stats.talks}
          icon="🎙️"
          linkHref="/admin/talks"
          linkText="Ver talks"
          linkColor="text-yellow-400 hover:text-yellow-300"
        />
        <StatsCard
          title="Projetos"
          value={stats.projects}
          icon="🚀"
          linkHref="/admin/projects"
          linkText="Ver projetos"
          linkColor="text-green-400 hover:text-green-300"
        />
        <StatsCard
          title="Experiências"
          value={stats.experiences}
          icon="💼"
          linkHref="/admin/experiences"
          linkText="Ver experiências"
          linkColor="text-purple-400 hover:text-purple-300"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}