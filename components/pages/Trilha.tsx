import { prisma } from "@/lib/prisma";
import TrilhaStrip from "@/components/ui/TrilhaStrip";

// Server component: busca as aulas e entrega ja serializado para a faixa,
// que e client por causa da interacao. Se nao houver aula publicada, a
// secao inteira some da home em vez de aparecer vazia.
export default async function Trilha({ id }: { id?: string }) {
  const talks = await prisma.talk.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  if (talks.length === 0) return null;

  // Conta repositorios distintos, nao URLs: o mesmo repo aparece uma vez
  // pela raiz e outra apontando para um branch.
  const repoKey = (url: string) => {
    try {
      const [owner, name] = new URL(url).pathname.split("/").filter(Boolean);
      return owner && name ? `${owner}/${name}` : url;
    } catch {
      return url;
    }
  };

  const totals = {
    talks: talks.length,
    events: new Set(talks.map((t) => t.event)).size,
    repos: new Set(talks.flatMap((t) => t.repos).map(repoKey)).size,
  };

  const items = talks.slice(0, 24).map((t) => ({
    slug: t.slug,
    title: t.title,
    titleEn: t.titleEn,
    description: t.description,
    descriptionEn: t.descriptionEn,
    event: t.event,
    eventEn: t.eventEn,
    date: t.date.toISOString(),
    tags: t.tags,
    slidesUrl: t.slidesUrl,
    repos: t.repos,
  }));

  return <TrilhaStrip id={id} items={items} totals={totals} />;
}
