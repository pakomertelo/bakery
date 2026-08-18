import { useSearchParams } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/AsyncState'
import { ProductCard } from '../features/catalog/ProductCard'
import { useCategories, useProducts } from '../features/catalog/hooks'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const selected = params.get('categoria') ?? undefined
  const categories = useCategories()
  const products = useProducts(selected)
  const setCategory = (slug?: string) => setParams(slug ? { categoria: slug } : {}, { replace: false })
  return <div className="page-shell py-12 sm:py-16"><header className="max-w-2xl"><p className="eyebrow">Nuestro catálogo</p><h1 className="page-title">Dulces preparados con calma</h1><p className="mt-5 text-lg leading-8 text-stone-600">Explora nuestras propuestas. Cada solicitud se revisa personalmente antes de confirmar disponibilidad y detalles.</p></header>
    <section className="mt-10" aria-labelledby="catalog-title"><h2 id="catalog-title" className="sr-only">Productos</h2>
      {categories.isLoading ? <div className="h-11" /> : categories.isError ? <ErrorState /> : <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3" aria-label="Filtrar por categoría"><button className={`filter-pill ${!selected ? 'filter-pill-active' : ''}`} onClick={() => setCategory()}>Todos</button>{categories.data?.map((category) => <button key={category.id} className={`filter-pill ${selected === category.slug ? 'filter-pill-active' : ''}`} onClick={() => setCategory(category.slug)}>{category.name}</button>)}</div>}
      <div className="mt-7">{products.isLoading ? <LoadingState label="Preparando el catálogo…" /> : products.isError ? <ErrorState /> : !products.data?.length ? <EmptyState title="No hay productos en esta categoría">Puedes consultar el catálogo completo o volver más adelante.</EmptyState> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.data.map((product) => <ProductCard product={product} key={product.id} />)}</div>}</div>
    </section></div>
}
