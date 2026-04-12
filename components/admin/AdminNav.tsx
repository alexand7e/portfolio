'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

interface NavItemProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
}

function NavItem({ href, children, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`${
        isActive
          ? 'border-accent text-accent'
          : 'border-transparent text-tertiary hover:text-accent hover:border-accent/50'
      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
    >
      {children}
    </Link>
  )
}

export default function AdminNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/blog', label: 'Blog' },
    { href: '/admin/tutorials', label: 'Tutoriais' },
    { href: '/admin/talks', label: 'Talks' },
    { href: '/admin/newsletter', label: 'Newsletter' },
    { href: '/admin/testimonials', label: 'Depoimentos' },
    { href: '/admin/projects', label: 'Projetos' },
    { href: '/admin/experiences', label: 'Experiências' },
    { href: '/admin/settings', label: 'Configurações' },
  ]

  return (
    <nav className="bg-primary border-b border-accent/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-accent">Admin Panel</h1>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  isActive={pathname === item.href}
                >
                  {item.label}
                </NavItem>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-tertiary/70">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}