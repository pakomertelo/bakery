import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCategories, useFeaturedProducts } from '../features/catalog/hooks'
import { useSiteSettings } from '../features/site/hooks'
import type { SiteSettings } from '../features/site/types'
import { queryResult } from '../test/queryResult'
import { HomePage } from './HomePage'

vi.mock('../features/catalog/hooks')
vi.mock('../features/site/hooks')

const closedSettings: SiteSettings = {
  business_name: 'Repostería DEMO',
  business_description: 'Descripción DEMO',
  public_phone: null,
  public_email: null,
  address: null,
  opening_hours: null,
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
  accepting_orders: false,
  closed_orders_message: 'Agenda completa esta semana.',
  allergen_general_notice: null,
  hero_title: 'Repostería artesanal',
  hero_subtitle: null,
  hero_image: null,
  custom_orders_title: 'Productos personalizados',
  custom_orders_description: null,
  about_title: null,
  about_description: null,
  about_image: null,
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useSiteSettings).mockReturnValue(
      queryResult<ReturnType<typeof useSiteSettings>>(closedSettings),
    )
    vi.mocked(useFeaturedProducts).mockReturnValue(
      queryResult<ReturnType<typeof useFeaturedProducts>>([]),
    )
    vi.mocked(useCategories).mockReturnValue(
      queryResult<ReturnType<typeof useCategories>>([]),
    )
  })

  it('muestra el cierre configurado sin ocultar el acceso al catálogo', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByText('Solicitudes temporalmente cerradas'),
    ).toBeInTheDocument()
    expect(screen.getByText('Agenda completa esta semana.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver catálogo' })).toHaveAttribute(
      'href',
      '/catalogo',
    )
  })
})
