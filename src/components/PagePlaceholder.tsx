interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-800">Fase 0</p>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-4 max-w-2xl text-stone-600">{description}</p>
    </section>
  )
}
