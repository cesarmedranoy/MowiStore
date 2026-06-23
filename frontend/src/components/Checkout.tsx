import {
  Building2,
  CheckCircle2,
  Copy,
  Landmark,
  Loader2,
  Package,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatPEN } from '../data/products'
import { useCart } from '../lib/cart'
import {
  detectDocType,
  formatDocument,
  formatPhone,
  isValidDNI,
  isValidEmail,
  isValidOperationNumber,
  isValidPhone,
  isValidRUC,
  LIMA_DISTRICTS,
  pickCourier,
} from '../lib/peru'
import { generateOrderCode, saveOrder, type Order } from '../lib/orders'

const BANK_DATA = [
  {
    icon: Landmark,
    bank: 'BCP',
    type: 'Cuenta Soles',
    number: '194-1234567-0-12',
    cci: '00219400123456701234',
  },
  {
    icon: Building2,
    bank: 'Interbank',
    type: 'Cuenta Soles',
    number: '200-3000123456',
    cci: '00320000300012345601',
  },
]

type FormState = {
  name: string
  email: string
  phone: string
  doc: string
  address: string
  district: string
  reference: string
  bank: string
  operation: string
  receiptType: 'boleta' | 'factura'
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  doc: '',
  address: '',
  district: '',
  reference: '',
  bank: 'BCP',
  operation: '',
  receiptType: 'boleta',
}

type Status = 'form' | 'validating' | 'done'

export function Checkout({
  onDone,
  onTrackOrder,
}: {
  onDone: () => void
  onTrackOrder: (code: string) => void
}) {
  const { itemsWithProduct, totals, clear } = useCart()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('form')
  const [order, setOrder] = useState<Order | null>(null)

  const docType = detectDocType(form.doc)
  const courier = useMemo(
    () => (form.district ? pickCourier(form.district) : null),
    [form.district],
  )

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Ingresa tu nombre completo'
    if (!isValidEmail(form.email)) e.email = 'Correo inválido'
    if (!isValidPhone(form.phone)) e.phone = 'Celular peruano: 9XX XXX XXX'
    if (form.receiptType === 'boleta' && !isValidDNI(form.doc))
      e.doc = 'DNI: 8 dígitos'
    if (form.receiptType === 'factura' && !isValidRUC(form.doc))
      e.doc = 'RUC: 11 dígitos (inicia en 10, 15, 17 o 20)'
    if (!form.address.trim()) e.address = 'Ingresa la dirección de entrega'
    if (!form.district) e.district = 'Elige tu distrito'
    if (!isValidOperationNumber(form.operation))
      e.operation = 'N° de operación: 6-12 dígitos'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    if (itemsWithProduct.length === 0) return

    setStatus('validating')

    // Simulated validation delay (4 seconds)
    setTimeout(() => {
      const code = generateOrderCode()
      const newOrder: Order = {
        code,
        createdAt: Date.now(),
        status: 'validated',
        statusUpdatedAt: Date.now(),
        items: itemsWithProduct.map(({ product, qty }) => ({
          productId: product.id,
          qty,
        })),
        subtotal: totals.subtotal,
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/\D/g, ''),
          docType: docType ?? (form.receiptType === 'factura' ? 'RUC' : 'DNI'),
          doc: form.doc.replace(/\D/g, ''),
          address: form.address.trim(),
          district: form.district,
          reference: form.reference.trim() || undefined,
        },
        bank: form.bank,
        operationNumber: form.operation.replace(/\D/g, ''),
        courier: courier ?? { name: 'Olva Courier', eta: '24-48 horas' },
      }
      saveOrder(newOrder)
      setOrder(newOrder)
      clear()
      setStatus('done')
    }, 4000)
  }

  /* ============== RENDER ============== */

  if (status === 'validating') {
    return <ValidatingScreen bank={form.bank} />
  }

  if (status === 'done' && order) {
    return (
      <SuccessScreen
        order={order}
        onTrackOrder={() => onTrackOrder(order.code)}
        onContinue={onDone}
      />
    )
  }

  if (itemsWithProduct.length === 0) {
    return (
      <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-20 text-center">
        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
        <button
          onClick={onDone}
          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
        >
          ← Volver al catálogo
        </button>
      </section>
    )
  }

  return (
    <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-1.5 block">
            Checkout
          </span>
          <h1 className="text-[2rem] font-semibold text-black dark:text-white tracking-tight">
            Paga por transferencia bancaria
          </h1>
          <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
            Validamos tu transferencia en menos de 30 minutos en horario bancario.
            Único método de pago, sin pasarelas, sin sorpresas.
          </p>
        </header>

        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            {/* Tipo de comprobante */}
            <Card title="Tipo de comprobante" step={1}>
              <div className="grid grid-cols-2 gap-3">
                <ReceiptRadio
                  active={form.receiptType === 'boleta'}
                  title="Boleta"
                  subtitle="Para personas naturales (DNI)"
                  onClick={() => {
                    setForm({ ...form, receiptType: 'boleta', doc: '' })
                    setErrors({ ...errors, doc: undefined })
                  }}
                />
                <ReceiptRadio
                  active={form.receiptType === 'factura'}
                  title="Factura"
                  subtitle="Para empresas (RUC)"
                  onClick={() => {
                    setForm({ ...form, receiptType: 'factura', doc: '' })
                    setErrors({ ...errors, doc: undefined })
                  }}
                />
              </div>
            </Card>

            {/* Datos del cliente */}
            <Card title="Tus datos" step={2}>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Nombre completo" error={errors.name} required>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    placeholder="Julio César Medrano"
                  />
                </Field>
                <Field
                  label={form.receiptType === 'factura' ? 'RUC' : 'DNI'}
                  error={errors.doc}
                  required
                >
                  <input
                    value={form.doc}
                    onChange={(e) =>
                      setForm({ ...form, doc: formatDocument(e.target.value) })
                    }
                    className="input"
                    placeholder={
                      form.receiptType === 'factura' ? '20123456789' : '12345678'
                    }
                    inputMode="numeric"
                    maxLength={11}
                  />
                </Field>
                <Field label="Correo" error={errors.email} required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    placeholder="tu@correo.com"
                  />
                </Field>
                <Field label="Celular" error={errors.phone} required>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: formatPhone(e.target.value) })
                    }
                    className="input"
                    placeholder="9XX XXX XXX"
                    inputMode="tel"
                  />
                </Field>
              </div>
            </Card>

            {/* Entrega */}
            <Card title="Dirección de entrega" step={3}>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Distrito" error={errors.district} required>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="input"
                  >
                    <option value="">Selecciona tu distrito</option>
                    {LIMA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Dirección completa" error={errors.address} required>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input"
                    placeholder="Av. ej. 123, Dpto 4"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Referencia (opcional)">
                    <input
                      value={form.reference}
                      onChange={(e) => setForm({ ...form, reference: e.target.value })}
                      className="input"
                      placeholder="Frente al parque, edificio azul…"
                    />
                  </Field>
                </div>
              </div>

              {courier && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30 p-3">
                  <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[12.5px] text-black dark:text-white font-semibold">
                      Despacha {courier.name}
                    </p>
                    <p className="text-[11.5px] text-gray-600 dark:text-gray-400">
                      Tiempo estimado: <strong>{courier.eta}</strong>. Envío incluido en el precio.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Datos bancarios */}
            <Card title="Transfiere a una de estas cuentas" step={4}>
              <div className="space-y-3">
                {BANK_DATA.map((b) => (
                  <label
                    key={b.bank}
                    className={`flex items-start gap-3 rounded-2xl p-4 ring-1 cursor-pointer transition-all ${
                      form.bank === b.bank
                        ? 'ring-yellow-400 bg-yellow-400/5'
                        : 'ring-black/10 dark:ring-white/10 hover:ring-yellow-400/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bank"
                      value={b.bank}
                      checked={form.bank === b.bank}
                      onChange={(e) => setForm({ ...form, bank: e.target.value })}
                      className="sr-only"
                    />
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/15 ring-1 ring-yellow-400/30 flex items-center justify-center shrink-0">
                      <b.icon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-black dark:text-white">
                        {b.bank} · <span className="text-gray-500 font-normal">{b.type}</span>
                      </p>
                      <div className="mt-2 grid sm:grid-cols-2 gap-2">
                        <CopyRow label="Cuenta" value={b.number} onCopy={copy} copied={copied} />
                        <CopyRow label="CCI" value={b.cci} onCopy={copy} copied={copied} />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Confirmación */}
            <Card title="Confirma tu transferencia" step={5}>
              <Field label="N° de operación de tu banco" error={errors.operation} required>
                <input
                  value={form.operation}
                  onChange={(e) =>
                    setForm({ ...form, operation: e.target.value.replace(/\D/g, '').slice(0, 12) })
                  }
                  className="input"
                  placeholder="Ej. 00123456789"
                  inputMode="numeric"
                />
              </Field>
              <label className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-yellow-400/40 px-4 py-3 cursor-pointer text-[12.5px] text-gray-700 dark:text-gray-300">
                <Upload className="w-4 h-4 text-yellow-500" />
                <span>Adjunta tu voucher (PDF, JPG o PNG) — opcional</span>
                <input type="file" className="sr-only" accept=".pdf,image/*" />
              </label>

              <div className="mt-4 flex items-start gap-2 text-[11.5px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <span>
                  Tus datos están protegidos bajo la Ley N° 29733 — Ley de Protección de Datos
                  Personales. Solo los usamos para validar el pago y coordinar la entrega.
                </span>
              </div>
            </Card>
          </div>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl p-5 bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-md">
            <h3 className="text-[13px] font-semibold text-black dark:text-white mb-3">Resumen</h3>
            <ul className="space-y-2 mb-4">
              {itemsWithProduct.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-2 text-[12px]">
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {product.name} <span className="text-gray-400">× {qty}</span>
                  </span>
                  <span className="font-medium text-black dark:text-white shrink-0">
                    {formatPEN(product.price * qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-black/5 dark:border-white/10 pt-3 space-y-1.5 mb-4">
              <Row label="Subtotal" value={formatPEN(totals.subtotal)} />
              <Row label="Envío" value="Incluido" highlight />
              <Row label="IGV (18%)" value="Incluido" muted />
            </div>
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-[13px] font-semibold text-black dark:text-white">Total</span>
              <span className="text-[20px] font-bold text-black dark:text-white">
                {formatPEN(totals.subtotal)}
              </span>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full py-3.5 transition-colors duration-200 shadow-[0_8px_24px_-6px_rgba(250,204,21,0.7)]"
            >
              Confirmar pedido
            </button>
            <p className="mt-2 text-center text-[10.5px] text-gray-500 dark:text-gray-400">
              Al confirmar aceptas validar tu transferencia con Mowi.
            </p>
          </aside>
        </form>
      </div>
    </section>
  )
}

/* ============== SUB-COMPONENTS ============== */

function Card({
  title,
  step,
  children,
}: {
  title: string
  step: number
  children: React.ReactNode
}) {
  return (
    <div className="relative rounded-3xl p-5 bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-yellow-400 text-black text-[12px] font-bold flex items-center justify-center">
          {step}
        </span>
        <h3 className="text-[14px] font-semibold text-black dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
        {label} {required && <span className="text-yellow-600">*</span>}
      </span>
      {children}
      {error && (
        <span className="block mt-1 text-[10.5px] text-red-500 font-medium">{error}</span>
      )}
    </label>
  )
}

function ReceiptRadio({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl p-3 ring-1 transition-all ${
        active
          ? 'ring-yellow-400 bg-yellow-400/5'
          : 'ring-black/10 dark:ring-white/10 hover:ring-yellow-400/40'
      }`}
    >
      <p className="text-[13px] font-semibold text-black dark:text-white">{title}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{subtitle}</p>
    </button>
  )
}

function CopyRow({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string
  value: string
  onCopy: (text: string, label: string) => void
  copied: string | null
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-black/5 dark:bg-white/5 px-2 py-1.5">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 shrink-0">
        {label}
      </span>
      <span className="text-[12px] font-mono text-black dark:text-white truncate flex-1">
        {value}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onCopy(value, `${label}-${value}`)
        }}
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        {copied === `${label}-${value}` ? (
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        ) : (
          <Copy className="w-3 h-3 text-gray-500" />
        )}
      </button>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
  muted,
}: {
  label: string
  value: string
  highlight?: boolean
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span
        className={
          highlight
            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
            : muted
              ? 'text-gray-500 dark:text-gray-500'
              : 'text-black dark:text-white font-medium'
        }
      >
        {value}
      </span>
    </div>
  )
}

/* ============== VALIDATING SPINNER ============== */

function ValidatingScreen({ bank }: { bank: string }) {
  const [step, setStep] = useState(0)
  const steps = [
    `Conectando con ${bank}…`,
    'Verificando N° de operación…',
    'Validando monto transferido…',
    'Generando código de pedido…',
  ]
  if (step < steps.length - 1) {
    setTimeout(() => setStep((s) => s + 1), 1000)
  }

  return (
    <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-400/15 ring-1 ring-yellow-400/30 flex items-center justify-center mx-auto mb-5">
          <Loader2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-spin" strokeWidth={2} />
        </div>
        <h1 className="text-[1.6rem] font-semibold text-black dark:text-white mb-3">
          Validando tu transferencia
        </h1>
        <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-8">
          Esto tarda menos de 30 segundos en la demo.
          <br />En producción, hasta 30 minutos en horario bancario.
        </p>
        <ul className="text-left space-y-2 max-w-sm mx-auto">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-3 text-[13px] transition-opacity ${
                i <= step ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {i < step ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : i === step ? (
                <Loader2 className="w-4 h-4 text-yellow-500 animate-spin shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full ring-1 ring-gray-300 dark:ring-gray-700 shrink-0" />
              )}
              <span className="text-gray-700 dark:text-gray-300">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ============== SUCCESS SCREEN ============== */

function SuccessScreen({
  order,
  onTrackOrder,
  onContinue,
}: {
  order: Order
  onTrackOrder: () => void
  onContinue: () => void
}) {
  return (
    <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-16">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={2} />
        </div>
        <h1 className="text-[1.8rem] font-semibold text-black dark:text-white mb-3">
          ¡Pago validado!
        </h1>
        <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Tu pedido fue confirmado. Te escribimos a{' '}
          <strong className="text-black dark:text-white">{order.customer.email}</strong>{' '}
          cuando tu paquete salga con {order.courier.name}.
        </p>

        <div className="inline-block rounded-2xl bg-white/80 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 px-6 py-4 mb-6">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Código de pedido
          </p>
          <p className="text-[22px] font-mono font-bold text-black dark:text-white">
            {order.code}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onTrackOrder}
            className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-6 py-3 transition-colors"
          >
            <Package className="w-4 h-4" strokeWidth={2.5} />
            Ver estado del pedido
          </button>
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white px-3 py-3 transition-colors"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </section>
  )
}
