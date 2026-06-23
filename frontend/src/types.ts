export type Category =
  | 'laptop'
  | 'smartphone'
  | 'audio'
  | 'cargador'
  | 'procesador'

export type IconKey = 'laptop' | 'phone' | 'headphones' | 'charger' | 'cpu'

export type Spec = { label: string; value: string }

export type Feature = {
  title: string
  body: string
  highlight: string
}

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  category: Category
  price: number // PEN
  oldPrice?: number
  rating: number // 0-5
  reviews: number
  zone: 'Wilson' | 'Mesa Redonda' | 'Arenales'
  supplier: string
  stock: number
  star?: boolean
  tagline: string
  description: string
  specs: Spec[]
  features: Feature[]
  accentFrom: string
  accentTo: string
  iconKey: IconKey
  /**
   * Path to the 3D model under /public. When set, the carousel and detail
   * page render a real Model3DViewer instead of the SVG fallback.
   * Format detected from extension (.glb, .gltf, .obj).
   */
  modelPath?: string
  /** Optional .mtl path when modelPath points to an .obj. */
  modelMtlPath?: string
}

export type CartItem = {
  productId: string
  qty: number
}
