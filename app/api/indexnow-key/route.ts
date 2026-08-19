import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Validação IndexNow (keyLocation): retorna a key em texto puro
 * para os crawlers verificarem a posse do domínio.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    return new NextResponse('Not Found', { status: 404 })
  }
  return new NextResponse(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
