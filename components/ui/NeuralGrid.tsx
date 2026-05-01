'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const CELL = 64

interface PulseData {
  id: number
  horizontal: boolean
  pos: number
  linePos: number
  opacity: number
  speed: number
}

export function NeuralGrid() {
  const nextId = useRef(0)
  const [pulses, setPulses] = useState<PulseData[]>([])
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1024, h: typeof window !== 'undefined' ? window.innerHeight : 768 })

  useEffect(() => {
    function resize() {
      setSize({ w: window.innerWidth, h: window.innerHeight })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const spawn = useCallback(() => {
    setPulses(prev => {
      if (prev.length >= 10) return prev
      const { w, h } = { w: window.innerWidth, h: window.innerHeight }
      const horizontal = Math.random() > 0.5
      const newPulse: PulseData = {
        id: nextId.current++,
        horizontal,
        pos: -120,
        linePos: horizontal
          ? Math.floor(Math.random() * Math.ceil(h / CELL)) * CELL
          : Math.floor(Math.random() * Math.ceil(w / CELL)) * CELL,
        opacity: 0.4 + Math.random() * 0.5,
        speed: 1.5 + Math.random() * 2,
      }
      return [...prev, newPulse]
    })
  }, [])

  useEffect(() => {
    let rafId = 0
    let lastSpawn = 0

    function tick(ts: number) {
      setPulses(prev => {
        const { w, h } = { w: window.innerWidth, h: window.innerHeight }
        const next: PulseData[] = []
        for (const p of prev) {
          const newPos = p.pos + p.speed
          const limit = p.horizontal ? w + 120 : h + 120
          if (newPos < limit) {
            next.push({ ...p, pos: newPos })
          }
        }
        return next
      })

      if (ts - lastSpawn > 600) {
        spawn()
        lastSpawn = ts
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [spawn])

  const gridSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="${CELL}"><line x1="0" y1="0" x2="${CELL}" y2="0" stroke="rgba(0,255,153,0.15)" stroke-width="0.5"/><line x1="0" y1="0" x2="0" y2="${CELL}" stroke="rgba(0,255,153,0.15)" stroke-width="0.5"/></svg>`)}`

  return (
    <>
      {/* Grid pattern via SVG inline */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url("${gridSvg}")`,
          backgroundSize: `${CELL}px ${CELL}px`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Pulsos como divs absolutas */}
      {pulses.map(p => {
        if (p.horizontal) {
          return (
            <div
              key={p.id}
              style={{
                position: 'fixed',
                top: p.linePos,
                left: Math.max(0, p.pos - 120),
                width: Math.min(240, p.pos + 120),
                height: 1,
                background: `linear-gradient(to right, rgba(0,255,153,0), rgba(0,255,153,${p.opacity}))`,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )
        }
        return (
          <div
            key={p.id}
            style={{
              position: 'fixed',
              left: p.linePos,
              top: Math.max(0, p.pos - 120),
              width: 1,
              height: Math.min(240, p.pos + 120),
              background: `linear-gradient(to bottom, rgba(0,255,153,0), rgba(0,255,153,${p.opacity}))`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )
      })}
    </>
  )
}
