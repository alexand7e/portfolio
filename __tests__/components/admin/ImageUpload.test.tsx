import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ImageUpload from '@/components/admin/ImageUpload'

describe('ImageUpload', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('deve renderizar o label corretamente', () => {
    render(<ImageUpload onChange={mockOnChange} label="Foto de perfil" />)
    expect(screen.getByText('Foto de perfil')).toBeInTheDocument()
  })

  it('deve renderizar com label padrão quando não fornecido', () => {
    render(<ImageUpload onChange={mockOnChange} />)
    expect(screen.getByText('Imagem')).toBeInTheDocument()
  })

  it('deve mostrar a área de upload quando não há valor', () => {
    render(<ImageUpload onChange={mockOnChange} />)
    const uploadArea = screen.getByRole('button', { name: /Área de upload/i })
    expect(uploadArea).toBeInTheDocument()
    expect(screen.getByText(/Clique para fazer upload/i)).toBeInTheDocument()
    expect(screen.getByText(/ou arraste e solte/i)).toBeInTheDocument()
  })

  it('deve mostrar preview quando há valor', () => {
    render(<ImageUpload value="https://example.com/image.jpg" onChange={mockOnChange} />)
    expect(screen.getByAltText('Preview da imagem selecionada')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alterar imagem' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover imagem' })).toBeInTheDocument()
  })

  it('deve chamar onChange com string vazia ao remover imagem', () => {
    render(<ImageUpload value="https://example.com/image.jpg" onChange={mockOnChange} />)

    const removeButton = screen.getByRole('button', { name: 'Remover imagem' })
    fireEvent.click(removeButton)

    expect(mockOnChange).toHaveBeenCalledWith('')
  })

  it('deve mostrar erro ao exceder tamanho máximo', () => {
    render(<ImageUpload onChange={mockOnChange} maxSize={1} />)

    const largeFile = new File(['a'.repeat(2 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('file-input') as HTMLInputElement

    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(screen.getByRole('alert')).toHaveTextContent(/máximo 1MB/i)
  })

  it('deve fazer upload com sucesso', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ url: 'https://example.com/uploaded.jpg' }) }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    render(<ImageUpload onChange={mockOnChange} maxSize={5} />)

    const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('file-input')

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/upload', expect.any(Object))
      expect(mockOnChange).toHaveBeenCalledWith('https://example.com/uploaded.jpg')
    })
  })

  it('deve mostrar erro quando upload falha', async () => {
    const mockResponse = { ok: false, json: () => Promise.resolve({ error: 'Erro no servidor' }) }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    render(<ImageUpload onChange={mockOnChange} maxSize={5} />)

    const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('file-input')

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Erro no servidor')
    })
  })

  it('deve mostrar estado de uploading', async () => {
    let resolveFetch: (value: unknown) => void
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve
    })
    ;(global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise)

    render(<ImageUpload onChange={mockOnChange} maxSize={5} />)

    const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('file-input')

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(screen.getByText('Fazendo upload...')).toBeInTheDocument()

    await act(async () => {
      resolveFetch!({ ok: true, json: () => Promise.resolve({ url: 'https://example.com/uploaded.jpg' }) })
    })

    await waitFor(() => {
      expect(screen.queryByText('Fazendo upload...')).not.toBeInTheDocument()
    })
  })

  it('deve ser desabilitado quando disabled=true', () => {
    render(<ImageUpload onChange={mockOnChange} disabled />)
    const uploadArea = screen.getByRole('button', { name: /Área de upload/i })
    expect(uploadArea).toHaveAttribute('tabindex', '-1')
  })

  it('deve suportar drag and drop', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ url: 'https://example.com/dropped.jpg' }) }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    render(<ImageUpload onChange={mockOnChange} maxSize={5} />)

    const uploadArea = screen.getByRole('button', { name: /Área de upload/i })

    const file = new File(['drag content'], 'drop.jpg', { type: 'image/jpeg' })
    const dataTransfer = { files: [file] }

    await act(async () => {
      fireEvent.drop(uploadArea, { dataTransfer })
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/upload', expect.any(Object))
      expect(mockOnChange).toHaveBeenCalledWith('https://example.com/dropped.jpg')
    })
  })
})
