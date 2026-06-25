import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const tag = searchParams.get('tag')
  const difficulty = searchParams.get('difficulty')

  const tutorials = await prisma.tutorial.findMany({
    where: {
      published: true,
      ...(tag ? { tags: { has: tag } } : {}),
      ...(difficulty ? { difficulty: difficulty as any } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    include: { series: { select: { id: true, title: true, slug: true } } },
  })

  return NextResponse.json(tutorials)
}
