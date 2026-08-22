// Preview das apresentacoes: extrai o id do arquivo no Google e monta a
// URL de miniatura. Só estes dois hosts sao aceitos — o id vem do banco,
// mas a lista evita que uma URL qualquer vire requisicao de saida.
const ALLOWED_HOSTS = ["docs.google.com", "drive.google.com"];

export function googleFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) return null;
    const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Endpoint de miniatura do Drive: serve para Slides, Docs e arquivos
// soltos. So responde se o arquivo estiver compartilhado publicamente.
export function thumbnailUrl(fileId: string, width = 800) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}
