'use client'

import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminNav from '@/components/admin/AdminNav'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Check if we're on the login page using usePathname hook
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login')

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (isLoginPage) return // Don't redirect if on login page
    
    if (!session) {
      router.push('/admin/login')
      return
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/admin/login')
      return
    }
  }, [session, status, router, isLoginPage])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <div className="text-lg text-tertiary">Carregando...</div>
        </div>
      </div>
    )
  }

  // Allow login page to render even without session
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-primary">
        {children}
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-primary">
      <AdminNav />
      
      {/* Main content with consistent spacing and layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}