import { Link } from 'react-router-dom'

export function NotFoundPage({ context = 'public' }: { context?: 'public' | 'admin' }) {
  const destination = context === 'admin' ? '/admin' : '/'
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-8">
      <p className="text-sm font-semibold text-amber-800">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Página no encontrada</h1>
      <p className="mt-4 text-stone-600">La dirección indicada no existe.</p>
      <Link className="mt-6 inline-block font-medium text-amber-800 underline" to={destination}>
        Volver al inicio
      </Link>
    </section>
  )
}
