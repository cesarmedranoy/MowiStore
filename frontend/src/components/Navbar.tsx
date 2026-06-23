import { Package, ShoppingBag } from 'lucide-react'
import { useCart } from '../lib/cart'
import { ThemeToggle } from './ThemeToggle'
import { listOrders } from '../lib/orders'
import { useEffect, useState } from 'react'

function Logo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-label="Mowi Store">
      <path
        fill="#0A0A0A"
        d="M28 28 L88 28 L128 108 L168 28 L228 28 L228 228 L172 228 L172 116 L138 184 L118 184 L84 116 L84 228 L28 228 Z"
      />
    </svg>
  )
}

export type NavView = 'home' | 'catalog' | 'product' | 'checkout' | 'orders'

export function Navbar({
  view,
  onNav,
}: {
  view: NavView
  onNav: (v: NavView) => void
}) {
  const { totals, setOpen } = useCart()
  const [orderCount, setOrderCount] = useState(0)

  // Refresh order count when navigating (cheap, no listeners needed)
  useEffect(() => {
    setOrderCount(listOrders().length)
  }, [view])

  const links: { label: string; v?: NavView; anchor?: string }[] = [
    { label: 'Catálogo', v: 'catalog' },
    { label: 'Cómo funciona', anchor: 'como-funciona' },
    { label: 'Proveedores', anchor: 'proveedores' },
    { label: 'Soporte', anchor: 'soporte' },
  ]

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-center pt-4 sm:pt-5 px-4 sm:px-8 gap-2 sm:gap-3">
      <button
        onClick={() => onNav('home')}
        className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 ring-1 ring-black/10 dark:ring-white/10 shadow-sm hover:scale-105 transition-transform"
        style={{ backgroundColor: '#FACC15' }}
        aria-label="Inicio"
      >
        <Logo size={18} />
      </button>

      <div className="flex items-center gap-3 sm:gap-7 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-black/10 dark:ring-white/10 shadow-sm backdrop-blur-md bg-white/70 dark:bg-white/5">
        {links.map((l) => {
          const active = l.v && view === l.v
          return (
            <button
              key={l.label}
              onClick={() => {
                if (l.v) onNav(l.v)
                else if (l.anchor) {
                  onNav('home')
                  requestAnimationFrame(() => {
                    document.getElementById(l.anchor!)?.scrollIntoView({ behavior: 'smooth' })
                  })
                }
              }}
              className={`text-[12px] sm:text-[13.5px] font-medium transition-colors duration-200 ${
                active
                  ? 'text-black dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              {l.label}
            </button>
          )
        })}
      </div>

      {orderCount > 0 && (
        <button
          onClick={() => onNav('orders')}
          className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 backdrop-blur-sm hover:scale-105 transition-all ${
            view === 'orders'
              ? 'bg-yellow-400 text-black'
              : 'bg-white/70 dark:bg-white/5'
          }`}
          aria-label="Mis pedidos"
        >
          <Package className="w-4 h-4" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[color:var(--color-mowi-cream)] dark:ring-[#08080A]">
            {orderCount}
          </span>
        </button>
      )}

      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/70 dark:bg-white/5 backdrop-blur-sm hover:scale-105 transition-all"
        aria-label="Abrir carrito"
      >
        <ShoppingBag className="w-4 h-4 text-black dark:text-white" strokeWidth={2.5} />
        {totals.count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center ring-2 ring-[color:var(--color-mowi-cream)] dark:ring-[#08080A]">
            {totals.count}
          </span>
        )}
      </button>

      <ThemeToggle />
    </nav>
  )
}
