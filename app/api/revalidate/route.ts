import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Revalidar páginas após publicar novo conteúdo
    revalidatePath('/blog');
    revalidatePath('/tutoriais');
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Blog, tutoriais e sitemap revalidados com sucesso!'
    });
  } catch (err) {
    return NextResponse.json({ 
      message: 'Erro ao revalidar blog' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST para revalidar o blog',
    endpoints: {
      revalidate: 'POST /api/revalidate',
      blog: '/blog'
    }
  });
}

