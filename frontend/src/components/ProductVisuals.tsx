import type { Product } from '../types'
import type { Face } from './Product3D'
import { LaptopBack, LaptopFront } from './visuals/Laptop3D'
import { PhoneBack, PhoneFront } from './visuals/Phone3D'
import { HeadphonesFront, HeadphonesSide } from './visuals/Headphones3D'
import { GenericBack, GenericFront } from './visuals/Generic3D'

/**
 * Returns the array of 3D faces to render for a given product.
 *
 * Custom visuals exist for the three landing carousel products
 * (ROG Strix G18, iPhone 16 Pro Max, Sony WH-1000XM5). Every other product
 * falls back to the editorial Generic 3D card (front + spec-callout back).
 */
export function facesForProduct(product: Product): Face[] {
  const wrap = (node: React.ReactNode) => (
    <div className="relative w-full h-full">{node}</div>
  )

  switch (product.id) {
    case 'rog-strix-g18':
      return [
        { rotateY: 0, depth: 40, render: () => wrap(<LaptopFront className="w-full h-full" />) },
        { rotateY: 180, depth: 40, render: () => wrap(<LaptopBack className="w-full h-full" />) },
      ]
    case 'iphone-16-pro':
      return [
        { rotateY: 0, depth: 26, render: () => wrap(<PhoneFront className="w-full h-full" />) },
        { rotateY: 180, depth: 26, render: () => wrap(<PhoneBack className="w-full h-full" />) },
      ]
    case 'wh-1000xm5':
      return [
        { rotateY: 0, depth: 30, render: () => wrap(<HeadphonesFront className="w-full h-full" />) },
        { rotateY: 180, depth: 30, render: () => wrap(<HeadphonesSide className="w-full h-full" />) },
      ]
    default:
      return [
        { rotateY: 0, depth: 30, render: () => wrap(<GenericFront product={product} />) },
        { rotateY: 180, depth: 30, render: () => wrap(<GenericBack product={product} />) },
      ]
  }
}
