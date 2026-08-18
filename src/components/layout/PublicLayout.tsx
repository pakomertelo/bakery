import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSiteSettings } from '../../features/site/hooks'
import { BusinessDetails } from '../../features/site/BusinessDetails'

const navigation = [['Inicio','/'],['Catálogo','/catalogo'],['Personalizados','/personalizado'],['Sobre nosotros','/sobre-nosotros'],['Contacto','/contacto']] as const

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const settings = useSiteSettings()
  const name = settings.data?.business_name ?? 'Repostería artesanal'
  return <div className="flex min-h-screen flex-col bg-[#fdfaf7] text-stone-900">
    <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">Saltar al contenido</a>
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fdfaf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight text-rose-950" onClick={() => setOpen(false)}>{name}</Link>
        <button type="button" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold md:hidden" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? 'Cerrar' : 'Menú'}</button>
        <nav className="hidden md:block" aria-label="Navegación principal"><ul className="flex items-center gap-6 text-sm font-medium">{navigation.map(([label,path]) => <li key={path}><NavLink end={path === '/'} className={({isActive}) => isActive ? 'text-rose-800 underline decoration-rose-300 underline-offset-8' : 'hover:text-rose-800'} to={path}>{label}</NavLink></li>)}<li><Link className="rounded-full bg-rose-900 px-5 py-2.5 text-white hover:bg-rose-800" to="/solicitud">Solicitar</Link></li></ul></nav>
      </div>
      {open && <nav id="mobile-navigation" aria-label="Navegación móvil" className="border-t border-stone-200 bg-white px-5 py-5 md:hidden"><ul className="space-y-1">{navigation.map(([label,path]) => <li key={path}><NavLink end={path === '/'} onClick={() => setOpen(false)} className={({isActive}) => `block rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-rose-50 text-rose-900' : ''}`} to={path}>{label}</NavLink></li>)}<li><Link onClick={() => setOpen(false)} className="mt-3 block rounded-xl bg-rose-900 px-4 py-3 text-center font-semibold text-white" to="/solicitud">Solicitar</Link></li></ul></nav>}
    </header>
    <main id="contenido" className="flex-1"><Outlet /></main>
    <footer className="mt-20 bg-stone-900 text-stone-200"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8"><div><p className="font-serif text-2xl font-semibold text-white">{name}</p>{settings.data?.business_description && <p className="mt-3 max-w-sm text-sm leading-6 text-stone-400">{settings.data.business_description}</p>}</div>{settings.data && <BusinessDetails settings={settings.data} compact />}<div><p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Información</p><div className="mt-3 grid gap-2 text-sm"><Link to="/aviso-legal">Aviso legal</Link><Link to="/privacidad">Privacidad</Link><Link to="/cookies">Cookies</Link><Link to="/condiciones">Condiciones</Link></div></div></div><p className="border-t border-stone-800 px-5 py-5 text-center text-xs text-stone-500">© {new Date().getFullYear()} {name}</p></footer>
  </div>
}
