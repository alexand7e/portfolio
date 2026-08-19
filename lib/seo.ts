const DEFAULT_BASE_URL = 'https://www.alexand7e.dev.br'

export function getBaseUrl(): string {
  const url = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  return (url || DEFAULT_BASE_URL).replace(/\/$/, '')
}

export function absoluteUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
}
