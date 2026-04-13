'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect, useRef, useCallback } from 'react'

interface NavItemProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}

function NavItem({ href, children, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
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

function MobileNavItem({ href, children, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${
        isActive
          ? 'bg-accent/10 text-accent border-l-2 border-accent'
          : 'text-tertiary hover:bg-accent/5 hover:text-accent border-l-2 border-transparent'
      } block px-4 py-2.5 text-sm font-medium transition-colors`}
    >
      {children}
    </Link>
  )
}

export default function AdminNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = useCallback(() => setMobileOpen(false), [])

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  // Fechar menu ao clicar fora
  useEffect(() => {
    if (!mobileOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  // Fechar menu com tecla Escape
  useEffect(() => {
    if (!mobileOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        hamburgerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileOpen])

  // Travar scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

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
    <nav className="bg-primary border-b border-accent/20 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + desktop nav */}
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

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:block text-sm text-tertiary/70">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="hidden sm:block bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sair
            </button>

            {/* Hamburger (mobile only) */}
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="sm:hidden p-2 rounded-lg text-tertiary hover:text-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="border-t border-accent/20 bg-primary">
          <div className="py-1">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
                onClick={closeMobileMenu}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-accent/10 flex items-center justify-between">
            <span className="text-xs text-tertiary/50 truncate">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-accent hover:bg-accent/90 text-primary px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
