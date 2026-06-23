import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import { ProductCard } from './ProductCard'
import type { Category } from '../types'

const CATEGORIES: Array<{ key: 'all' | Category; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'laptop', label: 'Laptops' },
  { key: 'smartphone', label: 'Smartphones' },
  { key: 'audio', label: 'Audífonos' },
  { key: 'cargador', label: 'Cargadores' },
  { key: 'procesador', label: 'Procesadores' },
]

export function Catalog({ onView }: { onView: (id: string) => void }) {
  const [cat, setCat] = useState<'all' | Category>('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const inCat = cat === 'all' || p.category === cat
      const inQ =
        q.trim() === '' ||
        (p.name + ' ' + p.brand + ' ' + p.tagline)
          .toLowerCase()
          .includes(q.trim().toLowerCase())
      return inCat && inQ
    })
  }, [cat, q])

  return (
    <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
            Catálogo
          </span>
          <h1 className="text-[1.8rem] sm:text-[2.2rem] font-semibold text-black dark:text-white tracking-tight mb-3">
            Todo lo que tenemos para ti
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar producto, marca…"
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/15 text-[13px] text-black dark:text-white placeholder:text-gray-400 outline-none focus:ring-yellow-400/60 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className={`whitespace-nowrap text-[12px] font-medium px-3 py-1.5 rounded-full ring-1 transition-colors ${
                    cat === c.key
                      ? 'bg-yellow-400 text-black ring-yellow-400'
                      : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 ring-black/10 dark:ring-white/15 hover:ring-yellow-400/40'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-[13px] text-gray-500 dark:text-gray-400">
            No encontramos productos con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
