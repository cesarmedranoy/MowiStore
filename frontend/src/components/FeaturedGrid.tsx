import { PRODUCTS } from '../data/products'
import { ProductCard } from './ProductCard'

export function FeaturedGrid({ onView }: { onView: (id: string) => void }) {
  // Show non-star products as featured
  const featured = PRODUCTS.filter((p) => !p.star).slice(0, 6)

  return (
    <section className="relative z-10 px-6 sm:px-12 lg:px-20 pt-10 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
              Recomendados por IA
            </span>
            <h2 className="text-[1.7rem] sm:text-[2rem] font-semibold text-black dark:text-white tracking-tight">
              Selección para ti
            </h2>
          </div>
          <p className="hidden sm:block text-[12px] text-gray-500 dark:text-gray-400 max-w-xs text-right">
            Mueve el cursor sobre cada producto — son interactivos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  )
}
