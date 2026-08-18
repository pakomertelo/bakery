import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CatalogImage } from '../components/CatalogImage'
import { ErrorState, LoadingState } from '../components/ui/AsyncState'
import { formatMoney, formatPrice, formatServings } from '../features/catalog/format'
import { useProduct } from '../features/catalog/hooks'
import { useSiteSettings } from '../features/site/hooks'
import { NotFoundPage } from './NotFoundPage'

export function ProductPage() {
  const { slug = '' } = useParams()
  const query = useProduct(slug)
  const settings = useSiteSettings()
  const [selected, setSelected] = useState(0)
  if (query.isLoading) return <div className="page-shell"><LoadingState label="Cargando producto…" /></div>
  if (query.isError) return <div className="page-shell py-16"><ErrorState /></div>
  if (!query.data) return <NotFoundPage product />
  const product = query.data
  const image = product.images[selected] ?? product.images[0]
  return <article className="page-shell py-10 sm:py-16"><Link to={product.category ? `/catalogo?categoria=${product.category.slug}` : '/catalogo'} className="text-sm font-semibold text-rose-800">← Volver al catálogo</Link>
    <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-16"><div><div className="aspect-[4/3] overflow-hidden rounded-3xl bg-stone-100"><CatalogImage eager path={image?.path} alt={image?.alt_text || product.name} className="h-full w-full object-cover" /></div>{product.images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3" aria-label="Galería de imágenes">{product.images.map((item,index) => <button key={item.id} type="button" aria-label={`Ver imagen ${index + 1}: ${item.alt_text || product.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className="aspect-square overflow-hidden rounded-xl ring-2 ring-offset-2 aria-pressed:ring-rose-700"><CatalogImage path={item.path} alt="" className="h-full w-full object-cover" /></button>)}</div>}</div>
      <div>{product.category && <p className="eyebrow">{product.category.name}</p>}<h1 className="page-title">{product.name}</h1><p className="mt-5 text-lg leading-8 text-stone-600">{product.short_description}</p><div className="mt-6 flex flex-wrap items-center gap-3"><p className="text-xl font-bold">{formatPrice(product.price_mode, product.base_price_cents, product.currency)}</p><span className={`rounded-full px-3 py-1 text-sm font-semibold ${product.available ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-700'}`}>{product.available ? 'Disponible para consultar' : 'No disponible actualmente'}</span></div><p className="mt-8 whitespace-pre-line leading-7 text-stone-700">{product.description}</p></div></div>
    {product.variants.length > 0 && <section className="detail-section"><h2>Variantes y tamaños</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{product.variants.map((variant) => <div key={variant.id} className="rounded-2xl border border-stone-200 bg-white p-5"><div className="flex justify-between gap-3"><h3 className="font-semibold">{variant.name}</h3>{variant.price_cents !== null && <strong>{formatMoney(variant.price_cents, product.currency)}</strong>}</div>{variant.description && <p className="mt-2 text-sm text-stone-600">{variant.description}</p>}{formatServings(variant.servings_min,variant.servings_max) && <p className="mt-3 text-sm font-medium text-rose-800">{formatServings(variant.servings_min,variant.servings_max)}</p>}</div>)}</div></section>}
    {product.flavours.length > 0 && <section className="detail-section"><h2>Sabores disponibles</h2><ul className="mt-4 flex flex-wrap gap-2">{product.flavours.map((flavour) => <li className="rounded-full bg-rose-50 px-4 py-2 text-sm" key={flavour.id}>{flavour.name}</li>)}</ul></section>}
    <section className="detail-section border-amber-200 bg-amber-50"><h2>Información sobre alérgenos</h2>{product.allergens.length ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">{product.allergens.map((allergen) => <li key={allergen.id} className="flex gap-2"><span aria-hidden="true">•</span>{allergen.name}</li>)}</ul> : <p className="mt-4 text-stone-700">No hay alérgenos específicos indicados para este producto. Consulta con el negocio antes de realizar una solicitud.</p>}{settings.data?.allergen_general_notice && <p className="mt-5 border-t border-amber-200 pt-5 text-sm leading-6">{settings.data.allergen_general_notice}</p>}</section>
  </article>
}
