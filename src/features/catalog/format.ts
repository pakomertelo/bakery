import type { PriceMode } from './types'

export function formatMoney(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(cents / 100)
}

export function formatPrice(mode: PriceMode, cents: number | null, currency = 'EUR') {
  if (mode === 'quote') return 'Precio bajo consulta'
  if (cents === null) return null
  const amount = formatMoney(cents, currency)
  return mode === 'from' ? `Desde ${amount}` : amount
}

export function formatServings(min: number | null, max: number | null) {
  if (min !== null && max !== null) return min === max ? `${min} raciones` : `${min}–${max} raciones`
  if (min !== null) return `Desde ${min} raciones`
  if (max !== null) return `Hasta ${max} raciones`
  return null
}
