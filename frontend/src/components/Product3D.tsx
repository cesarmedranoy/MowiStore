import { type ReactNode } from 'react'
import { useProductRotation } from '../lib/useProductRotation'

export type Face = {
  /** Where this face sits around the Y axis. 0 = front, 90 = right, 180 = back, -90 = left */
  rotateY: number
  /** Distance from the rotation center. Bigger = thicker object */
  depth?: number
  render: (ctx: { dragging: boolean }) => ReactNode
}

/**
 * Multi-face 3D rotator. Drag horizontally → orbit Y. Drag vertically → tilt X.
 * Double-click resets. Auto-rotates slowly when idle.
 */
export function Product3D({
  faces,
  className = '',
  glowColor,
  autoRotate = true,
  contained = true,
}: {
  faces: Face[]
  className?: string
  glowColor?: string
  autoRotate?: boolean
  contained?: boolean
}) {
  const { rotation, dragging, handlers, reset } = useProductRotation({ autoRotate })

  return (
    <div
      className={`relative select-none touch-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: '1600px',
        contain: contained ? 'layout style paint' : undefined,
      }}
      {...handlers}
      onDoubleClick={reset}
    >
      {glowColor && (
        <div
          className="absolute inset-x-12 -bottom-6 h-24 rounded-full opacity-70 dark:opacity-90 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor}88, transparent 70%)`,
            filter: 'blur(26px)',
          }}
        />
      )}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(0,0,0) rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg)`,
          transition: dragging ? 'none' : 'transform 0.12s linear',
        }}
      >
        {faces.map((face, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `rotateY(${face.rotateY}deg) translateZ(${face.depth ?? 30}px)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {face.render({ dragging })}
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-[11px] text-gray-500 dark:text-gray-500 font-mono tracking-wide pointer-events-none">
        ↳ arrastra para girar · doble-click para resetear
      </p>
    </div>
  )
}
