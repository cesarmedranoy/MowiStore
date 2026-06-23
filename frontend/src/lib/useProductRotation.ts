import { useCallback, useEffect, useRef, useState } from 'react'

export type Rotation = { rx: number; ry: number }

type Options = {
  autoRotate?: boolean
  autoRotateSpeed?: number // degrees per frame (~60fps)
  initial?: Rotation
}

/**
 * Drag-to-rotate hook with optional idle auto-rotation. Designed for the
 * Product3D rotator. Tracks pointer drag deltas in screen space and maps them
 * to Y/X rotation. Y axis is unbounded (full 360°), X is clamped to ±35°.
 */
export function useProductRotation({
  autoRotate = true,
  autoRotateSpeed = 0.15,
  initial = { rx: -10, ry: 0 },
}: Options = {}) {
  const [rotation, setRotation] = useState<Rotation>(initial)
  const [dragging, setDragging] = useState(false)
  const draggingRef = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const speedRef = useRef(autoRotateSpeed)
  speedRef.current = autoRotateSpeed

  useEffect(() => {
    if (!autoRotate) return
    let frame = 0
    const tick = () => {
      if (!draggingRef.current) {
        setRotation((r) => ({ ...r, ry: r.ry + speedRef.current }))
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [autoRotate])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    draggingRef.current = true
    setDragging(true)
    last.current = { x: e.clientX, y: e.clientY }
    try {
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
    } catch {
      /* ignore */
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!draggingRef.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setRotation((r) => ({
      rx: Math.max(-35, Math.min(35, r.rx - dy * 0.4)),
      ry: r.ry + dx * 0.55,
    }))
  }, [])

  const endDrag = useCallback((e?: React.PointerEvent<HTMLElement>) => {
    draggingRef.current = false
    setDragging(false)
    if (e) {
      try {
        ;(e.target as Element).releasePointerCapture?.(e.pointerId)
      } catch {
        /* ignore */
      }
    }
  }, [])

  const reset = useCallback(() => setRotation(initial), [initial])

  return {
    rotation,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: () => endDrag(),
      onPointerCancel: () => endDrag(),
    },
    reset,
  }
}
