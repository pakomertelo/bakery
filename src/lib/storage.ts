import { supabase } from './supabase'

export function getCatalogImageUrl(path: string | null | undefined) {
  if (!path || !supabase) return null
  return supabase.storage.from('catalog-public').getPublicUrl(path).data.publicUrl
}
