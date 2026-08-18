import type { Database } from '../types/database.types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurationError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env.local y añade los valores locales.'
    : null

if (supabaseConfigurationError && import.meta.env.DEV) {
  console.warn(supabaseConfigurationError)
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null
