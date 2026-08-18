import type { Database } from '../types/database.types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function createConfiguredSupabaseClient(
  url: string | undefined,
  publishableKey: string | undefined,
) {
  if (!url || !publishableKey) {
    return {
      client: null,
      error:
        'Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env.local y añade los valores locales.',
    }
  }

  return {
    client: createClient<Database>(url, publishableKey),
    error: null,
  }
}

const configuredSupabase = createConfiguredSupabaseClient(
  supabaseUrl,
  supabaseAnonKey,
)

export const supabaseConfigurationError = configuredSupabase.error

if (supabaseConfigurationError && import.meta.env.DEV) {
  console.warn(supabaseConfigurationError)
}

export const supabase = configuredSupabase.client
