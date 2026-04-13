import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { tutorialEmail } from '@/lib/email-template'

async function sendNewsletterForTutorial(tutorial: {
  id: string
  title: string
  description: string
  slug: string
  difficulty: string
  estimatedTime: number | null
  tags: string[]
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return

  const subscribers = await prisma.subscriber.findMany({ where: { status: 'ACTIVE' } })
  if (subscribers.length === 0) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://alexand7e.dev.br'

  for (const subscriber of subscribers) {
    const unsubUrl = subscriber.token
      ? `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.token}`
      : undefined
    try {
      await transporter.sendMail({
        from: `"Alexandre Barros" <${process.env.GMAIL_USER}>`,
        to: subscriber.email,
        subject: `Novo tutorial: ${tutorial.title}`,
        html: tutorialEmail(tutorial, subscriber.name, unsubUrl),
      })
    } catch (err) {
      console.error(`Newsletter: falha ao enviar para ${subscriber.email}:`, (err as Error).message)
    }
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const tutorial = await prisma.tutorial.findUnique({ where: { id: params.id } })
  if (!tutorial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tutorial)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const existing = await prisma.tutorial.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const tutorial = await prisma.tutorial.update({
    where: { id: params.id },
    data: {
      ...body,
      estimatedTime: body.estimatedTime ? parseInt(body.estimatedTime) : null,
      seriesOrder: body.seriesOrder ? parseInt(body.seriesOrder) : null,
      publishedAt: body.published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  })

  // Dispara newsletter quando tutorial é publicado pela primeira vez
  if (!existing.published && tutorial.published) {
    sendNewsletterForTutorial(tutorial).catch((err) =>
      console.error('Newsletter dispatch error:', err)
    )
  }

  return NextResponse.json(tutorial)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await prisma.tutorial.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
