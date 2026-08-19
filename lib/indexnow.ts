import { absoluteUrl } from '@/lib/seo'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * Notifica buscadores (Bing, Yandex, Naver, Seznam) sobre URLs
 * novas/atualizadas via IndexNow — indexação automática.
 * Silencioso quando INDEXNOW_KEY não está configurado.
 */
export async function notifyIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key || paths.length === 0) return

  const host = new URL(absoluteUrl('/')).host
  const urlList = paths.map(absoluteUrl)

  try {
    await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: absoluteUrl(`/${key}.txt`),
        urlList,
      }),
    })
  } catch (error) {
    console.error('IndexNow notification failed:', error)
  }
}
