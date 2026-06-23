import { Loader2 } from 'lucide-react'

/**
 * Lightweight placeholder shown while the heavy 3D viewer chunk loads.
 * Kept in a separate file so it can be the Suspense fallback without
 * pulling in three.js / R3F / drei.
 */
export function ModelPlaceholder({
  accent = '#FACC15',
  className = '',
  children,
}: {
  accent?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={`relative rounded-3xl flex items-center justify-center bg-gradient-to-br from-white/40 to-white/10 dark:from-white/[0.04] dark:to-white/[0.01] ring-1 ring-black/5 dark:ring-white/10 ${className}`}
    >
      <div
        className="absolute inset-x-12 -bottom-6 h-24 rounded-full opacity-50 dark:opacity-70"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}66, transparent 70%)`,
          filter: 'blur(26px)',
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-400/15 ring-1 ring-yellow-400/30 mb-4">
          <Loader2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400 animate-spin" />
        </div>
        <p className="text-[12.5px] text-gray-700 dark:text-gray-300">
          {children ?? 'Cargando modelo 3D…'}
        </p>
      </div>
    </div>
  )
}
