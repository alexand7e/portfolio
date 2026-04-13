import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { tutorialEmail } from '@/lib/email-template'

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json(
      { error: 'Variáveis GMAIL_USER e GMAIL_APP_PASSWORD não configuradas.' },
      { status: 500 }
    )
  }

  const body = await req.json()
  const { tutorialId } = body

  if (!tutorialId) {
    return NextResponse.json({ error: 'tutorialId é obrigatório.' }, { status: 400 })
  }

  const tutorial = await prisma.tutorial.findUnique({ where: { id: tutorialId } })
  if (!tutorial) {
    return NextResponse.json({ error: 'Tutorial não encontrado.' }, { status: 404 })
  }
  if (!tutorial.published) {
    return NextResponse.json({ error: 'Tutorial não está publicado.' }, { status: 400 })
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'ACTIVE' },
  })

  if (subscribers.length === 0) {
    return NextResponse.json({ message: 'Nenhum assinante ativo.', sent: 0, failed: 0 })
  }

  const transporter = createTransporter()
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://alexand7e.dev.br'

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const subscriber of subscribers) {
    try {
      const unsubUrl = subscriber.token
        ? `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.token}`
        : undefined
      await transporter.sendMail({
        from: `"Alexandre Barros" <${process.env.GMAIL_USER}>`,
        to: subscriber.email,
        subject: `Novo tutorial: ${tutorial.title}`,
        html: tutorialEmail(tutorial, subscriber.name, unsubUrl),
      })
      sent++
    } catch (err) {
      failed++
      errors.push(`${subscriber.email}: ${(err as Error).message}`)
    }
  }

  return NextResponse.json({
    message: `Envio concluído: ${sent} enviados, ${failed} falhas.`,
    sent,
    failed,
    errors: errors.length > 0 ? errors : undefined,
  })
}
