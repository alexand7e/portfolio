import '@testing-library/jest-dom'

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockedImage({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    className?: string
    sizes?: string
    onError?: () => void
    onLoad?: () => void
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/admin'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock do next-auth/react
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: '2030-01-01T00:00:00.000Z',
      },
      status: 'authenticated',
    }
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}))

// Mock do fetch global
const mockFetch = jest.fn()
global.fetch = mockFetch

// Limpar mocks entre testes
afterEach(() => {
  mockFetch.mockClear()
})
