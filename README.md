# Mowi Store

Plataforma e-commerce intermediaria especializada en productos tecnológicos para Lima Metropolitana. Conecta tiendas minoristas de Wilson, Mesa Redonda y Arenales con consumidores finales mediante un sistema de recomendación basado en IA.

Equipo Tecsup: Julio Medrano (backend/IA), Arnold Alva (frontend), Anderson Ninahuaman (QA), Jheremy Strong (marketing).

---

## Stack actual

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 6 + TypeScript 5.7 + Tailwind CSS v4 |
| 3D | three.js + @react-three/fiber + @react-three/drei |
| Iconos | lucide-react |
| Chatbot IA | Pollinations API (gratuita, sin API key) |
| Persistencia | localStorage (compra simulada para el curso) |
| Pago | Transferencia bancaria (único método) |
| Logística | Olva Courier (estándar) + InDrive Moto (express) |
| Backend | Django + DRF + scikit-learn (próxima sesión) |

---

## Requisitos

- **Node.js 20+** ([nodejs.org/es/download](https://nodejs.org/es/download))
- **npm 10+** (viene con Node)
- Git
- (Opcional) VS Code con extensiones: ESLint, Tailwind CSS IntelliSense, TypeScript Vue Plugin

Verifica tu versión:

```bash
node --version   # debe ser >= v20
npm --version    # debe ser >= 10
```

---

## Instalación local

### 1. Clonar el repo

```bash
git clone <url-del-repo>
cd MowiStore
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

Tarda 1-2 minutos la primera vez (instala ~100 paquetes).

### 3. Levantar el dev server

```bash
npm run dev
```

Abre **[http://localhost:5173](http://localhost:5173)** en el navegador. El servidor hace HMR (hot reload), guarda y refresca solo.

### Comandos disponibles (dentro de `/frontend`)

```bash
npm run dev       # dev server con HMR (localhost:5173)
npm run build     # build de producción a /dist (chequea TypeScript)
npm run preview   # sirve el build de /dist en localhost:4173 para verificar
npm run lint      # type-check sin emitir archivos
```

---

## Estructura del proyecto

```
MowiStore/
├── frontend/                       # SPA React + Vite
│   ├── public/                     # Assets estáticos (logos, modelos 3D .glb)
│   │   ├── *.glb                   # Modelos 3D de productos
│   │   ├── air pods/               # AirPods Pro 3D (carpeta)
│   │   └── logo_mowistore.png
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Model3DViewer.tsx   # Viewer 3D principal con OrbitControls
│   │   │   ├── ProductCard.tsx     # Card de catálogo (3D on-hover)
│   │   │   ├── HeroCarousel.tsx    # Carousel de productos estrella
│   │   │   ├── ProductDetail.tsx   # Ficha producto inmersiva
│   │   │   ├── Checkout.tsx        # Checkout simulado peruano
│   │   │   ├── Orders.tsx          # Mis Pedidos con timeline
│   │   │   ├── ChatbotWidget.tsx   # Chatbot IA flotante
│   │   │   ├── Catalog.tsx, Navbar.tsx, Footer.tsx, etc.
│   │   │   └── visuals/            # SVGs fallback para productos sin .glb
│   │   ├── lib/
│   │   │   ├── chatbot.ts          # Cliente Pollinations IA
│   │   │   ├── orders.ts           # localStorage + timeline de pedidos
│   │   │   ├── peru.ts             # Validadores DNI/RUC + distritos Lima
│   │   │   ├── cart.tsx            # CartProvider context
│   │   │   ├── theme.tsx           # Dark/light mode
│   │   │   └── useProductRotation.ts, useMouseTilt.ts, etc.
│   │   ├── data/products.ts        # Catálogo (11 productos, specs reales)
│   │   ├── App.tsx, main.tsx, index.css, types.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                        # Placeholder (pendiente: Django + scikit-learn)
├── vercel.json                     # Config de deploy
├── CLAUDE.md                       # Notas técnicas internas
└── README.md
```

---

## Deploy a Vercel

### Opción 1: Desde el dashboard de Vercel (recomendado)

1. Push tu repo a GitHub / GitLab / Bitbucket
2. Entra a [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
3. Selecciona tu repo `MowiStore`
4. En la pantalla de configuración:
   - **Framework Preset**: detecta Vite automáticamente
   - **Root Directory**: dejá vacío (el `vercel.json` lo maneja)
   - **Build Command**: lo lee del `vercel.json`
   - **Output Directory**: lo lee del `vercel.json`
5. Click **Deploy**

En ~2 minutos te da una URL tipo `https://mowi-store.vercel.app`.

### Opción 2: Vercel CLI

```bash
npm i -g vercel
cd MowiStore
vercel
```

Seguí las preguntas. La primera vez te conecta tu cuenta.

### Notas para Vercel

- El build instala deps en `/frontend` y compila a `/frontend/dist` (configurado en `vercel.json`)
- El archivo `vercel.json` también incluye una rewrite rule para que la SPA funcione (todas las rutas sirven `index.html`)
- Los modelos 3D `.glb` (~50MB total) se sirven como assets estáticos desde el CDN de Vercel — ojo con el ancho de banda en el plan gratuito (100GB/mes)
- No hay variables de entorno requeridas (la app corre 100% en frontend)

---

## Funcionalidades implementadas

### Landing
- Hero con título highlighted ("La tienda tech que se siente **viva**")
- Carousel de 3 productos estrella con modelos 3D reales rotando (ROG Strix Scar 17, iPhone 16 Pro Max, AirPods Pro)
- Grid de productos recomendados
- "Cómo funciona" en 4 pasos
- Dark/light mode toggle (persiste en localStorage)
- Fondo animado con blobs amarillos drifting + spotlight que sigue al cursor

### Catálogo (11 productos)
- 3 laptops: ROG Strix Scar 17 G733, ROG Zephyrus G15, MacBook Ultra Concept
- 3 smartphones: iPhone 16 Pro Max, Galaxy S25 Ultra, Galaxy S24 Ultra
- 3 audio: AirPods Pro, Galaxy Buds Live, JBL Charge 5
- 1 cargador: Anker Prime 100W
- 1 procesador: NVIDIA RTX 4080 Super
- Filtros por categoría + búsqueda por nombre/marca
- 3D on-hover: pasa el mouse sobre una card y el modelo aparece girando
- Productos sin `.glb` muestran ícono Lucide centrado (cargador, GPU)

### Ficha de producto
- Modelo 3D grande con drag-to-rotate 360°, zoom in/out, fullscreen
- Especificaciones técnicas en grid
- Features destacadas con scroll-reveal (parallax IntersectionObserver)
- Reseñas verificadas mockeadas
- Productos similares
- Sticky buy bar al hacer scroll

### Compra simulada estilo peruano
- **Validación DNI** (8 dígitos) o **RUC** (11 dígitos, prefijos 10/15/17/20) según boleta/factura
- Selector con **43 distritos de Lima Metropolitana**
- Courier auto-asignado: **InDrive Moto** (express, 2-4h) para distritos centrales, **Olva Courier** (24-48h) para periféricos
- N° de operación bancaria (6-12 dígitos)
- Datos bancarios BCP + Interbank con botón **copiar**
- Pantalla de validación con spinner (4s simulado)
- Código de pedido tipo `MS-2606-ABC123`
- Persiste el pedido en `localStorage['mowi-orders']`

### Mis Pedidos
- Vista accesible desde el icono Package en navbar (aparece solo si tienes pedidos)
- Timeline visual con 5 status: Validando → Pago validado → Preparando → En camino → Entregado
- Auto-avanza cada 12 segundos para el demo (en producción cambia el setInterval por un poll real)

### Chatbot Mowi IA
- Botón flotante amarillo abajo-derecha con pulso
- Inicia la conversación: *"¡Hola! Soy Mowi IA 👋 ¿Qué buscas hoy?"*
- Usa **Pollinations.ai** como LLM gratuito (POST a `https://text.pollinations.ai/openai`, sin API key, CORS abierto)
- System prompt con el catálogo completo — el LLM solo recomienda productos reales
- Parsea menciones tipo `[product-id]` del LLM y renderiza tarjetas de producto **inline** en el chat
- Fallback rule-based si la API falla
- Suggestion chips: "Laptop gamer", "Smartphone", "Audífonos con ANC", etc.

---

## Notas técnicas

### Performance
- **Three.js + drei lazy-loaded** (~268KB gzip) — solo se descarga cuando el usuario realmente ve/interactúa con un modelo 3D
- **Cards usan 3D on-hover** (no al cargar la página) — cero WebGL contexts en estado idle, scroll fluido
- **Prefetch de modelos del carousel** a los 4 segundos via `requestIdleCallback` — el catálogo se siente instantáneo
- Bundle inicial: ~96KB gzipped (sin three.js)
- Animaciones CSS-only con `transform: translate3d` y `will-change` estratégico
- `prefers-reduced-motion` respetado

### Por qué no usamos Supabase
El proyecto es para el curso de **Marketing e Innovación** de Tecsup, así que la compra está **100% simulada en frontend** con `localStorage`. Cuando entre el backend Django se reemplaza el localStorage por llamadas reales a la API.

### Por qué solo transferencia bancaria
Decisión de negocio justificada en el informe técnico (sección 1.7.2). Elimina costos de pasarelas (Culqi, Mercado Pago) y maximiza el margen del 6% desde el primer mes.

### Sobre los modelos 3D
- Vienen en formato `.glb` (Binary glTF) descargados de Sketchfab con textura 1k
- Cargados con `useGLTF` de drei
- `Bounds` auto-fit con margin razonable (1.1 inline, 1.25 fullscreen)
- OrbitControls con auto-rotate suave por defecto, drag para rotar, scroll para zoom
- Productos sin `modelPath` muestran un fallback de ícono Lucide centrado

---

## Roadmap

- [x] **S1-S4**: Frontend completo (landing, catálogo, ficha, checkout simulado, chatbot, dark mode, 3D real)
- [ ] **S5**: Backend Django REST scaffold (apps `accounts`, `catalog`, `suppliers`, `orders`, `payments`, `reviews`)
- [ ] **S6**: Recomendador con scikit-learn (content-based TF-IDF + collaborative filtering)
- [ ] **S7**: Conectar frontend al backend real (reemplazar localStorage)
- [ ] **S8**: Panel admin (gestión de productos, clientes, proveedores, pedidos, comisiones)
- [ ] **S9**: Sistema de reseñas verificadas + hibridación con recomendador
- [ ] **S10**: QA E2E + deploy productivo

---

## Soporte

¿Dudas? Pregunta a Julio (backend/IA), Arnold (frontend), Anderson (QA) o Jheremy (marketing/docs).
