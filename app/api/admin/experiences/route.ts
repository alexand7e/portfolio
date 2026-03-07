import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/experiences - Listar experiências
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const experiences = await prisma.experience.findMany({
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Erro ao buscar experiências:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/experiences - Criar nova experiência
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      company,
      companyEn,
      position,
      positionEn,
      description,
      descriptionEn,
      startDate,
      endDate,
      current,
      technologies
    } = body

    // Validações básicas
    if (!company || !position || !description || !startDate) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: company, position, description, startDate' },
        { status: 400 }
      )
    }

    // Se current é true, endDate deve ser null
    const finalEndDate = current ? null : endDate

    const experience = await prisma.experience.create({
      data: {
        company,
        companyEn: companyEn || null,
        position,
        positionEn: positionEn || null,
        description,
        descriptionEn: descriptionEn || null,
        startDate: new Date(startDate),
        endDate: finalEndDate ? new Date(finalEndDate) : null,
        current: Boolean(current),
        technologies: technologies || []
      }
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar experiência:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}