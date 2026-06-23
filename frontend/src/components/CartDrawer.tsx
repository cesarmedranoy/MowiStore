import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import { formatPEN } from '../data/products'

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { open, setOpen, itemsWithProduct, totals, setQty, remove } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[color:var(--color-mowi-cream)] dark:bg-[#0E0E12] shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />
            <h2 className="text-[15px] font-semibold text-black dark:text-white">
              Tu carrito
            </h2>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              · {totals.count} item{totals.count === 1 ? '' : 's'}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-black dark:text-white" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {itemsWithProduct.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-14 h-14 rounded-full bg-yellow-400/15 ring-1 ring-yellow-400/30 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
              </div>
              <p className="text-[13px] text-gray-700 dark:text-gray-300 mb-1">
                Tu carrito está vacío
              </p>
              <p className="text-[11.5px] text-gray-500 dark:text-gray-400 max-w-[220px]">
                Explora el catálogo y agrega lo que necesites.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {itemsWithProduct.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-2xl p-3 bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div
                    className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-black/80 font-bold text-[11px]"
                    style={{
                      background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})`,
                    }}
                  >
                    {product.brand.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-black dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 mb-1.5">
                      {product.brand} · {product.zone}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 rounded-full bg-black/5 dark:bg-white/10 px-1">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="w-6 h-6 inline-flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[11.5px] font-semibold w-5 text-center text-black dark:text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="w-6 h-6 inline-flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[13px] font-bold text-black dark:text-white">
                        {formatPEN(product.price * qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="p-1.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors self-start"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {itemsWithProduct.length > 0 && (
          <footer className="border-t border-black/5 dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-[14px] font-semibold text-black dark:text-white">
                {formatPEN(totals.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] text-gray-600 dark:text-gray-400">Envío</span>
              <span className="text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">
                Incluido en Lima
              </span>
            </div>
            <button
              onClick={() => {
                setOpen(false)
                onCheckout()
              }}
              className="w-full inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full py-3.5 transition-all duration-200 shadow-[0_8px_24px_-6px_rgba(250,204,21,0.7)] hover:shadow-[0_12px_32px_-6px_rgba(250,204,21,0.9)]"
            >
              Pagar por transferencia
            </button>
            <p className="mt-2 text-center text-[10.5px] text-gray-500 dark:text-gray-400">
              Único método. Validado en menos de 30 min.
            </p>
          </footer>
        )}
      </aside>
    </>
  )
}
