import { describe, expect, it } from 'vitest'

import { createConfiguredSupabaseClient } from './supabase'

describe('cliente Supabase', () => {
  it('expone un error claro y no crea un cliente si falta configuración', () => {
    const configuration = createConfiguredSupabaseClient(undefined, undefined)

    expect(configuration.client).toBeNull()
    expect(configuration.error).toContain('VITE_SUPABASE_URL')
    expect(configuration.error).toContain('VITE_SUPABASE_ANON_KEY')
  })

  it('crea el cliente cuando recibe configuración pública completa', () => {
    const configuration = createConfiguredSupabaseClient(
      'http://127.0.0.1:54321',
      'sb_publishable_test-only',
    )

    expect(configuration.client).not.toBeNull()
    expect(configuration.error).toBeNull()
  })
})
