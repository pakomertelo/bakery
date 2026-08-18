import { describe, expect, it } from 'vitest'
import { formatPrice, formatServings } from './format'

describe('formatPrice', () => {
  it('formatea precios fijos en EUR', () => expect(formatPrice('fixed', 2500)).toBe('25,00 €'))
  it('añade Desde a precios variables', () => expect(formatPrice('from', 1800)).toBe('Desde 18,00 €'))
  it('muestra consulta sin importe', () => expect(formatPrice('quote', null)).toBe('Precio bajo consulta'))
  it('no inventa un importe fijo ausente', () => expect(formatPrice('fixed', null)).toBeNull())
})

describe('formatServings', () => {
  it('crea un rango legible', () => expect(formatServings(6, 8)).toBe('6–8 raciones'))
  it('omite un rango completamente vacío', () => expect(formatServings(null, null)).toBeNull())
})
