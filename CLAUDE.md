# Mowi Store — guía para Claude

Plataforma e-commerce intermediaria de productos tecnológicos para Lima Metropolitana. Equipo de Tecsup (Julio backend/IA, Arnold frontend, Anderson QA, Jheremy marketing). Modelo cross-docking sin inventario, comisión 6%.

## Stack acordado

**Frontend** (`/frontend`)
- React 19 + Vite 6 + TypeScript 5.7
- Tailwind CSS v4 con `@tailwindcss/vite` (NO hay `tailwind.config.js` — los tokens están en `src/index.css` bajo `@theme {}`)
- lucide-react para iconos
- Paleta: amarillo `#FACC15`, amber `#EAB308`, negro `#0A0A0A`, cream `#FFFDF5`
- Restricción: el usuario pidió mantener deps mínimas (react, react-dom, lucide-react, tailwind). NO agregar libs sin preguntar.

**Backend** (`/backend`) — pendiente de implementar
- Django 5 + Django REST Framework
- scikit-learn para sistema de recomendación (lo más importante del proyecto según el usuario)

**Supabase fue removido** (decisión de Julio, 2026-06-22): el proyecto es para un curso de Marketing e Innovación, así que toda la compra está **simulada** en frontend con `localStorage` (no hay base de datos real). Cuando el backend Django entre, ahí sí se usará Postgres directo (no Supabase).

**Compra simulada peruana realista** ([lib/peru.ts](frontend/src/lib/peru.ts), [lib/orders.ts](frontend/src/lib/orders.ts)):
- Validación DNI (8 dig) / RUC (11 dig, prefijos 10/15/17/20) según boleta/factura
- Selector de 43 distritos de Lima Metropolitana
- Auto-asigna courier según distrito: InDrive Moto (express) para distritos centrales, Olva Courier para periféricos
- N° operación 6-12 dígitos (formato bancario PE)
- Genera código `MS-YYMM-XXXXXX` por pedido
- Status timeline: validating → validated → preparing → shipping → delivered (auto-avanza cada 12s en demo via setInterval)
- Persiste pedidos en `localStorage['mowi-orders']`
- Vista "Mis Pedidos" ([Orders.tsx](frontend/src/components/Orders.tsx)) muestra timeline visual en tiempo real

**Chatbot Mowi IA** corre en el frontend y usa **Pollinations.ai** como LLM gratuito (POST a `https://text.pollinations.ai/openai`, sin API key, CORS abierto). El system prompt contiene el catálogo completo y el bot devuelve recomendaciones marcando los productos como `[product-id]` — el frontend parsea esos IDs y renderiza tarjetas inline. Si la API falla, cae a un matcher rule-based local. Cuando el backend Django esté listo, mover esta llamada a `/api/chat` para usar scikit-learn + cache server-side.

**Modelos 3D reales** ([Model3DViewer.tsx](frontend/src/components/Model3DViewer.tsx)) — three.js + @react-three/fiber + @react-three/drei. Soporta GLB, GLTF (+ bin + texturas) y OBJ (+ MTL). OrbitControls para drag/zoom/orbit. Lazy-loaded vía [LazyModel3DViewer.tsx](frontend/src/components/LazyModel3DViewer.tsx) — solo se descarga cuando hay un `product.modelPath` que mostrar (~291KB gzip).

Los modelos van en `frontend/public/models/<product-id>/` (ej. `frontend/public/models/rog-strix-g18/scene.gltf`). Luego se agrega `modelPath: '/models/rog-strix-g18/scene.gltf'` al producto en [data/products.ts](frontend/src/data/products.ts) y automáticamente lo usa la card carousel + ficha. Productos sin `modelPath` siguen usando el [Product3D.tsx](frontend/src/components/Product3D.tsx) (SVG faces front+back).

**Pago**: ÚNICO método = transferencia bancaria. No agregar Stripe/Culqi/Mercado Pago. Está justificado en el informe (sección 1.7.2) para eliminar pasarelas y maximizar margen del 6%.

**Logística**: Olva Courier (camión) + InDrive Moto (express). Asignación interna según producto/zona. Costo absorbido en precio único.

## Decisiones de diseño tomadas

- Hero **sin video** por ahora — gradiente animado con CSS blobs (radial yellow + amber + subtle black) + capa de grain SVG. Cuando Julio consiga el render de motionslite.ai, sustituir los `<div class="animate-blob">` por un `<video>` element absoluto en el mismo contenedor `-z-0`.
- Layout del hero replica el template que el usuario pasó: navbar pill centrado + contenido bottom-left + max-w-md. NO mover esto sin razón fuerte.
- Highlighter amarillo bajo "Lima" en el headline (palabra clave del producto).
- Trust strip con 3 íconos lucide: ShieldCheck, Truck, dot verde animado. Refuerza confianza (el informe identifica desconfianza como amenaza clave).

## Roadmap por sesiones

- [x] **S1** (esta): Hero landing + skeleton monorepo
- [ ] **S2**: Resto de secciones landing (cómo funciona, productos destacados mock, proveedores, footer) + routing (`react-router-dom`)
- [ ] **S3**: Backend Django scaffold (apps `accounts`, `catalog`, `suppliers`, `orders`, `payments`, `reviews`, `recommendations`)
- [ ] **S4**: Esquema Supabase + RLS + conectar frontend (cliente Supabase) y backend (psycopg)
- [ ] **S5**: Recomendador scikit-learn (content-based TF-IDF + collaborative filtering)
- [ ] **S6**: Catálogo + ficha de producto + carrito (frontend + endpoints)
- [ ] **S7**: Checkout con transferencia bancaria + validación manual
- [ ] **S8**: Panel admin (productos, clientes, proveedores, pedidos, comisiones, reseñas)
- [ ] **S9**: Reseñas verificadas (solo compradores) + recomendador hibridizado con reseñas
- [ ] **S10**: QA + deploy en Hostinger Premium

## Comandos

```bash
# Frontend
cd frontend
npm install
npm run dev    # localhost:5173
npm run build  # production build
npm run lint   # tsc --noEmit type check
```

El preview tool de Claude Code está configurado en `.claude/launch.json` con `name: frontend`.

## Cosas que NO hacer

- No añadir libs frontend sin preguntar (el usuario fue explícito).
- No proponer otros métodos de pago — la transferencia bancaria es decisión de negocio justificada.
- No usar `tailwind.config.js` — Tailwind v4 va por `@theme` en CSS.
- No tocar el layout base del hero sin justificar (replica intencional del template).
- No commitear `.env` ni credenciales de Supabase.

## Notas del informe (contexto de negocio)

- Mercado objetivo: 1.89M personas en Lima Metropolitana (de 9.42M con internet, 20.1% encuestados dirían que usarían Mowi).
- Encuestas: n=384 clientes, n=80 proveedores.
- Crecimiento ecommerce Perú: 18% anual (CAPECE).
- Régimen tributario: MYPE Tributario. CIIU 5251.
- Equity model: equipo no cobra sueldo, aporta trabajo como participación.
