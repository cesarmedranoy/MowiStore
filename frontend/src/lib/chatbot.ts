import { PRODUCTS } from '../data/products'
import type { Category, Product } from '../types'

export type ChatRole = 'bot' | 'user'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  productIds?: string[]
  suggestions?: string[]
  ts: number
}

export type ChatReply = {
  text: string
  products: Product[]
  suggestions?: string[]
}

/* ============================================================
   REAL AI via Pollinations (free, no key required, CORS-enabled)
   ============================================================ */

const AI_ENDPOINT = 'https://text.pollinations.ai/openai'
const AI_MODEL = 'openai'
const AI_TIMEOUT_MS = 9000

function buildSystemPrompt(): string {
  const catalog = PRODUCTS.map((p) => {
    const old = p.oldPrice ? ` (antes S/${p.oldPrice})` : ''
    return `- [${p.id}] ${p.brand} ${p.name} — ${p.category} · ${p.tagline} · S/${p.price}${old}`
  }).join('\n')

  return `Eres Mowi IA, asistente conversacional de Mowi Store: e-commerce de tecnología en Lima, Perú. Tu trabajo es ayudar al usuario a encontrar el producto correcto del catálogo.

CATÁLOGO DISPONIBLE (solo recomienda productos de esta lista):
${catalog}

CATEGORÍAS QUE VENDEMOS: laptops, smartphones, audífonos, cargadores, procesadores. NO vendemos otra cosa.

REGLAS:
- Responde en español peruano, breve (1-3 oraciones), tono amigable sin caer en cliché.
- Cuando recomiendes un producto, menciona su ID entre corchetes así: [rog-strix-g18]
- Si recomiendas varios, pon TODOS los IDs entre corchetes — uno por uno.
- Si el usuario pregunta por una categoría que no vendemos (TV, consola, accesorios, etc.), dile que solo tenemos las 5 categorías y sugiere algo del catálogo si aplica.
- No menciones comisión ni modelo de negocio. No menciones precios en el texto (el sistema los muestra automáticamente al renderizar el producto).
- Si te saludan, saluda de vuelta y pregunta qué buscan.
- Si te preguntan algo no relacionado con productos, redirige amablemente al catálogo.`
}

const SYSTEM_PROMPT = buildSystemPrompt()

type OAIMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function chatAI(
  userMessage: string,
  history: ChatMessage[] = [],
): Promise<ChatReply> {
  // Build messages from conversation history (last 6 messages, excluding system)
  const recentHistory: OAIMessage[] = history.slice(-6).map((m) => ({
    role: m.role === 'bot' ? 'assistant' : 'user',
    content: m.text,
  }))

  const payload = {
    model: AI_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory,
      { role: 'user', content: userMessage },
    ],
    seed: Math.floor(Math.random() * 1_000_000),
    private: true,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`AI API ${res.status}`)
    const data: { choices?: Array<{ message?: { content?: string } }> } = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() ?? ''
    if (!raw) throw new Error('Empty AI response')

    const { text, ids } = extractProductIds(raw)
    const products = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => !!p)
    return { text: text || raw, products }
  } catch (err) {
    clearTimeout(timeout)
    // Graceful fallback to rule-based
    const fallback = chatRuleBased(userMessage)
    return {
      ...fallback,
      text: fallback.text,
    }
  }
}

/* Extract [product-id] markers from AI text and remove them from output. */
function extractProductIds(text: string): { text: string; ids: string[] } {
  const seen = new Set<string>()
  const cleaned = text
    .replace(/\[([a-z0-9-]+)\]/gi, (match, id) => {
      const ok = PRODUCTS.some((p) => p.id === id)
      if (ok) {
        seen.add(id)
        return ''
      }
      return match
    })
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim()
  return { text: cleaned, ids: Array.from(seen) }
}

/* ============================================================
   FALLBACK: rule-based matcher (also used for greeting)
   ============================================================ */

const INTENT_RULES: Array<{ category: Category; keywords: string[] }> = [
  {
    category: 'laptop',
    keywords: [
      'laptop', 'notebook', 'portatil', 'portátil', 'computadora portatil',
      'macbook', 'gamer', 'gaming', 'rog', 'asus',
    ],
  },
  {
    category: 'smartphone',
    keywords: [
      'celular', 'celu', 'telefono', 'teléfono', 'smartphone', 'iphone',
      'galaxy', 'android', 'samsung',
    ],
  },
  {
    category: 'audio',
    keywords: [
      'audifonos', 'audífonos', 'auriculares', 'headphones', 'sony',
      'airpods', 'cancelacion', 'cancelación', 'anc',
    ],
  },
  {
    category: 'cargador',
    keywords: [
      'cargador', 'cargar', 'carga', 'charger', 'gan', 'usb-c',
      'anker', 'ugreen',
    ],
  },
  {
    category: 'procesador',
    keywords: [
      'procesador', 'cpu', 'gpu', 'tarjeta grafica', 'tarjeta gráfica',
      'rtx', 'nvidia', 'intel', 'i9', 'core',
    ],
  },
]

const CATEGORY_LABEL: Record<Category, string> = {
  laptop: 'laptops',
  smartphone: 'smartphones',
  audio: 'audífonos',
  cargador: 'cargadores',
  procesador: 'procesadores',
}

export function chatRuleBased(input: string): ChatReply {
  const txt = input.toLowerCase().trim()
  if (!txt) {
    return {
      text: 'Cuéntame qué buscas — por ejemplo "una laptop para edición de video".',
      products: [],
      suggestions: defaultSuggestions(),
    }
  }

  const hits = INTENT_RULES.filter((rule) => rule.keywords.some((kw) => txt.includes(kw)))

  if (hits.length === 1) {
    const cat = hits[0].category
    const matches = PRODUCTS.filter((p) => p.category === cat)
    return {
      text: `Aquí lo mejor en ${CATEGORY_LABEL[cat]} que tenemos:`,
      products: matches.sort((a, b) => b.rating - a.rating).slice(0, 3),
    }
  }

  if (/(gam|fps|rtx)/i.test(txt)) {
    return {
      text: 'Para gaming serio:',
      products: PRODUCTS.filter((p) => ['rog-strix-g18', 'rtx-4080-super'].includes(p.id)),
    }
  }
  if (/(hola|buenas|hey|hi)/i.test(txt)) {
    return greeting()
  }

  return {
    text: 'Por ahora me especializo en laptops, smartphones, audífonos, cargadores y procesadores. ¿Cuál te interesa?',
    products: [],
    suggestions: defaultSuggestions(),
  }
}

export function greeting(): ChatReply {
  return {
    text: '¡Hola! Soy Mowi IA 👋 Te ayudo a encontrar tecnología que se adapte a lo que necesitas. ¿Qué buscas hoy?',
    products: [],
    suggestions: defaultSuggestions(),
  }
}

function defaultSuggestions(): string[] {
  return ['Laptop gamer', 'Smartphone', 'Audífonos con ANC', 'Cargador rápido', 'Procesador']
}
