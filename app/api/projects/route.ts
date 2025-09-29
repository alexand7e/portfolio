import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected interface
    const transformedProjects = projects.map((project: any) => ({
      ...project,
      liveUrl: project.demoUrl,
      order: 0 // Default order since it's not in schema
    }))

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}