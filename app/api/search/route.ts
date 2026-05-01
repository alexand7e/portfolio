import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const search = q.toLowerCase()

  const [posts, tutorials, talks] = await Promise.all([
    prisma.blog.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      },
      select: { slug: true, title: true, description: true, tags: true },
      take: 5,
    }),
    prisma.tutorial.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      },
      select: { slug: true, title: true, description: true, tags: true, difficulty: true },
      take: 5,
    }),
    prisma.talk.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { event: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: { slug: true, title: true, event: true },
      take: 3,
    }),
  ])

  const results = [
    ...posts.map((p) => ({ type: 'blog' as const, href: `/blog/${p.slug}`, title: p.title, description: p.description, tags: p.tags })),
    ...tutorials.map((t) => ({ type: 'tutorial' as const, href: `/tutoriais/${t.slug}`, title: t.title, description: t.description, tags: t.tags })),
    ...talks.map((t) => ({ type: 'talk' as const, href: `/talks`, title: t.title, description: t.event, tags: [] })),
  ]

  return NextResponse.json({ results })
}
