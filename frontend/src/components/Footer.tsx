export function Footer() {
  return (
    <footer
      id="soporte"
      className="relative z-10 px-6 sm:px-12 lg:px-28 pt-16 pb-10 border-t border-black/5 dark:border-white/5 mt-20"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img
            src="/logo_mowistore.png"
            alt="Mowi Store"
            className="w-28 mb-4 select-none"
            loading="lazy"
            decoding="async"
          />
          <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
            Tecnología confiable, directo a tu puerta. Curada por IA, entregada en Lima.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Comprar
          </h4>
          <ul className="space-y-2 text-[13px] text-gray-700 dark:text-gray-300">
            <li><a href="#" className="hover:text-black dark:hover:text-white">Catálogo completo</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Laptops</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Smartphones</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Audífonos</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Cargadores</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Procesadores</a></li>
          </ul>
        </div>

        <div id="proveedores">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Proveedores
          </h4>
          <ul className="space-y-2 text-[13px] text-gray-700 dark:text-gray-300">
            <li>Wilson — Cercado</li>
            <li>Mesa Redonda — Cercado</li>
            <li>Arenales — Lince</li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Ser proveedor →</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Soporte
          </h4>
          <ul className="space-y-2 text-[13px] text-gray-700 dark:text-gray-300">
            <li><a href="#" className="hover:text-black dark:hover:text-white">Ayuda</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Garantía</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Política de privacidad</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white">Contacto</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500 dark:text-gray-500">
        <span>© 2026 Mowi Store · Lima, Perú</span>
        <span className="font-mono">Hostinger · Hecho con ♥ por equipo Tecsup</span>
      </div>
    </footer>
  )
}
