export function LoadingState({ label = 'Cargando contenido…' }: { label?: string }) {
  return <div className="py-16 text-center text-stone-600" role="status"><span className="mb-4 inline-block h-7 w-7 animate-spin rounded-full border-2 border-rose-200 border-t-rose-700" /><p>{label}</p></div>
}

export function ErrorState({ message = 'No hemos podido cargar el contenido. Inténtalo de nuevo en unos minutos.' }: { message?: string }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-950" role="alert"><h2 className="font-serif text-xl font-semibold">Algo no ha ido bien</h2><p className="mt-2 text-sm">{message}</p></div>
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-3xl bg-stone-100 px-6 py-14 text-center"><h2 className="font-serif text-2xl font-semibold">{title}</h2><p className="mx-auto mt-3 max-w-lg text-stone-600">{children}</p></div>
}
