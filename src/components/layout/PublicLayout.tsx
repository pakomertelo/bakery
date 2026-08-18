import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  ['Inicio', '/'],
  ['Catálogo', '/catalogo'],
  ['Personalizado', '/personalizado'],
  ['Sobre nosotros', '/sobre-nosotros'],
  ['Contacto', '/contacto'],
] as const

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <NavLink className="text-lg font-semibold" to="/">
            Repostería
          </NavLink>
          <nav aria-label="Navegación principal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {navigation.map(([label, path]) => (
                <li key={path}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'font-semibold text-amber-800' : 'hover:text-amber-800'
                    }
                    end={path === '/'}
                    to={path}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-white px-5 py-6 text-center text-sm text-stone-600">
        Estructura provisional · Fase 0
      </footer>
    </div>
  )
}
