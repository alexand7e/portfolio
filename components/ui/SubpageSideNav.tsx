'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from '@/components/ui/NavComponents'

const links = [
  { href: '/',         label: 'home' },
  { href: '/blog',     label: 'blog' },
  { href: '/tutoriais',label: 'tutoriais' },
  { href: '/projects', label: 'projects' },
  { href: '/#contact', label: 'contact' },
]

export function SubpageSideNav() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop: barra fixa à esquerda ── */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-12 flex-col items-center justify-between py-8 z-20 border-r border-accent/10 bg-primary/95 backdrop-blur-sm">
        {/* Logo */}
        <Link
          href="/"
          className="text-accent font-bold text-xs tracking-widest select-none"
          title="Início"
        >
          .AB
        </Link>

        {/* Nav links — texto vertical */}
        <ul className="flex flex-col items-center gap-6">
          {links.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-[10px] uppercase tracking-[0.18em] transition-colors
                    [writing-mode:vertical-rl] rotate-180
                    ${isActive ? 'text-accent' : 'text-tertiary/30 hover:text-tertiary/70'}`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Espaçador de rodapé */}
        <div className="w-px h-8 bg-accent/10" />
      </nav>

      {/* ── Mobile: top bar compacto ── */}
      <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3 bg-primary/95 backdrop-blur-sm border-b border-accent/10">
        <Link href="/" className="text-accent font-bold text-sm tracking-widest">
          .AB
        </Link>
        <MobileNav />
      </header>
    </>
  )
}
