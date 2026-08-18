import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProductCard } from './ProductCard'
import type { Product } from './types'

vi.mock('../../lib/storage', () => ({ getCatalogImageUrl: () => null }))
const product: Product = { id:'1',slug:'demo',name:'Tarta DEMO',short_description:'Descripción',description:'Completa',price_mode:'quote',base_price_cents:null,currency:'EUR',available:false,featured:false,category:null,images:[],variants:[],flavours:[],allergens:[] }
describe('ProductCard',()=>{it('mantiene visible un producto no disponible, sin imagen y bajo consulta',()=>{render(<MemoryRouter><ProductCard product={product}/></MemoryRouter>);expect(screen.getByText('Tarta DEMO')).toBeInTheDocument();expect(screen.getByText('No disponible')).toBeInTheDocument();expect(screen.getByText('Precio bajo consulta')).toBeInTheDocument();expect(screen.getByRole('img',{name:/Sin imagen/})).toBeInTheDocument()})})
