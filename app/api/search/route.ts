import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientIp, createRateLimiter } from '@/lib/rateLimit'

const MAX_QUERY = 80

// A busca (⌘K e terminal da home) é pública e bate no banco: 40 consultas por minuto por IP
// cobrem a digitação com debounce e cortam scripts em loop.
const limiter = createRateLimiter({ limit: 40, windowMs: 60_000 })

// Controles e caracteres invisíveis (zero-width, bidi) não ajudam a buscar nada.
const INVISIBLE = new RegExp('[\\p{Cc}\\p{Cf}]', 'gu')

export async function GET(req: NextRequest) {
  const { ok, retryAfter } = limiter(clientIp(req))
  if (!ok) {
    return NextResponse.json(
      { results: [], error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  const q = req.nextUrl.searchParams.get('q')
    ?.replace(/\s+/g, ' ')
    .replace(INVISIBLE, '')
    .trim()
    .slice(0, MAX_QUERY)
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
