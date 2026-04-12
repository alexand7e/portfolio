import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const tutorials = await prisma.tutorial.findMany({
    orderBy: { createdAt: 'desc' },
    include: { series: { select: { id: true, title: true } } },
  })
  return NextResponse.json(tutorials)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const tutorial = await prisma.tutorial.create({
    data: {
      slug: body.slug,
      title: body.title,
      titleEn: body.titleEn || null,
      description: body.description,
      descriptionEn: body.descriptionEn || null,
      content: body.content,
      contentEn: body.contentEn || null,
      coverUrl: body.coverUrl || null,
      coverImage: body.coverImage || null,
      difficulty: body.difficulty || 'BEGINNER',
      estimatedTime: body.estimatedTime ? parseInt(body.estimatedTime) : null,
      tags: body.tags || [],
      technologies: body.technologies || [],
      published: body.published || false,
      publishedAt: body.published ? new Date() : null,
      seriesId: body.seriesId || null,
      seriesOrder: body.seriesOrder ? parseInt(body.seriesOrder) : null,
    },
  })
  return NextResponse.json(tutorial, { status: 201 })
}
