import { useQuery } from '@tanstack/react-query'
import { getSiteSettings, siteQueryKeys } from './queries'

export function useSiteSettings() {
  return useQuery({ queryKey: siteQueryKeys.settings, queryFn: getSiteSettings })
}
