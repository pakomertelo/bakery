import { Link } from 'react-router-dom'
export function RequestInfoPage() {
  return (
    <div className="page-shell py-20">
      <div className="mx-auto max-w-2xl rounded-3xl bg-rose-50 p-8 text-center sm:p-12">
        <p className="eyebrow">Solicitudes</p>
        <h1 className="page-title">¿Tienes algo en mente?</h1>
        <p className="mt-5 leading-7 text-stone-700">
          Consulta el catálogo o descubre nuestras propuestas personalizadas. Si
          necesitas más información, ponte en contacto con el negocio y
          cuéntanos tu idea.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="button-primary" to="/catalogo">
            Ver catálogo
          </Link>
          <Link className="button-secondary" to="/contacto">
            Contacto
          </Link>
        </div>
      </div>
    </div>
  )
}
