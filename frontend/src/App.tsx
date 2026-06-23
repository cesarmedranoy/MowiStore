import { useEffect, useState } from 'react'
import { AnimatedBackground } from './components/AnimatedBackground'
import { Catalog } from './components/Catalog'
import { CartDrawer } from './components/CartDrawer'
import { ChatbotWidget } from './components/ChatbotWidget'
import { Checkout } from './components/Checkout'
import { FeaturedGrid } from './components/FeaturedGrid'
import { Footer } from './components/Footer'
import { HeroCarousel } from './components/HeroCarousel'
import { HeroLanding } from './components/HeroLanding'
import { HowItWorks } from './components/HowItWorks'
import { Navbar, type NavView } from './components/Navbar'
import { Orders } from './components/Orders'
import { ProductDetail } from './components/ProductDetail'
import { CartProvider } from './lib/cart'
import { schedulePrefetchModels } from './lib/preloadModels'
import { ThemeProvider } from './lib/theme'

function Shell() {
  const [view, setView] = useState<NavView>('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [highlightOrder, setHighlightOrder] = useState<string | null>(null)

  // Warm the HTTP cache with all product GLBs during idle time so navigating
  // around feels instant.
  useEffect(() => {
    schedulePrefetchModels()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view, selectedId])

  const goToProduct = (id: string) => {
    setSelectedId(id)
    setView('product')
  }

  const goToOrder = (code: string) => {
    setHighlightOrder(code)
    setView('orders')
  }

  return (
    <div className="relative min-h-screen text-black dark:text-white">
      <AnimatedBackground />
      <Navbar view={view} onNav={setView} />

      {view === 'home' && (
        <main>
          <HeroLanding onExplore={() => setView('catalog')} />
          <HeroCarousel onView={goToProduct} />
          <FeaturedGrid onView={goToProduct} />
          <HowItWorks />
        </main>
      )}

      {view === 'catalog' && <Catalog onView={goToProduct} />}

      {view === 'product' && selectedId && (
        <ProductDetail
          productId={selectedId}
          onBack={() => setView('catalog')}
          onView={goToProduct}
        />
      )}

      {view === 'checkout' && (
        <Checkout onDone={() => setView('home')} onTrackOrder={goToOrder} />
      )}

      {view === 'orders' && (
        <Orders highlightCode={highlightOrder} onView={goToProduct} />
      )}

      <Footer />

      <CartDrawer onCheckout={() => setView('checkout')} />
      <ChatbotWidget onViewProduct={goToProduct} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </ThemeProvider>
  )
}
