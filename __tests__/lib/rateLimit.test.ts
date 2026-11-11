/**
 * @jest-environment node
 */
import { clientIp, createRateLimiter } from '@/lib/rateLimit'

describe('createRateLimiter', () => {
  it('bloqueia acima do limite e informa quando liberar', () => {
    const check = createRateLimiter({ limit: 2, windowMs: 60_000 })
    expect(check('1.1.1.1', 0).ok).toBe(true)
    expect(check('1.1.1.1', 1_000).ok).toBe(true)

    const blocked = check('1.1.1.1', 2_000)
    expect(blocked).toEqual({ ok: false, retryAfter: 58 })

    expect(check('1.1.1.1', 60_001).ok).toBe(true)
  })

  it('conta cada IP separadamente', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 60_000 })
    expect(check('1.1.1.1', 0).ok).toBe(true)
    expect(check('2.2.2.2', 0).ok).toBe(true)
    expect(check('1.1.1.1', 10).ok).toBe(false)
  })

  it('descarta a chave menos recente ao passar do teto de chaves', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 2 })
    check('a', 0)
    check('b', 0)
    check('c', 0)
    // 'a' foi esquecida, então volta a passar
    expect(check('a', 10).ok).toBe(true)
  })
})

describe('clientIp', () => {
  const req = (headers: Record<string, string>) => new Request('http://localhost/api/search', { headers })

  it('prefere o X-Real-Ip definido pelo proxy', () => {
    expect(clientIp(req({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '6.6.6.6, 9.9.9.9' }))).toBe('9.9.9.9')
  })

  it('sem X-Real-Ip, usa o último salto do X-Forwarded-For', () => {
    expect(clientIp(req({ 'x-forwarded-for': '6.6.6.6, 7.7.7.7' }))).toBe('7.7.7.7')
  })

  it('sem cabeçalhos, agrupa em "unknown"', () => {
    expect(clientIp(req({}))).toBe('unknown')
  })
})
