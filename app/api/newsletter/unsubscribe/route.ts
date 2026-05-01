import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 400 })
  }
  const subscriber = await prisma.subscriber.findUnique({ where: { token } })
  if (!subscriber) {
    return NextResponse.json({ error: 'Inscrição não encontrada.' }, { status: 404 })
  }
  await prisma.subscriber.update({
    where: { token },
    data: { status: 'UNSUBSCRIBED' },
  })
  return NextResponse.redirect(new URL('/?unsubscribed=1', req.url))
}
