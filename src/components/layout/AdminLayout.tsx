import { NavLink, Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-300 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <NavLink className="font-semibold" to="/admin">
            Administración
          </NavLink>
          <NavLink className="text-sm text-slate-200 hover:text-white" to="/">
            Volver a la web
          </NavLink>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-12">
        <Outlet />
      </main>
    </div>
  )
}
