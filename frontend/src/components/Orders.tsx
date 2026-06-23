import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  Package,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { findProduct, formatPEN } from '../data/products'
import {
  listOrders,
  nextStatus,
  statusIndex,
  STATUS_LABELS,
  STATUS_ORDER,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from '../lib/orders'

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  validating: 'Estamos verificando tu N° de operación con el banco.',
  validated: 'Tu pago fue confirmado. Coordinamos con el proveedor.',
  preparing: 'El proveedor está empacando tu producto para envío.',
  shipping: 'El courier ya tiene tu paquete y está en camino.',
  delivered: 'Tu pedido fue entregado. ¡Disfrútalo!',
}

const ADVANCE_INTERVAL_MS = 12_000 // demo: cada 12s avanza un estado

export function Orders({
  highlightCode,
  onView,
}: {
  highlightCode: string | null
  onView: (id: string) => void
}) {
  const [orders, setOrders] = useState<Order[]>(listOrders())

  /* Auto-advance order statuses for the demo. */
  useEffect(() => {
    const t = setInterval(() => {
      const all = listOrders()
      let changed = false
      for (const o of all) {
        const next = nextStatus(o.status)
        if (next && Date.now() - o.statusUpdatedAt > ADVANCE_INTERVAL_MS) {
          updateOrderStatus(o.code, next)
          changed = true
        }
      }
      if (changed) setOrders(listOrders())
    }, 3000)
    return () => clearInterval(t)
  }, [])

  if (orders.length === 0) {
    return (
      <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-400/15 ring-1 ring-yellow-400/30 flex items-center justify-center mx-auto mb-5">
          <Package className="w-7 h-7 text-yellow-600 dark:text-yellow-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-[1.6rem] font-semibold text-black dark:text-white mb-2">
          Aún no tienes pedidos
        </h1>
        <p className="text-[13px] text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Cuando completes una compra, aparecerá aquí con su estado en tiempo real.
        </p>
      </section>
    )
  }

  return (
    <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
            Mis Pedidos
          </span>
          <h1 className="text-[2rem] font-semibold text-black dark:text-white tracking-tight">
            Sigue tus compras en tiempo real
          </h1>
        </header>

        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={order.code}
              order={order}
              highlight={order.code === highlightCode}
              onView={onView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function OrderCard({
  order,
  highlight,
  onView,
}: {
  order: Order
  highlight: boolean
  onView: (id: string) => void
}) {
  const items = useMemo(
    () =>
      order.items
        .map((i) => {
          const p = findProduct(i.productId)
          return p ? { product: p, qty: i.qty } : null
        })
        .filter((x): x is { product: NonNullable<ReturnType<typeof findProduct>>; qty: number } => !!x),
    [order.items],
  )

  const currentIdx = statusIndex(order.status)
  const date = new Date(order.createdAt)
  const dateStr = date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

  return (
    <article
      className={`rounded-3xl bg-white/70 dark:bg-white/5 ring-1 backdrop-blur-md p-5 sm:p-6 transition-all ${
        highlight ? 'ring-yellow-400/60 shadow-[0_0_0_4px_rgba(250,204,21,0.15)]' : 'ring-black/10 dark:ring-white/10'
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[15px] font-bold text-black dark:text-white">
              {order.code}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-[11.5px] text-gray-500 dark:text-gray-400">
            {dateStr} · {timeStr} · {order.customer.district}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10.5px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
            Total
          </p>
          <p className="text-[16px] font-bold text-black dark:text-white">
            {formatPEN(order.subtotal)}
          </p>
        </div>
      </header>

      {/* Timeline */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-1 mb-3">
          {STATUS_ORDER.map((s, i) => {
            const done = i < currentIdx
            const active = i === currentIdx
            return (
              <div key={s} className="flex-1 flex flex-col items-center text-center min-w-0">
                <div className="relative w-full flex items-center mb-2">
                  {i > 0 && (
                    <span
                      className={`absolute -left-1/2 right-1/2 top-1/2 -translate-y-1/2 h-0.5 ${
                        done || active ? 'bg-yellow-400' : 'bg-black/10 dark:bg-white/10'
                      }`}
                    />
                  )}
                  <div className="relative z-10 mx-auto">
                    {done ? (
                      <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={2.5} />
                      </div>
                    ) : active ? (
                      <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center ring-4 ring-yellow-400/25">
                        <Loader2 className="w-3.5 h-3.5 text-black animate-spin" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15" />
                    )}
                  </div>
                </div>
                <p
                  className={`text-[10px] leading-tight font-semibold uppercase tracking-wider ${
                    done || active ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </p>
              </div>
            )
          })}
        </div>
        <p className="text-[12px] text-gray-700 dark:text-gray-300 mt-3 text-center">
          {STATUS_DESCRIPTIONS[order.status]}
        </p>
      </div>

      {/* Courier */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-black/[0.025] dark:bg-white/5 px-4 py-3">
        <div className="w-9 h-9 rounded-xl bg-yellow-400/15 ring-1 ring-yellow-400/30 flex items-center justify-center shrink-0">
          <Truck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-black dark:text-white">
            {order.courier.name}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            ETA: {order.courier.eta} · {order.customer.address}
            {order.customer.reference ? ` (${order.customer.reference})` : ''}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map(({ product, qty }) => (
          <button
            key={product.id}
            onClick={() => onView(product.id)}
            className="w-full flex items-center gap-3 rounded-2xl bg-white/60 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 px-3 py-2.5 hover:ring-yellow-400/40 transition-colors text-left"
          >
            <div
              className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-black/85 font-bold text-[10px]"
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
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {product.brand} · {qty} {qty === 1 ? 'unidad' : 'unidades'}
              </p>
            </div>
            <span className="text-[12.5px] font-semibold text-black dark:text-white shrink-0">
              {formatPEN(product.price * qty)}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
        ))}
      </div>

      <footer className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 text-[11px] text-gray-500 dark:text-gray-400 font-mono">
        Pago vía {order.bank} · Op. {order.operationNumber}
      </footer>
    </article>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const isDone = status === 'delivered'
  const isActive = status !== 'delivered'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        isDone
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
          : isActive
            ? 'bg-yellow-400/20 text-yellow-700 dark:text-yellow-400'
            : 'bg-black/10 text-gray-700 dark:text-gray-300'
      }`}
    >
      {isDone ? '● Entregado' : '● En progreso'}
    </span>
  )
}
