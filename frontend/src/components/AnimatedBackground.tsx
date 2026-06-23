import { useEffect, useRef } from 'react'

/**
 * Lightweight living background. Only 2 GPU-cheap drifting gradients + a
 * throttled cursor spotlight. No conic blur, no particles, no DOM-heavy noise.
 * Targets 120fps on modern hardware.
 */
export function AnimatedBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    let lastT = 0
    const THROTTLE_MS = 32 // ~30Hz mouse updates is enough for a spotlight

    const handle = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastT < THROTTLE_MS) return
      lastT = now
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = spotlightRef.current
        if (!el) return
        el.style.setProperty('--mx', `${e.clientX}px`)
        el.style.setProperty('--my', `${e.clientY}px`)
      })
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handle)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ contain: 'strict' }}
    >
      {/* Base */}
      <div className="absolute inset-0 bg-[color:var(--color-mowi-cream)] dark:bg-[#08080A] transition-colors duration-500" />

      {/* Two cheap drifting gradients (no filter blur, just radial gradient) */}
      <div
        className="animate-blob absolute -top-[20vw] -left-[10vw] w-[60vw] h-[60vw] rounded-full opacity-70 dark:opacity-60"
        style={{
          background:
            'radial-gradient(circle at center, rgba(250, 204, 21, 0.45), rgba(250, 204, 21, 0) 60%)',
          transform: 'translate3d(0,0,0)',
        }}
      />
      <div
        className="animate-blob-slow absolute -bottom-[25vw] -right-[10vw] w-[65vw] h-[65vw] rounded-full opacity-60 dark:opacity-50"
        style={{
          background:
            'radial-gradient(circle at center, rgba(234, 179, 8, 0.4), rgba(234, 179, 8, 0) 60%)',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Cursor spotlight (one-element, GPU-cheap) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(250, 204, 21, 0.14), transparent 55%)',
          willChange: 'background',
        }}
      />
    </div>
  )
}
