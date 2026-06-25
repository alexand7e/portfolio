/**
 * Migra dados das tabelas Prisma (schema "public") para as collections Payload (schema "payload").
 *
 * Uso:
 *   npx tsx scripts/migrate-prisma-to-payload.ts
 *
 * Pré-requisitos:
 *   1. Payload inicializado (npm run dev uma vez para criar as tabelas no schema "payload")
 *   2. Pelo menos um usuário admin criado via /admin
 *   3. .env com DATABASE_URL e PAYLOAD_SECRET configurados
 */

import { PrismaClient } from '@prisma/client'
import { getPayload } from 'payload'
import config from '../payload.config'

const prisma = new PrismaClient()

async function migrate() {
  console.log('▶ Iniciando migração Prisma → Payload\n')

  const payload = await getPayload({ config })

  // ─── Blog ───────────────────────────────────────────────
  const blogPosts = await prisma.blog.findMany()
  console.log(`  Blog: ${blogPosts.length} posts encontrados`)
  for (const post of blogPosts) {
    await payload.create({
      collection: 'blog',
      data: {
        slug: post.slug,
        title: { pt: post.title, en: post.titleEn ?? post.title },
        description: { pt: post.description, en: post.descriptionEn ?? post.description },
        contentLegacy: { pt: post.content, en: post.contentEn ?? post.content },
        coverUrl: post.coverUrl ?? undefined,
        tags: (post.tags ?? []).map((tag: string) => ({ tag })),
        readTime: post.readTime ?? undefined,
        published: post.published,
        publishedAt: post.publishedAt ?? undefined,
        _status: post.published ? 'published' : 'draft',
      },
    })
  }
  console.log('  ✓ Blog migrado\n')

  // ─── Projects ───────────────────────────────────────────
  const projects = await prisma.project.findMany()
  console.log(`  Projects: ${projects.length} projetos encontrados`)
  for (const proj of projects) {
    await payload.create({
      collection: 'projects',
      data: {
        slug: proj.slug,
        title: { pt: proj.title, en: proj.titleEn ?? proj.title },
        description: { pt: proj.description, en: proj.descriptionEn ?? proj.description },
        content: { pt: proj.content, en: proj.contentEn ?? proj.content },
        imageUrl: proj.imageUrl ?? undefined,
        demoUrl: proj.demoUrl ?? undefined,
        githubUrl: proj.githubUrl ?? undefined,
        technologies: (proj.technologies ?? []).map((t: string) => ({ technology: t })),
        featured: proj.featured,
        status: proj.status,
      },
    })
  }
  console.log('  ✓ Projects migrados\n')

  // ─── Experiences ────────────────────────────────────────
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  console.log(`  Experiences: ${experiences.length} experiências encontradas`)
  for (const exp of experiences) {
    await payload.create({
      collection: 'experiences',
      data: {
        company: { pt: exp.company, en: exp.companyEn ?? exp.company },
        position: { pt: exp.position, en: exp.positionEn ?? exp.position },
        description: exp.description ? { pt: exp.description, en: exp.descriptionEn ?? exp.description } : undefined,
        startDate: exp.startDate,
        endDate: exp.endDate ?? undefined,
        current: exp.current,
        location: exp.location ? { pt: exp.location, en: exp.locationEn ?? exp.location } : undefined,
        technologies: (exp.technologies ?? []).map((t: string) => ({ technology: t })),
        order: exp.order,
      },
    })
  }
  console.log('  ✓ Experiences migradas\n')

  // ─── Series (antes de tutorials para ter o ID) ─────────
  const seriesList = await prisma.series.findMany()
  console.log(`  Series: ${seriesList.length} séries encontradas`)
  const seriesMap = new Map<string, string>()
  for (const s of seriesList) {
    const created = await payload.create({
      collection: 'series',
      data: {
        slug: s.slug,
        title: { pt: s.title, en: s.titleEn ?? s.title },
        description: s.description ? { pt: s.description, en: s.descriptionEn ?? s.description } : undefined,
        published: s.published,
      },
    })
    seriesMap.set(s.id, created.id)
  }
  console.log('  ✓ Series migradas\n')

  // ─── Tutorials ─────────────────────────────────────────
  const tutorials = await prisma.tutorial.findMany()
  console.log(`  Tutorials: ${tutorials.length} tutoriais encontrados`)
  for (const tut of tutorials) {
    await payload.create({
      collection: 'tutorials',
      data: {
        slug: tut.slug,
        title: { pt: tut.title, en: tut.titleEn ?? tut.title },
        description: { pt: tut.description, en: tut.descriptionEn ?? tut.description },
        contentLegacy: { pt: tut.content, en: tut.contentEn ?? tut.content },
        coverUrl: tut.coverUrl ?? undefined,
        difficulty: tut.difficulty,
        estimatedTime: tut.estimatedTime ?? undefined,
        tags: (tut.tags ?? []).map((tag: string) => ({ tag })),
        technologies: (tut.technologies ?? []).map((t: string) => ({ technology: t })),
        series: tut.seriesId ? seriesMap.get(tut.seriesId) : undefined,
        seriesOrder: tut.seriesOrder ?? undefined,
        published: tut.published,
        publishedAt: tut.publishedAt ?? undefined,
        _status: tut.published ? 'published' : 'draft',
      },
    })
  }
  console.log('  ✓ Tutorials migrados\n')

  // ─── Talks ─────────────────────────────────────────────
  const talks = await prisma.talk.findMany()
  console.log(`  Talks: ${talks.length} talks encontrados`)
  for (const talk of talks) {
    await payload.create({
      collection: 'talks',
      data: {
        slug: talk.slug,
        title: { pt: talk.title, en: talk.titleEn ?? talk.title },
        description: talk.description ? { pt: talk.description, en: talk.descriptionEn ?? talk.description } : undefined,
        event: { pt: talk.event, en: talk.eventEn ?? talk.event },
        location: talk.location ?? undefined,
        date: talk.date,
        slidesUrl: talk.slidesUrl ?? undefined,
        videoUrl: talk.videoUrl ?? undefined,
        tags: (talk.tags ?? []).map((tag: string) => ({ tag })),
        published: talk.published,
        _status: talk.published ? 'published' : 'draft',
      },
    })
  }
  console.log('  ✓ Talks migrados\n')

  // ─── Testimonials ──────────────────────────────────────
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
  console.log(`  Testimonials: ${testimonials.length} depoimentos encontrados`)
  for (const t of testimonials) {
    await payload.create({
      collection: 'testimonials',
      data: {
        name: t.name,
        role: t.role,
        company: t.company ?? undefined,
        text: { pt: t.text, en: t.textEn ?? t.text },
        avatarUrl: t.avatarUrl ?? undefined,
        linkedIn: t.linkedIn ?? undefined,
        order: t.order,
        published: t.published,
        _status: t.published ? 'published' : 'draft',
      },
    })
  }
  console.log('  ✓ Testimonials migrados\n')

  // ─── Uses ──────────────────────────────────────────────
  const uses = await prisma.useItem.findMany({ orderBy: { order: 'asc' } })
  console.log(`  Uses: ${uses.length} itens encontrados`)
  for (const u of uses) {
    await payload.create({
      collection: 'uses',
      data: {
        category: { pt: u.category, en: u.categoryEn ?? u.category },
        name: u.name,
        description: u.description ? { pt: u.description, en: u.descriptionEn ?? u.description } : undefined,
        url: u.url ?? undefined,
        order: u.order,
      },
    })
  }
  console.log('  ✓ Uses migrados\n')

  // ─── Subscribers ───────────────────────────────────────
  const subscribers = await prisma.subscriber.findMany()
  console.log(`  Subscribers: ${subscribers.length} inscritos encontrados`)
  for (const sub of subscribers) {
    await payload.create({
      collection: 'subscribers',
      data: {
        email: sub.email,
        name: sub.name ?? undefined,
        status: sub.status,
        locale: sub.locale,
        token: sub.token ?? undefined,
      },
    })
  }
  console.log('  ✓ Subscribers migrados\n')

  // ─── Site Settings (global) ────────────────────────────
  const settings = await prisma.siteSetting.findMany()
  if (settings.length > 0) {
    console.log(`  Site Settings: ${settings.length} configurações encontradas`)
    const settingsMap: Record<string, string> = {}
    for (const s of settings) {
      settingsMap[s.key] = s.value
    }
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteUrl: settingsMap['siteUrl'] ?? undefined,
        contactEmail: settingsMap['contactEmail'] ?? undefined,
        githubUrl: settingsMap['githubUrl'] ?? undefined,
        linkedinUrl: settingsMap['linkedinUrl'] ?? undefined,
        giscusRepo: settingsMap['giscusRepo'] ?? undefined,
        giscusRepoId: settingsMap['giscusRepoId'] ?? undefined,
        giscusCategory: settingsMap['giscusCategory'] ?? undefined,
        giscusCategoryId: settingsMap['giscusCategoryId'] ?? undefined,
      },
    })
    console.log('  ✓ Site Settings migrados\n')
  }

  console.log('▶ Migração concluída com sucesso!')
  await prisma.$disconnect()
}

migrate().catch((err) => {
  console.error('✗ Erro na migração:', err)
  process.exit(1)
})