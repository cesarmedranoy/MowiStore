import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'
import { findProduct } from '../data/products'

type CartCtx = {
  items: CartItem[]
  add: (id: string, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  open: boolean
  setOpen: (b: boolean) => void
  totals: { count: number; subtotal: number }
  itemsWithProduct: Array<{ product: Product; qty: number }>
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  const add = (id: string, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === id)
      if (existing) {
        return prev.map((i) =>
          i.productId === id ? { ...i, qty: i.qty + qty } : i,
        )
      }
      return [...prev, { productId: id, qty }]
    })
    setOpen(true)
  }

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.productId !== id))

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== id)
        : prev.map((i) => (i.productId === id ? { ...i, qty } : i)),
    )

  const clear = () => setItems([])

  const itemsWithProduct = useMemo(
    () =>
      items
        .map((i) => {
          const product = findProduct(i.productId)
          return product ? { product, qty: i.qty } : null
        })
        .filter((x): x is { product: Product; qty: number } => x !== null),
    [items],
  )

  const totals = useMemo(
    () => ({
      count: items.reduce((acc, i) => acc + i.qty, 0),
      subtotal: itemsWithProduct.reduce(
        (acc, { product, qty }) => acc + product.price * qty,
        0,
      ),
    }),
    [items, itemsWithProduct],
  )

  return (
    <Ctx.Provider
      value={{ items, add, remove, setQty, clear, open, setOpen, totals, itemsWithProduct }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
