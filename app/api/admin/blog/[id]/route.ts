import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.blog.findUnique({
      where: {
        id: params.id
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if post exists
    const existingPost = await prisma.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // If slug is being changed, check if new slug already exists
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug já existe' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    
    if (slug !== undefined) updateData.slug = slug
    if (title !== undefined) updateData.title = title
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (description !== undefined) updateData.description = description
    if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn
    if (content !== undefined) updateData.content = content
    if (contentEn !== undefined) updateData.contentEn = contentEn
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (tags !== undefined) updateData.tags = tags
    if (readTime !== undefined) updateData.readTime = readTime
    
    if (published !== undefined) {
      updateData.published = published
      // Set publishedAt when publishing for the first time
      if (published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date()
      }
      // Clear publishedAt when unpublishing
      if (!published) {
        updateData.publishedAt = null
      }
    }

    const post = await prisma.blog.update({
      where: {
        id: params.id
      },
      data: updateData
    })

    revalidatePath('/blog')
    revalidatePath('/')
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if post exists
    const existingPost = await prisma.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    const deletedSlug = existingPost.slug
    await prisma.blog.delete({
      where: {
        id: params.id
      }
    })

    revalidatePath('/blog')
    revalidatePath('/')
    revalidatePath(`/blog/${deletedSlug}`)

    return NextResponse.json({ message: 'Post excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}