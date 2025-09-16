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
  const isLoginPage = pathname === '/admin/login'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
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
    <div className="min-h-screen bg-secondary">
      <AdminNav />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-tertiary">
        <div className="max-w-6xl">
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