'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  maxSize?: number // em MB
  disabled?: boolean
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export default function ImageUpload({
  value,
  onChange,
  label = 'Imagem',
  accept = 'image/*',
  maxSize = 5,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isDisabled = disabled || uploading

  const handleFileSelect = useCallback(async (file: File) => {
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(`Tipo de arquivo não suportado. Use: PNG, JPG, GIF, WebP`)
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`O arquivo deve ter no máximo ${maxSize}MB`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Erro ao fazer upload da imagem')
      }
    } catch {
      setError('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }, [maxSize, onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      fileInputRef.current?.click()
    }
  }, [isDisabled])

  const handleRemove = useCallback(() => {
    onChange('')
    setError('')
    setPreviewError(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  useEffect(() => {
    setPreviewError(false)
  }, [value])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-tertiary">
        {label}
      </label>

      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-secondary rounded-lg overflow-hidden">
            {!previewError ? (
              <Image
                src={value}
                alt="Preview da imagem selecionada"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-tertiary/50">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm">Erro ao carregar imagem</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              className="bg-secondary border border-accent/30 rounded-full p-2 hover:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Alterar imagem"
              title="Alterar imagem"
            >
              <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              onKeyDown={handleKeyDown}
              className="bg-secondary border border-accent/30 rounded-full p-2 hover:border-red-500/60 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              aria-label="Remover imagem"
              title="Remover imagem"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label={`Área de upload de imagem. ${dragOver ? 'Arquivo detectado' : 'Clique ou arraste uma imagem'}`}
          aria-describedby="upload-description"
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver
              ? 'border-accent bg-accent/10'
              : 'border-accent/30 hover:border-accent/50'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!isDisabled ? handleClick : undefined}
          onKeyDown={!isDisabled ? handleKeyDown : undefined}
        >
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center" aria-live="polite">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-2" role="status" />
                <p className="text-sm text-tertiary/60">Fazendo upload...</p>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-tertiary/40"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div id="upload-description" className="flex justify-center text-sm text-tertiary/70 mt-2">
                  <span className="relative font-medium text-accent hover:text-accent/80 transition-colors">
                    Clique para fazer upload
                  </span>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-tertiary/50 mt-1">
                  PNG, JPG, GIF, WebP até {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled}
        aria-hidden="true"
        data-testid="file-input"
      />

      {error && (
        <p role="alert" className="text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
