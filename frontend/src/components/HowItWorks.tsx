import { Banknote, PackageCheck, Search, Truck } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    title: 'Explora con IA',
    body: 'Nuestro recomendador con scikit-learn te muestra lo que realmente buscas, en segundos.',
  },
  {
    icon: Banknote,
    title: 'Paga por transferencia',
    body: 'Único método. Sin pasarelas, sin sorpresas. Datos bancarios listos al confirmar.',
  },
  {
    icon: PackageCheck,
    title: 'Validamos el pago',
    body: 'Mowi confirma tu transferencia y coordina con el proveedor en Wilson, Mesa Redonda o Arenales.',
  },
  {
    icon: Truck,
    title: 'Te llega a Lima',
    body: 'Olva Courier para envíos estándar, InDrive Moto para entregas express. Envío incluido.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative z-10 px-6 sm:px-12 lg:px-20 py-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 mb-2 block">
            Cómo funciona
          </span>
          <h2 className="text-[1.8rem] sm:text-[2.2rem] font-semibold text-black dark:text-white tracking-tight max-w-2xl mx-auto leading-[1.1]">
            Cuatro pasos. Cero fricción.
          </h2>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="relative rounded-3xl p-6 bg-white/60 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-md hover:ring-yellow-400/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-black text-yellow-400 dark:bg-yellow-400 dark:text-black text-[12px] font-bold flex items-center justify-center ring-4 ring-[color:var(--color-mowi-cream)] dark:ring-[#08080A]">
                {i + 1}
              </span>
              <div className="w-11 h-11 rounded-2xl bg-yellow-400/15 dark:bg-yellow-400/10 ring-1 ring-yellow-400/30 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-semibold text-black dark:text-white mb-1.5">
                {title}
              </h3>
              <p className="text-[12.5px] text-gray-600 dark:text-gray-400 leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
