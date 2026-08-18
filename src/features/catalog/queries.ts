import { supabase, supabaseConfigurationError } from '../../lib/supabase'
import type { Category, NamedItem, Product, ProductImage, ProductVariant } from './types'

export const catalogQueryKeys = {
  categories: ['categories'] as const,
  products: (category?: string) => ['products', category ?? 'all'] as const,
  featured: ['products', 'featured'] as const,
  detail: (slug: string) => ['product', slug] as const,
}

function client() {
  if (!supabase) throw new Error(supabaseConfigurationError ?? 'Supabase no está configurado.')
  return supabase
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await client().from('categories').select('id,name,slug,description,image_path').order('sort_order')
  if (error) throw error
  return data as unknown as Category[]
}

const productSelect = 'id,slug,name,short_description,description,price_mode,base_price_cents,currency,available,featured,category:categories(id,name,slug,description,image_path),images:product_images(id,path,alt_text,sort_order,is_primary)'

type RawProduct = Omit<Product, 'images' | 'variants' | 'flavours' | 'allergens'> & { images: ProductImage[] }

function normalize(raw: RawProduct): Product {
  return { ...raw, images: [...(raw.images ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order), variants: [], flavours: [], allergens: [] }
}

export async function getProducts(categorySlug?: string, featured = false): Promise<Product[]> {
  let query = client().from('products').select(productSelect).order('sort_order')
  if (categorySlug) query = query.eq('categories.slug', categorySlug)
  if (featured) query = query.eq('featured', true)
  const { data, error } = await query
  if (error) throw error
  return (data as unknown as RawProduct[]).filter((item) => !categorySlug || item.category?.slug === categorySlug).map(normalize)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await client().from('products').select(productSelect).eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!data) return null
  const product = normalize(data as unknown as RawProduct)
  const [variants, flavourLinks, allergenLinks] = await Promise.all([
    client().from('product_variants').select('id,name,description,price_cents,servings_min,servings_max').eq('product_id', product.id).order('sort_order'),
    client().from('product_flavours').select('flavour:flavours(id,name)').eq('product_id', product.id),
    client().from('product_allergens').select('allergen:allergens(id,name)').eq('product_id', product.id),
  ])
  const failure = variants.error ?? flavourLinks.error ?? allergenLinks.error
  if (failure) throw failure
  return {
    ...product,
    variants: variants.data as unknown as ProductVariant[],
    flavours: (flavourLinks.data as unknown as { flavour: NamedItem | null }[]).flatMap(({ flavour }) => flavour ? [flavour] : []),
    allergens: (allergenLinks.data as unknown as { allergen: NamedItem | null }[]).flatMap(({ allergen }) => allergen ? [allergen] : []),
  }
}
