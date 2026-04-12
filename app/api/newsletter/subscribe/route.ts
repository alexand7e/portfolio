import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, locale = 'pt' } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } })

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return NextResponse.json({ message: 'Você já está inscrito!' }, { status: 200 })
      }
      if (existing.status === 'UNSUBSCRIBED') {
        await prisma.subscriber.update({
          where: { email },
          data: { status: 'ACTIVE', token: null, name: name || existing.name, locale },
        })
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
          await transporter.sendMail({
            from: `"Alexandre Barros" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Bem-vindo de volta à newsletter!',
            html: `<p>Olá${name || existing.name ? ` ${name || existing.name}` : ''}! Sua inscrição foi reativada.</p><p>Você voltará a receber artigos sobre IA, dados e tecnologia pública.</p>`,
          })
        }
        return NextResponse.json({ message: 'Inscrição reativada com sucesso!' }, { status: 200 })
      }
    }

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.subscriber.create({
      data: { email, name: name || null, locale, token, status: 'ACTIVE' },
    })

    // Enviar e-mail de confirmação
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: `"Alexandre Barros" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Bem-vindo à newsletter!',
        html: `<p>Olá${name ? ` ${name}` : ''}! Sua inscrição foi confirmada.</p><p>Você receberá artigos sobre IA, dados e tecnologia pública diretamente no seu e-mail.</p>`,
      })
    }

    return NextResponse.json({ message: 'Inscrição realizada com sucesso!' }, { status: 201 })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
