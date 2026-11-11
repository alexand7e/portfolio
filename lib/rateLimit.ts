// Rate limit em memória, janela deslizante por chave (normalmente o IP).
// Vale por instância: o stack roda uma réplica só. Com mais réplicas, mover
// para Redis ou para um middleware de rate limit no Traefik.

type Options = { limit: number; windowMs: number; maxKeys?: number };

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: Options) {
  const buckets = new Map<string, number[]>();

  return function check(key: string, now = Date.now()) {
    const recent = (buckets.get(key) ?? []).filter((hit) => now - hit < windowMs);

    // Reinsere para manter o Map em ordem de uso: o primeiro é o menos recente.
    buckets.delete(key);

    if (recent.length >= limit) {
      buckets.set(key, recent);
      return { ok: false, retryAfter: Math.ceil((recent[0] + windowMs - now) / 1000) };
    }

    recent.push(now);
    buckets.set(key, recent);

    // Teto de chaves para um flood de IPs distintos não crescer a memória sem limite.
    if (buckets.size > maxKeys) {
      const oldest = buckets.keys().next().value;
      if (oldest !== undefined) buckets.delete(oldest);
    }

    return { ok: true, retryAfter: 0 };
  };
}

// Atrás do Traefik, X-Real-Ip vem do proxy (cabeçalhos X-Forwarded-* do cliente
// são descartados por padrão). Sem proxy, cai no último salto do X-Forwarded-For.
export function clientIp(req: Request) {
  return (
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ||
    'unknown'
  );
}
