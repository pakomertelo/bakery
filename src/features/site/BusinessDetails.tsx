import type { SiteSettings } from './types'

export function BusinessDetails({ settings, compact = false }: { settings: SiteSettings; compact?: boolean }) {
  const socials = [['Instagram', settings.instagram_url], ['Facebook', settings.facebook_url], ['TikTok', settings.tiktok_url]].filter((item): item is [string,string] => Boolean(item[1]))
  const details = [
    settings.public_phone && { label: 'Teléfono', value: <a href={`tel:${settings.public_phone.replace(/\s/g, '')}`}>{settings.public_phone}</a> },
    settings.public_email && { label: 'Email', value: <a href={`mailto:${settings.public_email}`}>{settings.public_email}</a> },
    settings.address && { label: 'Dirección', value: settings.address },
    settings.opening_hours && { label: 'Horario', value: settings.opening_hours },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[]
  if (!details.length && !socials.length) return null
  return <div className={compact ? 'space-y-3 text-sm' : 'grid gap-4 sm:grid-cols-2'}>
    {details.map((detail) => <div key={detail.label} className={compact ? '' : 'rounded-2xl bg-white p-5 ring-1 ring-stone-200'}><p className="text-xs font-semibold uppercase tracking-wider text-rose-700">{detail.label}</p><div className="mt-1 break-words text-stone-700 [&_a]:underline [&_a]:underline-offset-4">{detail.value}</div></div>)}
    {socials.length > 0 && <div className={compact ? '' : 'rounded-2xl bg-white p-5 ring-1 ring-stone-200'}><p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Redes</p><div className="mt-2 flex flex-wrap gap-3">{socials.map(([name,url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{name}<span className="sr-only"> (abre en otra pestaña)</span></a>)}</div></div>}
  </div>
}
