import { describe, expect, it } from 'vitest'

import { supabase, supabaseConfigurationError } from './supabase'

describe('cliente Supabase', () => {
  it('expone un error claro y no crea un cliente si falta configuración', () => {
    expect(supabase).toBeNull()
    expect(supabaseConfigurationError).toContain('VITE_SUPABASE_URL')
  })
})
