import { lazy, Suspense } from 'react'

const InnerCanvas = lazy(() =>
  import('./ProductCardModelCanvas').then((m) => ({ default: m.ProductCardModelCanvas })),
)

/**
 * 3D model preview for catalog cards. Only mounts when `active` is true (i.e.
 * the user is hovering or has touched the card). Otherwise it renders nothing,
 * keeping the page idle — no WebGL contexts, no animation frames, no GPU work.
 */
export function ProductCardModel({
  modelPath,
  accent,
  active,
}: {
  modelPath: string
  accent: string
  active: boolean
}) {
  if (!active) return null
  return (
    <div className="absolute inset-0 animate-fade-in">
      <Suspense fallback={null}>
        <InnerCanvas modelPath={modelPath} accent={accent} />
      </Suspense>
    </div>
  )
}
