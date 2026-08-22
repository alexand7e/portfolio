import { prisma } from "@/lib/prisma";
import { googleFileId, thumbnailUrl } from "@/lib/slides";

// Um dia de cache na borda; uma semana servindo o antigo enquanto revalida.
const DAY = 60 * 60 * 24;
// Precisa ser literal: o Next analisa este export estaticamente e rejeita
// referencia a outra constante.
export const revalidate = 86400;

const MAX_BYTES = 5 * 1024 * 1024;

// Cache em memoria do processo, para nao bater no Google a cada request
// que escapar do cache HTTP.
type Entry = { body: ArrayBuffer; type: string; at: number };
const memo = new Map<string, Entry>();

const headers = (type: string) => ({
  "Content-Type": type,
  "Cache-Control": `public, max-age=${DAY}, stale-while-revalidate=${DAY * 7}`,
});

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const cached = memo.get(slug);
  if (cached && Date.now() - cached.at < DAY * 1000) {
    return new Response(cached.body, { headers: headers(cached.type) });
  }

  const talk = await prisma.talk.findUnique({
    where: { slug },
    select: { slidesUrl: true, published: true },
  });

  if (!talk?.published) return new Response(null, { status: 404 });

  const fileId = googleFileId(talk.slidesUrl);
  if (!fileId) return new Response(null, { status: 404 });

  try {
    const upstream = await fetch(thumbnailUrl(fileId), {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    const type = upstream.headers.get("content-type") ?? "";
    // Apresentacao restrita devolve HTML de login, nao imagem.
    if (!upstream.ok || !type.startsWith("image/")) {
      return new Response(null, { status: 404 });
    }

    const body = await upstream.arrayBuffer();
    if (body.byteLength > MAX_BYTES) return new Response(null, { status: 404 });

    memo.set(slug, { body, type, at: Date.now() });
    return new Response(body, { headers: headers(type) });
  } catch {
    return new Response(null, { status: 404 });
  }
}
