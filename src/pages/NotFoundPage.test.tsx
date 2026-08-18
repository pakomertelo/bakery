import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('presenta una experiencia neutra para un producto no encontrado', () => {
    render(
      <MemoryRouter>
        <NotFoundPage product />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Producto no encontrado' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ir al catálogo' }),
    ).toHaveAttribute('href', '/catalogo')
    expect(screen.queryByText(/error|privado/i)).not.toBeInTheDocument()
  })
})
