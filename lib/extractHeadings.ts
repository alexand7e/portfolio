import type { TocHeading } from '@/components/ui/TableOfContents'

export function extractHeadings(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = []
  const usedIds = new Map<string, number>()

  const result = html.replace(
    /<(h[2-4])([^>]*)>(.*?)<\/h[2-4]>/gi,
    (_, tag: string, attrs: string, inner: string) => {
      const level = parseInt(tag[1])
      const text = inner.replace(/<[^>]+>/g, '').trim()
      if (!text) return _

      const base = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const count = usedIds.get(base) ?? 0
      const id = count === 0 ? base : `${base}-${count}`
      usedIds.set(base, count + 1)

      headings.push({ id, text, level })
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`
    }
  )

  return { html: result, headings }
}
