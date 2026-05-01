import { render, screen, fireEvent } from '@testing-library/react'
import AdminNav from '@/components/admin/AdminNav'

// Mock específico para o AdminNav
const mockSignOut = jest.fn()
const mockUsePathname = jest.fn()
const mockUseSession = jest.fn()

jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('AdminNav', () => {
  beforeEach(() => {
    mockSignOut.mockClear()
    mockUsePathname.mockReturnValue('/admin')
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: '2030-01-01T00:00:00.000Z',
      },
      status: 'authenticated',
    })
  })

  it('deve renderizar o logo do Admin Panel', () => {
    render(<AdminNav />)
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('deve renderizar todos os itens de navegação desktop', () => {
    render(<AdminNav />)

    const navItems = ['Dashboard', 'Blog', 'Tutoriais', 'Talks', 'Newsletter', 'Depoimentos', 'Projetos', 'Experiências', 'Configurações']

    navItems.forEach((item) => {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    })
  })

  it('deve destacar o item ativo', () => {
    mockUsePathname.mockReturnValue('/admin/blog')
    render(<AdminNav />)

    const blogLinks = screen.getAllByText('Blog')
    // O primeiro link é o desktop (não está dentro de sm:hidden)
    const desktopBlogLink = blogLinks[0].closest('a')

    expect(desktopBlogLink).toHaveClass('border-accent')
    expect(desktopBlogLink).toHaveClass('text-accent')
  })

  it('deve mostrar o email do usuário logado', () => {
    render(<AdminNav />)
    const emailSpans = screen.getAllByText('test@example.com')
    expect(emailSpans.length).toBeGreaterThanOrEqual(1)
  })

  it('deve chamar signOut ao clicar em Sair (desktop)', () => {
    render(<AdminNav />)

    const logoutButtons = screen.getAllByRole('button', { name: 'Sair' })
    const desktopButton = logoutButtons[0]
    fireEvent.click(desktopButton)

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/admin/login' })
  })

  it('deve abrir o menu mobile ao clicar no hamburger', () => {
    render(<AdminNav />)

    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    expect(hamburgerButton).toBeInTheDocument()

    fireEvent.click(hamburgerButton)

    expect(screen.getByRole('button', { name: /Fechar menu/i })).toBeInTheDocument()
  })

  it('deve mostrar itens de navegação no menu mobile quando aberto', () => {
    render(<AdminNav />)

    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    fireEvent.click(hamburgerButton)

    const mobileMenu = document.getElementById('mobile-menu')
    expect(mobileMenu).toBeInTheDocument()

    // Usar getAllByText pois existem itens desktop e mobile com mesmo texto
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Blog').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Projetos').length).toBeGreaterThanOrEqual(2)
  })

  it('deve fechar o menu mobile ao clicar em um item', () => {
    render(<AdminNav />)

    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    fireEvent.click(hamburgerButton)

    // Verificar menu aberto
    expect(screen.getByRole('button', { name: /Fechar menu/i })).toBeInTheDocument()

    // Clicar em um item do menu mobile
    // Os itens mobile estão dentro do mobile-menu, pegamos pelo getAllByText e clicamos no que está visível
    const blogLinks = screen.getAllByText('Blog')
    // O segundo link é o mobile (está dentro do menu mobile)
    fireEvent.click(blogLinks[1])

    // Aguardar o fechamento do menu
    expect(screen.queryByRole('button', { name: /Fechar menu/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Abrir menu/i })).toBeInTheDocument()
  })

  it('deve ter aria-expanded correto no hamburger', () => {
    render(<AdminNav />)

    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(hamburgerButton)

    expect(screen.getByRole('button', { name: /Fechar menu/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('deve ter aria-controls apontando para mobile-menu', () => {
    render(<AdminNav />)
    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu')
  })

  it('deve mostrar botão de logout no menu mobile', () => {
    render(<AdminNav />)

    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    fireEvent.click(hamburgerButton)

    const logoutButtons = screen.getAllByRole('button', { name: 'Sair' })
    expect(logoutButtons.length).toBeGreaterThanOrEqual(2) // Desktop + Mobile
  })

  it('deve chamar signOut ao clicar em Sair (mobile)', () => {
    render(<AdminNav />)

    // Abrir menu mobile
    const hamburgerButton = screen.getByRole('button', { name: /Abrir menu/i })
    fireEvent.click(hamburgerButton)

    // Clicar logout mobile
    const logoutButtons = screen.getAllByRole('button', { name: 'Sair' })
    const mobileButton = logoutButtons[1]
    fireEvent.click(mobileButton)

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/admin/login' })
  })
})
