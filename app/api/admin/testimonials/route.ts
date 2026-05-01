import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const testimonial = await prisma.testimonial.create({
    data: {
      name: body.name,
      role: body.role,
      company: body.company || null,
      text: body.text,
      textEn: body.textEn || null,
      avatarUrl: body.avatarUrl || null,
      linkedIn: body.linkedIn || null,
      order: body.order ? parseInt(body.order) : 0,
      published: body.published || false,
    },
  })
  return NextResponse.json(testimonial, { status: 201 })
}
