import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/admin/experiences/[id] - Buscar experiência por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const experience = await prisma.experience.findUnique({
      where: {
        id: params.id
      }
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Experiência não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Erro ao buscar experiência:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/experiences/[id] - Atualizar experiência
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    // Verificar se a experiência existe
    const existingExperience = await prisma.experience.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experiência não encontrada' },
        { status: 404 }
      )
    }

    // Se current é true, endDate deve ser null
    const finalEndDate = current ? null : endDate

    const updatedExperience = await prisma.experience.update({
      where: {
        id: params.id
      },
      data: {
        company,
        companyEn: companyEn || null,
        position,
        positionEn: positionEn || null,
        description,
        descriptionEn: descriptionEn || null,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: finalEndDate ? new Date(finalEndDate) : null,
        current: Boolean(current),
        technologies: technologies || []
      }
    })

    return NextResponse.json(updatedExperience)
  } catch (error) {
    console.error('Erro ao atualizar experiência:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/experiences/[id] - Deletar experiência
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se a experiência existe
    const existingExperience = await prisma.experience.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experiência não encontrada' },
        { status: 404 }
      )
    }

    await prisma.experience.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Experiência deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar experiência:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}