import { lazy, Suspense } from 'react'
import { ModelPlaceholder } from './ModelPlaceholder'

const Viewer = lazy(() =>
  import('./Model3DViewer').then((m) => ({ default: m.Model3DViewer })),
)

/**
 * Wraps Model3DViewer in React.lazy so three.js / R3F / drei (~300KB gzipped)
 * are only fetched when a product with `modelPath` is actually shown.
 */
export function LazyModel3DViewer({
  modelPath,
  mtlPath,
  accent = '#FACC15',
  autoRotate = true,
  className = '',
}: {
  modelPath: string
  mtlPath?: string
  accent?: string
  autoRotate?: boolean
  className?: string
}) {
  return (
    <Suspense
      fallback={
        <ModelPlaceholder accent={accent} className={className}>
          Cargando viewer 3D…
        </ModelPlaceholder>
      }
    >
      <Viewer
        modelPath={modelPath}
        mtlPath={mtlPath}
        accent={accent}
        autoRotate={autoRotate}
        className={className}
      />
    </Suspense>
  )
}
