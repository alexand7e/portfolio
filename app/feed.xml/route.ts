import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://alexand7e.dev.br'

export async function GET() {
  const [posts, tutorials] = await Promise.all([
    prisma.blog.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 30,
    }),
    prisma.tutorial.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    }),
  ])

  const allItems = [
    ...posts.map((p) => ({
      title: p.title,
      link: `${BASE_URL}/blog/${p.slug}`,
      description: p.description,
      pubDate: (p.publishedAt ?? p.createdAt).toUTCString(),
      category: p.tags,
      type: 'blog',
    })),
    ...tutorials.map((t) => ({
      title: t.title,
      link: `${BASE_URL}/tutoriais/${t.slug}`,
      description: t.description,
      pubDate: (t.publishedAt ?? t.createdAt).toUTCString(),
      category: t.tags,
      type: 'tutorial',
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alexandre Barros — Dados, IA e Tecnologia</title>
    <link>${BASE_URL}</link>
    <description>Artigos e tutoriais sobre inteligência artificial, engenharia de dados e transformação digital, por Alexandre Barros (SIA-PI).</description>
    <language>pt-BR</language>
    <managingEditor>contato@alexand7e.dev.br (Alexandre Barros)</managingEditor>
    <webMaster>contato@alexand7e.dev.br (Alexandre Barros)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${allItems
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      ${item.category.map((c) => `<category><![CDATA[${c}]]></category>`).join('\n      ')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
