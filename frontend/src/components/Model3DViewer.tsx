import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Bounds, Environment, OrbitControls, useBounds, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { PerspectiveCamera } from 'three'

export { ModelPlaceholder } from './ModelPlaceholder'

export type ModelFormat = 'gltf' | 'glb' | 'obj'

export function detectFormat(path: string): ModelFormat | null {
  const lower = path.toLowerCase()
  if (lower.endsWith('.glb')) return 'glb'
  if (lower.endsWith('.gltf')) return 'gltf'
  if (lower.endsWith('.obj')) return 'obj'
  return null
}

type Props = {
  modelPath: string
  mtlPath?: string
  accent?: string
  autoRotate?: boolean
  className?: string
  hideControls?: boolean
  /** Bounds margin (1 = perfect fit, >1 = more breathing room). Default 1.1. */
  margin?: number
}

export function Model3DViewer(props: Props) {
  const [fullscreen, setFullscreen] = useState(false)
  return (
    <>
      <InlineViewer {...props} onFullscreen={() => setFullscreen(true)} />
      {fullscreen &&
        createPortal(
          <FullscreenViewer {...props} onClose={() => setFullscreen(false)} />,
          document.body,
        )}
    </>
  )
}

function InlineViewer({
  modelPath,
  mtlPath,
  accent = '#FACC15',
  autoRotate = true,
  className = '',
  hideControls,
  margin = 1.1,
  onFullscreen,
}: Props & { onFullscreen?: () => void }) {
  const format = detectFormat(modelPath)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [zoomBusy, setZoomBusy] = useState(false)

  const zoom = (factor: number) => {
    if (!controlsRef.current || zoomBusy) return
    setZoomBusy(true)
    const camera = controlsRef.current.object as PerspectiveCamera
    const target = controlsRef.current.target
    const dir = camera.position.clone().sub(target)
    const next = dir.multiplyScalar(factor)
    camera.position.copy(target).add(next)
    controlsRef.current.update()
    setTimeout(() => setZoomBusy(false), 80)
  }

  const reset = () => controlsRef.current?.reset()

  if (!format) {
    return (
      <div
        className={`relative rounded-3xl flex items-center justify-center bg-white/40 dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10 ${className}`}
      >
        <p className="text-[12px] text-gray-500 px-4 text-center">
          Formato no soportado: <span className="font-mono">{modelPath}</span>
        </p>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/40 to-white/10 dark:from-white/[0.04] dark:to-white/[0.01] ring-1 ring-black/5 dark:ring-white/10 ${className}`}
    >
      {/* Soft accent glow */}
      <div
        className="absolute inset-x-12 -bottom-10 h-28 rounded-full opacity-60 dark:opacity-80 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}55, transparent 70%)`,
          filter: 'blur(28px)',
        }}
      />

      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.2], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={1.1} />
        <directionalLight position={[-3, 2, -4]} intensity={0.45} color={accent} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={margin}>
            {format === 'glb' || format === 'gltf' ? (
              <GLTFModel path={modelPath} />
            ) : (
              <OBJModel path={modelPath} mtlPath={mtlPath} />
            )}
          </Bounds>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate}
          autoRotateSpeed={0.55}
          minDistance={1}
          maxDistance={12}
          makeDefault
        />
      </Canvas>

      {!hideControls && (
        <>
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
            <ControlButton onClick={() => zoom(0.85)} ariaLabel="Acercar">
              <ZoomIn className="w-3.5 h-3.5" strokeWidth={2.4} />
            </ControlButton>
            <ControlButton onClick={() => zoom(1.18)} ariaLabel="Alejar">
              <ZoomOut className="w-3.5 h-3.5" strokeWidth={2.4} />
            </ControlButton>
            <ControlButton onClick={reset} ariaLabel="Resetear vista">
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.4} />
            </ControlButton>
          </div>

          {onFullscreen && (
            <div className="absolute top-3 right-3 z-20">
              <ControlButton onClick={onFullscreen} ariaLabel="Pantalla completa">
                <Maximize2 className="w-3.5 h-3.5" strokeWidth={2.4} />
              </ControlButton>
            </div>
          )}

          <p className="absolute bottom-2 left-3 text-[10px] text-black/55 dark:text-white/55 font-mono tracking-wide pointer-events-none">
            arrastra · scroll · doble-click resetea
          </p>
        </>
      )}
    </div>
  )
}

function FullscreenViewer(props: Props & { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && props.onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [props.onClose])

  return (
    <div className="fixed inset-0 z-[9999] bg-black/96 backdrop-blur-md flex flex-col p-4 sm:p-6 lg:p-10 animate-fade-in">
      <header className="flex items-center justify-between mb-4 shrink-0">
        <div className="text-[12px] text-white/70 font-mono">
          Vista 360° · ESC para cerrar
        </div>
        <button
          onClick={props.onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Cerrar pantalla completa"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </header>
      <div className="flex-1 min-h-0 w-full">
        <InlineViewer {...props} className="w-full h-full" margin={1.25} />
      </div>
    </div>
  )
}

function ControlButton({
  onClick,
  children,
  ariaLabel,
}: {
  onClick: () => void
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-8 h-8 rounded-full bg-white/85 dark:bg-white/15 hover:bg-white dark:hover:bg-white/25 backdrop-blur-sm ring-1 ring-black/10 dark:ring-white/20 flex items-center justify-center text-black dark:text-white shadow-sm transition-colors"
    >
      {children}
    </button>
  )
}

function GLTFModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const bounds = useBounds()
  const { invalidate } = useThree()
  useEffect(() => {
    bounds.refresh().fit()
    invalidate()
  }, [cloned, bounds, invalidate])
  return <primitive object={cloned} />
}

function OBJModel({ path, mtlPath }: { path: string; mtlPath?: string }) {
  const materials = mtlPath ? useLoader(MTLLoader, mtlPath) : null
  const obj = useLoader(OBJLoader, path, (loader) => {
    if (materials) {
      materials.preload()
      ;(loader as OBJLoader).setMaterials(materials)
    }
  })
  const cloned = useMemo(() => obj.clone(true), [obj])
  const bounds = useBounds()
  const { invalidate } = useThree()
  useEffect(() => {
    bounds.refresh().fit()
    invalidate()
  }, [cloned, bounds, invalidate])
  return <primitive object={cloned} />
}
