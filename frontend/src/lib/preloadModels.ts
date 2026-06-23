import { findProduct } from '../data/products'

/* Only prefetch the carousel models — and only after a 4s idle delay so the
 * initial page load isn't blocked by ~12MB of GLB downloads. This keeps
 * Lighthouse LCP / Total Blocking Time small while still making subsequent
 * carousel navigation feel instant. */
const CAROUSEL_IDS = ['rog-strix-scar-17', 'iphone-16-pro-max', 'airpods-pro']

export function schedulePrefetchModels() {
  if (typeof window === 'undefined') return

  const paths = CAROUSEL_IDS.map((id) => findProduct(id)?.modelPath).filter(
    (x): x is string => typeof x === 'string',
  )

  const run = () => {
    paths.forEach((path) => {
      fetch(path, { credentials: 'same-origin' }).catch(() => {
        /* silent — best-effort */
      })
    })
  }

  // Wait 4s after page load, then idle, then prefetch
  setTimeout(() => {
    if ('requestIdleCallback' in window) {
      ;(window as Window & typeof globalThis).requestIdleCallback(run, { timeout: 6000 })
    } else {
      run()
    }
  }, 4000)
}
