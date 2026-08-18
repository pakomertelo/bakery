import { Link } from 'react-router-dom'
import { CatalogImage } from '../../components/CatalogImage'
import { formatPrice } from './format'
import type { Product } from './types'

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]
  return <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md">
    <Link to={`/catalogo/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
      <CatalogImage path={image?.path} alt={image?.alt_text || product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      {!product.available && <span className="absolute left-4 top-4 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">No disponible</span>}
    </Link>
    <div className="flex flex-1 flex-col p-5">
      {product.category && <p className="text-xs font-semibold uppercase tracking-[.16em] text-rose-700">{product.category.name}</p>}
      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight"><Link to={`/catalogo/${product.slug}`} className="hover:text-rose-800">{product.name}</Link></h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{product.short_description}</p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-5"><p className="font-semibold text-stone-900">{formatPrice(product.price_mode, product.base_price_cents, product.currency)}</p><Link className="text-sm font-semibold text-rose-800 underline decoration-rose-200 underline-offset-4" to={`/catalogo/${product.slug}`}>Consultar</Link></div>
    </div>
  </article>
}
