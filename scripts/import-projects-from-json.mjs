import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {PrismaClient | null} */
let prisma = null;

async function loadEnv() {
  const candidates = ['.env.local', '.env'];
  for (const f of candidates) {
    try {
      const p = path.resolve(__dirname, '..', f);
      const content = await readFile(p, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!(key in process.env)) {
          process.env[key] = val;
        }
      }
    } catch (_) {
      /* ignore missing */
    }
  }
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 70);
}

async function ensureUniqueSlug(base, existing) {
  let slug = base || 'project';
  let idx = 1;
  // Check both in-memory and database uniqueness
  // First ensure not duplicated in the current batch
  while (existing.has(slug)) {
    slug = `${base}-${idx++}`;
  }
  // Then ensure not duplicated in DB
  // Try a few times to avoid excessive queries
  let probe = slug;
  idx = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.project.findUnique({ where: { slug: probe } }).catch(() => null);
    if (!found) {
      return probe;
    }
    probe = `${slug}-${idx++}`;
  }
}

async function main() {
  await loadEnv();
  prisma = new PrismaClient();
  const jsonPath = path.resolve(__dirname, '..', 'projects.json');
  const raw = await readFile(jsonPath, 'utf-8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data?.projects)) {
    throw new Error('projects.json inválido: campo "projects" não encontrado');
  }

  const items = data.projects;

  // Remove todos os projetos atuais
  await prisma.project.deleteMany({});

  const usedSlugs = new Set();
  let created = 0;

  for (const p of items) {
    const title = p.title ?? p.raw?.name ?? 'Projeto';
    const description = p.pitch ?? p.raw?.description ?? '';
    const technologies = Array.isArray(p.technologies) ? p.technologies : [];
    const githubUrl = p.raw?.url ?? null;
    const demoUrl = null;
    const imageUrl = null;
    const featured = !!p.showcase;
    const status = 'PUBLISHED';

    const baseSlug = slugify(title);
    const slug = await ensureUniqueSlug(baseSlug || slugify(String(Date.now())), usedSlugs);
    usedSlugs.add(slug);

    await prisma.project.create({
      data: {
        slug,
        title,
        titleEn: null,
        description,
        descriptionEn: null,
        content: '',
        contentEn: '',
        imageUrl,
        coverImage: null,
        demoUrl,
        githubUrl,
        technologies,
        featured,
        status
      }
    });
    created += 1;
  }

  console.log(`Importação concluída: ${created} projetos criados a partir de projects.json`);
}

main()
  .catch((e) => {
    console.error('Falha ao importar projetos:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
