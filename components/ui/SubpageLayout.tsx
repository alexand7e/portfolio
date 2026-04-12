'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from '@/components/ui/NavComponents'
import type { ReactNode } from 'react'

const links = [
  { href: '/',          label: 'home' },
  { href: '/blog',      label: 'blog' },
  { href: '/tutoriais', label: 'tutoriais' },
  { href: '/projects',  label: 'projects' },
  { href: '/#contact',  label: 'contact' },
]

function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col justify-between w-44 shrink-0 sticky top-0 h-screen border-r border-accent/10 bg-primary px-6 py-8">
      <Link href="/" className="text-accent font-bold text-sm tracking-widest">
        .Alexandre
      </Link>

      <nav>
        <ul className="space-y-3">
          {links.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block text-sm capitalize py-1 transition-colors ${
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
      </nav>

      <span className="text-tertiary/20 text-[10px] tracking-widest uppercase">
        {new Date().getFullYear()}
      </span>
    </aside>
  )
}

export function SubpageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile: top bar compacto */}
      <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3 bg-primary/95 backdrop-blur-sm border-b border-accent/10">
        <Link href="/" className="text-accent font-bold text-sm tracking-widest">
          .Alexandre
        </Link>
        <MobileNav />
      </header>

      {/* Desktop: duas colunas — nav à esquerda, conteúdo à direita */}
      <div className="lg:flex">
        <SideNav />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
