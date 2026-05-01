import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const talks = await prisma.talk.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(talks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const talk = await prisma.talk.create({
    data: {
      slug: body.slug,
      title: body.title,
      titleEn: body.titleEn || null,
      description: body.description || null,
      descriptionEn: body.descriptionEn || null,
      event: body.event,
      eventEn: body.eventEn || null,
      location: body.location || null,
      date: new Date(body.date),
      slidesUrl: body.slidesUrl || null,
      videoUrl: body.videoUrl || null,
      coverImage: body.coverImage || null,
      tags: body.tags || [],
      published: body.published || false,
    },
  })
  return NextResponse.json(talk, { status: 201 })
}
