import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [blogPosts, projects, experiences, tutorials, subscribers, talks] = await Promise.all([
      prisma.blog.count(),
      prisma.project.count(),
      prisma.experience.count(),
      prisma.tutorial.count(),
      prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
      prisma.talk.count(),
    ])

    return NextResponse.json({
      blogPosts,
      projects,
      experiences,
      tutorials,
      subscribers,
      talks,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}