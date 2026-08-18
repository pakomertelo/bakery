import { supabase, supabaseConfigurationError } from '../../lib/supabase'
import type { SiteSettings } from './types'

export const siteQueryKeys = { settings: ['site-settings'] as const }

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabase) throw new Error(supabaseConfigurationError ?? 'Supabase no está configurado.')
  const { data, error } = await supabase.from('site_settings').select('*').single()
  if (error) throw error
  return data as unknown as SiteSettings
}
