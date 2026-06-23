import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver-based reveal hook. `once: true` (default) means once it
 * fires `inView=true` it stays true (good for fade-up animations that should
 * not repeat on scroll-back).
 */
export function useInView<T extends HTMLElement>(
  threshold: number = 0.2,
  once: boolean = true,
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])

  return { ref, inView }
}
