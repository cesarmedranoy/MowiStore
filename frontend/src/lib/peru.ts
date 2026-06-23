/* Peruvian validators + Lima districts. Used by the simulated checkout. */

export type DocType = 'DNI' | 'RUC'

export function detectDocType(value: string): DocType | null {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 8) return 'DNI'
  if (digits.length === 11 && (digits.startsWith('10') || digits.startsWith('20') || digits.startsWith('15') || digits.startsWith('17'))) return 'RUC'
  return null
}

export function isValidDNI(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return /^\d{8}$/.test(digits)
}

export function isValidRUC(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (!/^\d{11}$/.test(digits)) return false
  const validPrefixes = ['10', '15', '17', '20']
  return validPrefixes.includes(digits.slice(0, 2))
}

export function isValidPhone(value: string): boolean {
  // Peruvian mobile: 9XX XXX XXX (9 digits starting with 9)
  const digits = value.replace(/\D/g, '')
  return /^9\d{8}$/.test(digits)
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidOperationNumber(value: string): boolean {
  // Bank operation numbers in PE are typically 6-12 digits
  const digits = value.replace(/\D/g, '')
  return /^\d{6,12}$/.test(digits)
}

export function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
}

export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
}

/* All 43 districts of Lima Metropolitana (INEI) */
export const LIMA_DISTRICTS = [
  'Ancón',
  'Ate',
  'Barranco',
  'Breña',
  'Carabayllo',
  'Chaclacayo',
  'Chorrillos',
  'Cieneguilla',
  'Comas',
  'El Agustino',
  'Independencia',
  'Jesús María',
  'La Molina',
  'La Victoria',
  'Lima (Cercado)',
  'Lince',
  'Los Olivos',
  'Lurigancho',
  'Lurín',
  'Magdalena del Mar',
  'Miraflores',
  'Pachacámac',
  'Pucusana',
  'Pueblo Libre',
  'Puente Piedra',
  'Punta Hermosa',
  'Punta Negra',
  'Rímac',
  'San Bartolo',
  'San Borja',
  'San Isidro',
  'San Juan de Lurigancho',
  'San Juan de Miraflores',
  'San Luis',
  'San Martín de Porres',
  'San Miguel',
  'Santa Anita',
  'Santa María del Mar',
  'Santa Rosa',
  'Santiago de Surco',
  'Surquillo',
  'Villa El Salvador',
  'Villa María del Triunfo',
] as const

export type LimaDistrict = (typeof LIMA_DISTRICTS)[number]

/* Districts in the InDrive Moto express zone (central + nearby) */
const EXPRESS_DISTRICTS = new Set<LimaDistrict>([
  'Lima (Cercado)', 'Barranco', 'Breña', 'Jesús María', 'La Victoria', 'Lince', 'Magdalena del Mar',
  'Miraflores', 'Pueblo Libre', 'San Borja', 'San Isidro', 'San Luis', 'San Miguel',
  'Santiago de Surco', 'Surquillo',
])

export type Courier = {
  name: 'Olva Courier' | 'InDrive Moto'
  eta: string
}

export function pickCourier(district: string): Courier {
  if (EXPRESS_DISTRICTS.has(district as LimaDistrict)) {
    return { name: 'InDrive Moto', eta: '2-4 horas (express)' }
  }
  return { name: 'Olva Courier', eta: '24-48 horas' }
}
