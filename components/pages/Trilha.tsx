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

  const totals = {
    talks: talks.length,
    events: new Set(talks.map((t) => t.event)).size,
    places: new Set(talks.map((t) => t.location).filter(Boolean)).size,
  };

  const items = talks.slice(0, 24).map((t) => ({
    slug: t.slug,
    title: t.title,
    titleEn: t.titleEn,
    event: t.event,
    eventEn: t.eventEn,
    location: t.location,
    date: t.date.toISOString(),
    coverImage: t.coverImage,
    tags: t.tags,
    slidesUrl: t.slidesUrl,
    videoUrl: t.videoUrl,
  }));

  return <TrilhaStrip id={id} items={items} totals={totals} />;
}
