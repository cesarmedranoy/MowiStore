import { useEffect, useRef, useState } from 'react'

type Tilt = { rx: number; ry: number; px: number; py: number; active: boolean }

/**
 * Mouse-tracked 3D tilt. Returns a ref to bind to the tilt container and the
 * computed tilt state. `max` controls how many degrees of rotation at the edges.
 */
export function useMouseTilt<T extends HTMLElement>(max = 12) {
  const ref = useRef<T | null>(null)
  const [tilt, setTilt] = useState<Tilt>({ rx: 0, ry: 0, px: 50, py: 50, active: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const px = (x / rect.width) * 100
        const py = (y / rect.height) * 100
        // -1..1 from center
        const nx = (x / rect.width) * 2 - 1
        const ny = (y / rect.height) * 2 - 1
        setTilt({
          ry: nx * max,
          rx: -ny * max,
          px,
          py,
          active: true,
        })
      })
    }
    const handleLeave = () => {
      cancelAnimationFrame(frame)
      setTilt({ rx: 0, ry: 0, px: 50, py: 50, active: false })
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(frame)
    }
  }, [max])

  return { ref, tilt }
}
