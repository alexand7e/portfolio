import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET - List all blog posts
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      slug,
      title,
      titleEn,
      description,
      descriptionEn,
      content,
      contentEn,
      coverUrl,
      coverImage,
      published,
      tags,
      readTime
    } = body

    // Check if slug already exists
    const existingPost = await prisma.blog.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug já existe' },
        { status: 400 }
      )
    }

    const post = await prisma.blog.create({
      data: {
        slug,
        title,
        titleEn,
        description,
        descriptionEn,
        content,
        contentEn,
        coverUrl,
        coverImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        tags: tags || [],
        readTime
      }
    })

    revalidatePath('/blog')
    revalidatePath('/')
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}