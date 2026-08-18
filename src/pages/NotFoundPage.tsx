import { Link } from 'react-router-dom'
export function NotFoundPage({ context = 'public', product = false }: { context?: 'public' | 'admin'; product?: boolean }) {
  if(context==='admin') return <section><h1 className="text-3xl font-semibold">Página no encontrada</h1><Link to="/admin">Volver al panel</Link></section>
  return <section className="page-shell py-20 text-center"><p className="font-serif text-7xl text-rose-200">404</p><h1 className="mt-4 page-title">{product ? 'Producto no encontrado' : 'Página no encontrada'}</h1><p className="mx-auto mt-5 max-w-lg text-stone-600">{product ? 'Este producto no existe o no está disponible públicamente.' : 'La dirección indicada no existe.'}</p><div className="mt-8 flex justify-center gap-3"><Link className="button-primary" to="/catalogo">Ir al catálogo</Link><Link className="button-secondary" to="/">Volver al inicio</Link></div></section>
}
