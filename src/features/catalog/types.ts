export type PriceMode = 'fixed' | 'from' | 'quote'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_path: string | null
}

export interface ProductImage {
  id: string
  path: string
  alt_text: string
  sort_order: number
  is_primary: boolean
}

export interface ProductVariant {
  id: string
  name: string
  description: string | null
  price_cents: number | null
  servings_min: number | null
  servings_max: number | null
}

export interface NamedItem { id: string; name: string }

export interface Product {
  id: string
  slug: string
  name: string
  short_description: string
  description: string
  price_mode: PriceMode
  base_price_cents: number | null
  currency: string
  available: boolean
  featured: boolean
  category: Category | null
  images: ProductImage[]
  variants: ProductVariant[]
  flavours: NamedItem[]
  allergens: NamedItem[]
}
