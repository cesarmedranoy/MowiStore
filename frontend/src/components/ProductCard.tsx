import {
  BatteryCharging,
  Cpu,
  Headphones,
  Laptop,
  Smartphone,
} from 'lucide-react'
import { useState } from 'react'
import { formatPEN } from '../data/products'
import type { Product } from '../types'
import { useCart } from '../lib/cart'
import { ProductCardModel } from './ProductCardModel'

function CategoryIcon({ k }: { k: Product['iconKey'] }) {
  const cls = 'w-16 h-16 drop-shadow-sm'
  switch (k) {
    case 'laptop':
      return <Laptop className={cls} strokeWidth={1.25} />
    case 'phone':
      return <Smartphone className={cls} strokeWidth={1.25} />
    case 'headphones':
      return <Headphones className={cls} strokeWidth={1.25} />
    case 'charger':
      return <BatteryCharging className={cls} strokeWidth={1.25} />
    case 'cpu':
      return <Cpu className={cls} strokeWidth={1.25} />
  }
}

export function ProductCard({
  product,
  onView,
}: {
  product: Product
  onView: (id: string) => void
}) {
  const [hovering, setHovering] = useState(false)
  const { add } = useCart()
  const has3D = Boolean(product.modelPath)

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onView(product.id)}
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#101013] ring-1 ring-black/8 dark:ring-white/10 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer card-contain"
    >
      {/* Visual area — neutral background with very subtle accent glow */}
      <div className="relative aspect-square flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAFAF8] via-white to-[#F4F4F0] dark:from-[#16161A] dark:via-[#101013] dark:to-[#0A0A0C]">
        {/* Subtle accent glow (only ~12% opacity) — keeps brand color hint without overpowering */}
        <div
          className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none opacity-25 dark:opacity-30"
          style={{
            background: `radial-gradient(circle, ${product.accentFrom}, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Brand tag — top-left */}
        <span className="absolute top-3 left-3 text-[9.5px] uppercase tracking-[0.18em] font-semibold text-black/55 dark:text-white/60 font-mono z-10">
          {product.brand}
        </span>

        {/* Top-right badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-black text-yellow-400 px-2 py-0.5 text-[10px] font-bold tracking-wider">
              -{discount}%
            </span>
          )}
          {product.star && (
            <span className="inline-flex items-center rounded-full bg-yellow-400 text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              ★ Estrella
            </span>
          )}
        </div>

        {/* Centered icon (idle) — fades out on hover when 3D is mounting */}
        <div
          className={`relative z-[1] text-black/75 dark:text-white/55 transition-all duration-300 ${
            has3D && hovering ? 'opacity-0 scale-95' : 'opacity-100 scale-100 group-hover:scale-105'
          }`}
        >
          <CategoryIcon k={product.iconKey} />
        </div>

        {/* 3D model — only mounts when hovering, on-demand */}
        {has3D && (
          <ProductCardModel
            modelPath={product.modelPath!}
            accent={product.accentFrom}
            active={hovering}
          />
        )}

        {/* 3D indicator pill — bottom-left */}
        {has3D && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 dark:bg-white/15 backdrop-blur-sm text-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider z-10 pointer-events-none">
            3D · hover
          </span>
        )}
      </div>

      {/* Info section */}
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="text-[14.5px] font-semibold text-black dark:text-white leading-tight line-clamp-1">
            {product.name}
          </h3>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono shrink-0">
            {product.zone}
          </span>
        </div>
        <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2 min-h-[32px]">
          {product.tagline}
        </p>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold text-black dark:text-white tabular-nums">
                {formatPEN(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] text-gray-400 dark:text-gray-500 line-through tabular-nums">
                  {formatPEN(product.oldPrice)}
                </span>
              )}
            </div>
            <span className="text-[10.5px] text-gray-500 dark:text-gray-500">
              ★ {product.rating} · {product.reviews}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              add(product.id)
            }}
            className="text-[11.5px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-3.5 py-2 transition-colors"
          >
            + Carrito
          </button>
        </div>
      </div>
    </div>
  )
}
