import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { tutorialEmail } from '@/lib/email-template'

export async function sendNewsletterForTutorial(tutorial: {
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
  const baseUrl = process.env.SITE_URL ?? 'https://alexand7e.dev.br'

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
