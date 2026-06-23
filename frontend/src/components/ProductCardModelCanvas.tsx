import { Canvas } from '@react-three/fiber'
import { Bounds, OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'

/**
 * Heavy 3D Canvas for card previews. Split into its own chunk so it only loads
 * when ProductCardModel decides to mount it.
 */
export function ProductCardModelCanvas({
  modelPath,
  accent,
}: {
  modelPath: string
  accent: string
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ touchAction: 'none', pointerEvents: 'none' }}
      frameloop="always"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 5]} intensity={1.1} />
      <directionalLight position={[-2, 1, -3]} intensity={0.35} color={accent} />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.05}>
          <CardModel path={modelPath} />
        </Bounds>
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={1.6}
        makeDefault
      />
    </Canvas>
  )
}

function CardModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const cloned = useMemo(() => scene.clone(true), [scene])
  return <primitive object={cloned} />
}
