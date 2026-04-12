import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const counts = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'ACTIVE').length,
    pending: subscribers.filter((s) => s.status === 'PENDING').length,
    unsubscribed: subscribers.filter((s) => s.status === 'UNSUBSCRIBED').length,
  }

  return NextResponse.json({ subscribers, counts })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  await prisma.subscriber.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
