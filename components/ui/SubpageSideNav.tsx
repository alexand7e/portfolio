'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from '@/components/ui/NavComponents'

const links = [
  { href: '/',          label: 'home' },
  { href: '/blog',      label: 'blog' },
  { href: '/tutoriais', label: 'tutoriais' },
  { href: '/projects',  label: 'projects' },
  { href: '/#contact',  label: 'contact' },
]

export function SubpageSideNav() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop: painel retangular fixo à esquerda ── */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-40 flex-col justify-between py-8 px-5 z-20 border-r border-accent/10 bg-primary">
        {/* Logo */}
        <Link href="/" className="text-accent font-bold text-sm tracking-widest">
          .Alexandre
        </Link>

        {/* Nav links — texto horizontal */}
        <ul className="flex flex-col gap-3">
          {links.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block text-sm capitalize transition-colors py-1 ${
                    isActive
                      ? 'text-accent font-medium'
                      : 'text-tertiary/40 hover:text-tertiary/80'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Rodapé discreto */}
        <span className="text-tertiary/20 text-[10px] tracking-widest uppercase">
          {new Date().getFullYear()}
        </span>
      </nav>

      {/* ── Mobile: top bar compacto ── */}
      <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3 bg-primary/95 backdrop-blur-sm border-b border-accent/10">
        <Link href="/" className="text-accent font-bold text-sm tracking-widest">
          .Alexandre
        </Link>
        <MobileNav />
      </header>
    </>
  )
}
