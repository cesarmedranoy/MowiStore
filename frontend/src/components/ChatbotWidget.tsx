import { MessageSquare, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { chatAI, greeting, type ChatMessage } from '../lib/chatbot'
import { findProduct, formatPEN } from '../data/products'
import { useCart } from '../lib/cart'

let idCounter = 0
const nextId = () => `m-${++idCounter}-${Date.now()}`

export function ChatbotWidget({
  onViewProduct,
}: {
  onViewProduct: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pulse, setPulse] = useState(true)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // Initialize greeting the first time it's opened
  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true
      const g = greeting()
      setTimeout(() => {
        setMessages([
          {
            id: nextId(),
            role: 'bot',
            text: g.text,
            suggestions: g.suggestions,
            ts: Date.now(),
          },
        ])
      }, 300)
    }
  }, [open])

  // Stop the button pulse the first time the user clicks it
  useEffect(() => {
    if (open) setPulse(false)
  }, [open])

  // Auto-scroll on new messages
  useEffect(() => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
  }, [messages, typing])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      text: trimmed,
      ts: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Build history snapshot for context (exclude the just-added user msg —
    // the AI gets it as the current input).
    const history = messages
    try {
      const reply = await chatAI(trimmed, history)
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'bot',
          text: reply.text,
          productIds: reply.products.map((p) => p.id),
          suggestions: reply.suggestions,
          ts: Date.now(),
        },
      ])
    } catch {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'bot',
          text: 'Tuve un problema conectándome. ¿Puedes repetirlo?',
          ts: Date.now(),
        },
      ])
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat con Mowi IA'}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-400 text-black shadow-2xl hover:scale-105 transition-transform"
      >
        {open ? (
          <X className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <>
            <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
            {pulse && (
              <span className="absolute inset-0 rounded-full ring-2 ring-yellow-400/60 animate-ping" />
            )}
          </>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-yellow-400 text-[9px] font-bold">
            <Sparkles className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
        )}
      </button>

      {/* Chat panel */}
      <aside
        className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-7rem))] rounded-3xl bg-white dark:bg-[#0E0E12] shadow-2xl ring-1 ring-black/10 dark:ring-white/10 flex flex-col origin-bottom-right transition-all duration-200 ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/10">
          <div className="relative w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" strokeWidth={2.5} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0E0E12]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-semibold text-black dark:text-white leading-tight">
              Mowi IA
            </p>
            <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400">
              En línea · responde al instante
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m) => (
            <MessageItem key={m.id} msg={m} onSend={send} onViewProduct={onViewProduct} />
          ))}
          {typing && <TypingDots />}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="border-t border-black/5 dark:border-white/10 p-3 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe lo que buscas…"
            className="flex-1 px-4 py-2.5 rounded-full bg-black/5 dark:bg-white/10 text-[13px] text-black dark:text-white placeholder:text-gray-400 outline-none focus:bg-black/10 dark:focus:bg-white/15 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </form>
      </aside>
    </>
  )
}

function MessageItem({
  msg,
  onSend,
  onViewProduct,
}: {
  msg: ChatMessage
  onSend: (text: string) => void
  onViewProduct: (id: string) => void
}) {
  const { add } = useCart()
  const isUser = msg.role === 'user'
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
          isUser
            ? 'bg-yellow-400 text-black rounded-tr-md'
            : 'bg-black/5 dark:bg-white/10 text-black dark:text-white rounded-tl-md'
        }`}
      >
        {msg.text}
      </div>

      {/* Product cards inline */}
      {msg.productIds && msg.productIds.length > 0 && (
        <div className="mt-3 w-full max-w-[85%] space-y-2">
          {msg.productIds.map((pid) => {
            const p = findProduct(pid)
            if (!p) return null
            return (
              <div
                key={pid}
                className="flex items-center gap-3 rounded-2xl p-2.5 bg-white dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-black/80 font-bold text-[10px]"
                  style={{
                    background: `linear-gradient(135deg, ${p.accentFrom}, ${p.accentTo})`,
                  }}
                >
                  {p.brand.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-black dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {formatPEN(p.price)} · {p.zone}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onViewProduct(p.id)}
                    className="text-[10.5px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-2.5 py-1 transition-colors"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => add(p.id)}
                    className="text-[10.5px] font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    + carrito
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Suggestion chips */}
      {msg.suggestions && msg.suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 max-w-[85%]">
          {msg.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="text-[11.5px] font-medium text-black dark:text-white bg-white dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/15 rounded-full px-3 py-1 hover:ring-yellow-400/60 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-start">
      <div className="bg-black/5 dark:bg-white/10 rounded-2xl rounded-tl-md px-3.5 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-300 animate-pulse-dot" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-300 animate-pulse-dot"
          style={{ animationDelay: '0.15s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-300 animate-pulse-dot"
          style={{ animationDelay: '0.3s' }}
        />
      </div>
    </div>
  )
}
