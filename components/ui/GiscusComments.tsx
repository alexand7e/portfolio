'use client'

import { useEffect, useRef } from 'react'

export default function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    // Configurar em https://giscus.app/ com o repositório do site
    // e substituir os valores abaixo
    script.setAttribute('data-repo', 'alexand7e/portfolio')
    script.setAttribute('data-repo-id', 'R_kgDOPk0h4w')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOPk0h484C6tQV')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'pt')
    script.setAttribute('data-loading', 'lazy')

    ref.current.appendChild(script)
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold text-tertiary mb-6">Comentários</h2>
      <div ref={ref} />
    </div>
  )
}
