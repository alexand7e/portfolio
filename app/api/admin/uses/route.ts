import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const items = await prisma.useItem.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const item = await prisma.useItem.create({
    data: {
      category: body.category,
      categoryEn: body.categoryEn || null,
      name: body.name,
      description: body.description || null,
      descriptionEn: body.descriptionEn || null,
      url: body.url || null,
      order: body.order ? parseInt(body.order) : 0,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
