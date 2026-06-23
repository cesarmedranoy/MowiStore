import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'

export function HeroLanding({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-16 pb-6">
      <div className="max-w-3xl">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-[11.5px] font-medium text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white mb-5 group bg-white/70 dark:bg-white/10 hover:bg-white/95 dark:hover:bg-white/15 ring-1 ring-black/10 dark:ring-white/15 rounded-full pl-2 pr-3 py-1 transition-all duration-200 backdrop-blur-sm w-fit"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 text-black px-2 py-0.5 text-[10.5px] font-semibold">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Nuevo
          </span>
          <span className="flex items-center gap-1">
            Recomendación con IA · Lima Tech 2026
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </a>

        <h1 className="text-[2.4rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.02] font-semibold text-black dark:text-white tracking-tight mb-5">
          La tienda tech que se siente{' '}
          <span className="relative inline-block">
            <span className="relative z-10">viva.</span>
            <span
              className="absolute left-0 right-0 bottom-1 sm:bottom-2 h-3 sm:h-4 -z-0 rounded-sm"
              style={{ backgroundColor: 'rgba(250, 204, 21, 0.55)' }}
            />
          </span>
        </h1>

        <p className="text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300 font-normal mb-6 leading-relaxed max-w-2xl">
          Productos curados de Wilson, Mesa Redonda y Arenales — con{' '}
          <strong className="text-black dark:text-white font-semibold">
            recomendación por IA
          </strong>{' '}
          y experiencia interactiva. Pago por transferencia bancaria. Envío con Olva Courier e InDrive Moto.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-full px-5 py-3 transition-all duration-200 group shadow-[0_6px_20px_-4px_rgba(250,204,21,0.7)] hover:shadow-[0_10px_28px_-4px_rgba(250,204,21,0.9)] hover:-translate-y-0.5"
          >
            Explorar catálogo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </button>

          <a
            href="#producto-estrella"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('producto-estrella')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white px-3 py-3 transition-colors group"
          >
            Ver producto estrella
            <span className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" strokeWidth={2} />
            Reseñas verificadas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" strokeWidth={2} />
            Envío incluido en Lima
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            Soporte en menos de 30 minutos
          </span>
        </div>
      </div>
    </section>
  )
}
