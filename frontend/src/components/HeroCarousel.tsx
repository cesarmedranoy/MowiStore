import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { findProduct, formatPEN } from '../data/products'
import { useCart } from '../lib/cart'
import { LazyModel3DViewer } from './LazyModel3DViewer'
import { Product3D } from './Product3D'
import { facesForProduct } from './ProductVisuals'
import type { Product } from '../types'

const CAROUSEL_IDS = ['rog-strix-scar-17', 'iphone-16-pro-max', 'airpods-pro']
const SLIDES: Product[] = CAROUSEL_IDS.map((id) => findProduct(id)!).filter(Boolean)
const AUTOPLAY_MS = 8000

export function HeroCarousel({ onView }: { onView: (id: string) => void }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const { add } = useCart()
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-advance unless user is interacting
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => {
      setActive((i) => (i + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [active, paused])

  // Pause autoplay if user interacts inside the carousel
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onEnter = () => setPaused(true)
    const onLeave = () => setPaused(false)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const product = SLIDES[active]
  const faces = facesForProduct(product)

  const go = (dir: 1 | -1) => {
    setActive((i) => (i + dir + SLIDES.length) % SLIDES.length)
  }

  return (
    <section
      ref={containerRef}
      id="producto-estrella"
      className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 pb-20"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header strip */}
        <div className="flex items-end justify-between mb-6 px-2 sm:px-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
              Productos estrella
            </span>
            <h2 className="text-[1.6rem] sm:text-[2rem] font-semibold text-black dark:text-white tracking-tight">
              Interactúa — gira, mueve, explora
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-center min-h-[520px]">
          {/* Big interactive 3D visual */}
          <div key={product.id} className="relative animate-fade-in">
            {product.modelPath ? (
              <LazyModel3DViewer
                modelPath={product.modelPath}
                mtlPath={product.modelMtlPath}
                accent={product.accentFrom}
                className="aspect-[5/4] w-full max-w-[680px] mx-auto"
              />
            ) : (
              <Product3D
                faces={faces}
                glowColor={product.accentFrom}
                className="aspect-[5/4] w-full max-w-[680px] mx-auto"
              />
            )}
          </div>

          {/* Copy + CTAs */}
          <div key={`copy-${product.id}`} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 text-black px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider">
                ★ {active === 0 ? 'Producto estrella' : `Slide 0${active + 1}`}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                {product.zone}
              </span>
            </div>

            <h3 className="text-[2rem] sm:text-[2.6rem] leading-[1.02] font-semibold text-black dark:text-white tracking-tight mb-3">
              {product.brand}{' '}
              <span className="relative inline-block">
                <span className="relative z-10">{product.name}</span>
                <span
                  className="absolute left-0 right-0 bottom-1 sm:bottom-2 h-3 -z-0 rounded-sm"
                  style={{ backgroundColor: 'rgba(250, 204, 21, 0.55)' }}
                />
              </span>
            </h3>

            <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed mb-5 max-w-md">
              {product.description}
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[28px] font-bold text-black dark:text-white tracking-tight">
                {formatPEN(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[14px] text-gray-400 dark:text-gray-500 line-through">
                  {formatPEN(product.oldPrice)}
                </span>
              )}
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                · {product.stock} en stock
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => add(product.id)}
                className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-6 py-3.5 transition-colors shadow-[0_8px_24px_-6px_rgba(250,204,21,0.6)]"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                Agregar al carrito
              </button>
              <button
                onClick={() => onView(product.id)}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white px-3 py-3 transition-colors group"
              >
                Ver ficha completa
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mini specs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.specs.slice(0, 3).map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 px-2.5 py-1 text-[10.5px] text-gray-700 dark:text-gray-300"
                >
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wider text-[9.5px]">
                    {s.label}
                  </span>
                  <span className="font-medium text-black dark:text-white">{s.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              aria-label={`Ir a ${s.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? 'w-10 bg-yellow-400'
                  : 'w-2.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Mobile nav arrows */}
        <div className="sm:hidden flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/70 dark:bg-white/5 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/70 dark:bg-white/5 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
