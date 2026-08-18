import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { useCategories, useProducts } from '../features/catalog/hooks'
import { queryResult } from '../test/queryResult'
import { CatalogPage } from './CatalogPage'

vi.mock('../features/catalog/hooks')

describe('CatalogPage', () => {
  it('utiliza el slug de categoría presente en la URL', () => {
    vi.mocked(useCategories).mockReturnValue(
      queryResult<ReturnType<typeof useCategories>>([]),
    )
    vi.mocked(useProducts).mockReturnValue(
      queryResult<ReturnType<typeof useProducts>>([]),
    )

    render(
      <MemoryRouter initialEntries={['/catalogo?categoria=tartas-demo']}>
        <CatalogPage />
      </MemoryRouter>,
    )

    expect(useProducts).toHaveBeenCalledWith('tartas-demo')
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
  })
})
