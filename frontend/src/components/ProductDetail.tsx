import {
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useInView } from '../lib/useInView'
import { findProduct, formatPEN, PRODUCTS } from '../data/products'
import { useCart } from '../lib/cart'
import { LazyModel3DViewer } from './LazyModel3DViewer'
import { Product3D } from './Product3D'
import { facesForProduct } from './ProductVisuals'
import { ProductCard } from './ProductCard'
import type { Feature, Product } from '../types'

export function ProductDetail({
  productId,
  onBack,
  onView,
}: {
  productId: string
  onBack: () => void
  onView: (id: string) => void
}) {
  const product = findProduct(productId)
  const { add } = useCart()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { rootMargin: '-100px 0px 0px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [productId])

  if (!product) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-gray-500 mb-4">Producto no encontrado.</p>
        <button onClick={onBack} className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
          ← Volver
        </button>
      </div>
    )
  }

  const similar = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <>
      <article className="relative z-10">
        <Hero product={product} onAdd={() => add(product.id)} onBack={onBack} />
        <div ref={sentinelRef} />

        <SpecsDashboard product={product} />

        <div className="px-6 sm:px-12 lg:px-20 space-y-24 sm:space-y-32 pb-20">
          {product.features.map((f, i) => (
            <FeatureSection
              key={f.title}
              feature={f}
              product={product}
              index={i + 1}
              reverse={i % 2 === 1}
            />
          ))}
        </div>

        <Reviews product={product} />

        {similar.length > 0 && (
          <section className="relative z-10 px-6 sm:px-12 lg:px-20 pb-20">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-[1.4rem] sm:text-[1.6rem] font-semibold text-black dark:text-white mb-6">
                También te puede gustar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similar.map((p) => (
                  <ProductCard key={p.id} product={p} onView={onView} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <StickyBuyBar show={showBar} product={product} onAdd={() => add(product.id)} />
    </>
  )
}

/* ============== HERO ============== */

function Hero({
  product,
  onAdd,
  onBack,
}: {
  product: Product
  onAdd: () => void
  onBack: () => void
}) {
  return (
    <section className="relative px-6 sm:px-12 lg:px-20 pt-6 pb-14">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Volver
        </button>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* 3D visual */}
          {product.modelPath ? (
            <LazyModel3DViewer
              modelPath={product.modelPath}
              mtlPath={product.modelMtlPath}
              accent={product.accentFrom}
              className="aspect-square w-full max-w-[560px] mx-auto"
            />
          ) : (
            <Product3D
              faces={facesForProduct(product)}
              glowColor={product.accentFrom}
              className="aspect-square w-full max-w-[560px] mx-auto"
            />
          )}

          {/* Buy panel */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                {product.brand} · {product.category}
              </span>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                {product.zone}
              </span>
            </div>

            <h1 className="text-[2rem] sm:text-[2.8rem] font-semibold text-black dark:text-white leading-[1.02] tracking-tight mb-3">
              {product.name}
            </h1>

            <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed mb-5 max-w-xl">
              {product.tagline}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-0.5 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400' : 'fill-none'}`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                {product.rating} · {product.reviews} reseñas verificadas
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-[32px] font-bold text-black dark:text-white tracking-tight">
                {formatPEN(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[14px] text-gray-400 dark:text-gray-500 line-through">
                  {formatPEN(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-6">
              · {product.stock} en stock · Envío incluido en Lima
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-6 py-3.5 transition-colors duration-200 shadow-[0_8px_24px_-6px_rgba(250,204,21,0.6)]"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                Agregar al carrito
              </button>
              <button
                onClick={onAdd}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black dark:text-white border border-black/15 dark:border-white/20 rounded-full px-5 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Comprar ahora
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11.5px]">
              <Badge icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Reseñas verificadas" />
              <Badge icon={<Truck className="w-3.5 h-3.5" />} label="Envío incluido en Lima" />
              <Badge icon={<Sparkles className="w-3.5 h-3.5" />} label="Recomendado por IA" />
              <Badge icon={<ShoppingBag className="w-3.5 h-3.5" />} label="Garantía 12 meses" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 px-3 py-1.5">
      <span className="text-yellow-600 dark:text-yellow-400">{icon}</span>
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  )
}

/* ============== SPECS DASHBOARD ============== */

function SpecsDashboard({ product }: { product: Product }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15)
  return (
    <section
      ref={ref}
      className={`relative z-10 px-6 sm:px-12 lg:px-20 py-14 ${inView ? 'in-view' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-7">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
            Specs
          </span>
          <h2 className="text-[1.6rem] sm:text-[2rem] font-semibold text-black dark:text-white tracking-tight">
            Especificaciones técnicas
          </h2>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {product.specs.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 p-4 sm:p-5 hover:ring-yellow-400/40 transition-colors"
            >
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {s.label}
              </p>
              <p className="text-[15px] sm:text-[16px] font-semibold text-black dark:text-white">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============== FEATURE SECTION ============== */

function FeatureSection({
  feature,
  product,
  index,
  reverse,
}: {
  feature: Feature
  product: Product
  index: number
  reverse: boolean
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)
  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto ${
        inView ? 'in-view' : 'opacity-0'
      }`}
    >
      <FeatureVisual
        product={product}
        feature={feature}
        index={index}
        className={reverse ? 'lg:order-2' : ''}
      />
      <div className={reverse ? 'lg:order-1' : ''}>
        <span className="text-[11px] uppercase tracking-wider font-mono font-semibold text-yellow-700 dark:text-yellow-400 mb-3 block">
          0{index} / 0{product.features.length}
        </span>
        <h3 className="text-[1.8rem] sm:text-[2.4rem] font-semibold text-black dark:text-white leading-[1.05] tracking-tight mb-4">
          {feature.title}
        </h3>
        <p className="text-[14.5px] sm:text-[15.5px] text-gray-700 dark:text-gray-300 leading-relaxed mb-5 max-w-lg">
          {feature.body}
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/15 ring-1 ring-yellow-400/30 px-3 py-1.5 text-[12px] font-semibold text-yellow-700 dark:text-yellow-300">
          <Sparkles className="w-3.5 h-3.5" />
          {feature.highlight}
        </span>
      </div>
    </div>
  )
}

function FeatureVisual({
  product,
  feature,
  index,
  className,
}: {
  product: Product
  feature: Feature
  index: number
  className?: string
}) {
  return (
    <div
      className={`relative aspect-[7/5] rounded-3xl overflow-hidden ${className ?? ''}`}
      style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
    >
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/22" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-black/15" />

      <div className="absolute top-5 left-5 z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-black/70">
          FEATURE · 0{index}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-6">
          <p className="text-[1.4rem] sm:text-[1.8rem] font-bold text-black tracking-tight leading-tight max-w-md mx-auto">
            {feature.highlight}
          </p>
          <p className="mt-3 text-[12px] text-black/70 font-medium uppercase tracking-[0.2em]">
            {product.brand}
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-10 text-right">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-black/50">
          {feature.title.slice(0, 16)}
        </span>
      </div>
    </div>
  )
}

/* ============== REVIEWS ============== */

const REVIEWS = [
  {
    name: 'Daniela R.',
    zone: 'Surco',
    rating: 5,
    body: 'Llegó al día siguiente con Olva. El soporte por WhatsApp respondió en 5 minutos cuando tuve dudas con la transferencia.',
  },
  {
    name: 'Luis M.',
    zone: 'San Miguel',
    rating: 5,
    body: 'Lo recomendado por la IA me ahorró tiempo. Comparé tres laptops y elegí esta. Producto idéntico al anunciado.',
  },
  {
    name: 'Andrea P.',
    zone: 'Miraflores',
    rating: 4,
    body: 'Envío rápido por InDrive Moto en menos de 2 horas. Repetiré sin duda.',
  },
]

function Reviews({ product }: { product: Product }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15)
  return (
    <section
      ref={ref}
      className={`relative z-10 px-6 sm:px-12 lg:px-20 py-16 ${inView ? 'in-view' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex items-end justify-between flex-wrap gap-3 mb-7">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
              Comunidad
            </span>
            <h2 className="text-[1.6rem] sm:text-[2rem] font-semibold text-black dark:text-white tracking-tight">
              Reseñas verificadas
            </h2>
          </div>
          <div className="text-[12px] text-gray-600 dark:text-gray-400">
            <span className="text-yellow-500">★ {product.rating}</span> · {product.reviews} reseñas
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 p-5"
            >
              <div className="inline-flex items-center gap-0.5 text-yellow-500 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < r.rating ? 'fill-yellow-400' : 'fill-none'}`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
                "{r.body}"
              </p>
              <p className="text-[11.5px] text-gray-500 dark:text-gray-400 font-mono">
                {r.name} · {r.zone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============== STICKY BUY BAR ============== */

function StickyBuyBar({
  show,
  product,
  onAdd,
}: {
  show: boolean
  product: Product
  onAdd: () => void
}) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(720px,calc(100vw-2rem))] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 rounded-full bg-white/90 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 px-3 sm:px-4 py-2.5 shadow-2xl backdrop-blur-md">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-black/85 font-bold text-[10px]"
          style={{ background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})` }}
        >
          {product.brand.slice(0, 3).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-black dark:text-white truncate">
            {product.brand} {product.name}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {formatPEN(product.price)} · envío incluido
          </p>
        </div>
        <button
          onClick={onAdd}
          className="text-[12.5px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-4 py-2 transition-colors whitespace-nowrap"
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
