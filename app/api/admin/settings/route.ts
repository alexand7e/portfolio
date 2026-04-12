import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')

  if (key) {
    const setting = await prisma.siteSetting.findUnique({ where: { key } })
    return NextResponse.json({ value: setting?.value ?? '' })
  }

  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.siteSetting.findMany()
  return NextResponse.json(Object.fromEntries(settings.map((s) => [s.key, s.value])))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const results = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      })
    )
  )
  return NextResponse.json({ success: true, count: results.length })
}
