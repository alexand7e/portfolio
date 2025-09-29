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
          ? 'bg-accent/10 text-accent border-accent/30'
          : 'text-tertiary/80 hover:text-accent hover:bg-accent/5 border-transparent'
      } px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200`}
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
    { href: '/admin/projects', label: 'Projetos' },
    { href: '/admin/experiences', label: 'Experiências' }
  ]

  return (
    <nav className="bg-secondary/50 backdrop-blur-sm border-b border-accent/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">A</span>
                </div>
                <h1 className="text-xl font-bold text-tertiary">Admin Panel</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
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

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-tertiary">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-tertiary/60">
                {session?.user?.email}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary/60 hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/5"
                title="Ver site"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-accent/20 hover:border-accent/40"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}