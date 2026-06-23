import {
  BatteryCharging,
  Cpu,
  Headphones,
  Laptop,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey, Product } from '../../types'

const ICONS: Record<IconKey, LucideIcon> = {
  laptop: Laptop,
  phone: Smartphone,
  headphones: Headphones,
  charger: BatteryCharging,
  cpu: Cpu,
}

export function GenericFront({ product }: { product: Product }) {
  const Icon = ICONS[product.iconKey]
  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})`,
      }}
    >
      <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-white/25" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-black/15" />

      <div
        className="relative z-10 text-black/85 drop-shadow-2xl"
        style={{ transform: 'translateZ(40px)' }}
      >
        <Icon className="w-44 h-44" strokeWidth={1.2} />
      </div>

      {/* Top-left meta */}
      <div className="absolute top-5 left-5">
        <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-black/55">
          {product.brand}
        </span>
      </div>
      <div className="absolute bottom-5 right-5 text-right">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-black/45">
          FRONT · 01
        </span>
      </div>
    </div>
  )
}

export function GenericBack({ product }: { product: Product }) {
  const Icon = ICONS[product.iconKey]
  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${product.accentTo}, ${product.accentFrom})`,
      }}
    >
      {/* Decorative grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-black/15" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/22" />

      {/* Spec callout */}
      <div className="relative z-10 text-center px-8" style={{ transform: 'translateZ(40px)' }}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black/15 backdrop-blur-sm mb-4">
          <Icon className="w-7 h-7 text-black/85" strokeWidth={1.4} />
        </div>
        <p className="text-[10.5px] uppercase tracking-[0.3em] font-mono text-black/60 mb-2">
          Spec destacada
        </p>
        <p className="text-[1.5rem] font-bold text-black tracking-tight leading-tight max-w-xs mx-auto">
          {product.specs[0]?.value ?? product.name}
        </p>
        <p className="mt-3 text-[12px] text-black/70 font-medium">
          {product.specs[0]?.label}
        </p>
      </div>

      <div className="absolute top-5 right-5 text-right">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-black/45">
          BACK · 02
        </span>
      </div>
    </div>
  )
}
