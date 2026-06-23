import type { CartItem } from '../types'

export type OrderStatus =
  | 'validating' // Validando transferencia
  | 'validated'  // Pago validado
  | 'preparing' // Preparando con proveedor
  | 'shipping'  // En camino
  | 'delivered' // Entregado

export type Customer = {
  name: string
  email: string
  phone: string
  docType: 'DNI' | 'RUC'
  doc: string
  address: string
  district: string
  reference?: string
}

export type Order = {
  code: string
  createdAt: number
  status: OrderStatus
  statusUpdatedAt: number
  items: CartItem[]
  subtotal: number
  customer: Customer
  bank: string
  operationNumber: string
  courier: { name: string; eta: string }
}

const STORAGE_KEY = 'mowi-orders'

export function listOrders(): Order[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

export function saveOrder(order: Order): void {
  const all = listOrders()
  const next = [order, ...all.filter((o) => o.code !== order.code)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function updateOrderStatus(code: string, status: OrderStatus): void {
  const all = listOrders()
  const next = all.map((o) =>
    o.code === code ? { ...o, status, statusUpdatedAt: Date.now() } : o,
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function findOrder(code: string): Order | null {
  return listOrders().find((o) => o.code === code) ?? null
}

/**
 * Generates an order code: MS-YYMM-XXXXXX
 *   MS = Mowi Store, YYMM = year/month, XXXXXX = random alphanumeric.
 */
export function generateOrderCode(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `MS-${yy}${mm}-${suffix}`
}

/** Pretty label for the timeline */
export const STATUS_LABELS: Record<OrderStatus, string> = {
  validating: 'Validando transferencia',
  validated: 'Pago validado',
  preparing: 'Preparando con proveedor',
  shipping: 'En camino',
  delivered: 'Entregado',
}

export const STATUS_ORDER: OrderStatus[] = [
  'validating',
  'validated',
  'preparing',
  'shipping',
  'delivered',
]

export function statusIndex(status: OrderStatus): number {
  return STATUS_ORDER.indexOf(status)
}

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const i = statusIndex(status)
  if (i < 0 || i >= STATUS_ORDER.length - 1) return null
  return STATUS_ORDER[i + 1]
}
