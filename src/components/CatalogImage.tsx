import { getCatalogImageUrl } from '../lib/storage'
import { useState } from 'react'

export function CatalogImage({ path, alt, className = '', eager = false }: { path?: string | null; alt: string; className?: string; eager?: boolean }) {
  const url = getCatalogImageUrl(path)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  if (!url || failedUrl === url) return <div className={`image-fallback ${className}`} role="img" aria-label={`Sin imagen: ${alt}`}><span aria-hidden="true">✦</span></div>
  return <img src={url} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} onError={() => setFailedUrl(url)} />
}
