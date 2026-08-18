import { useQuery } from '@tanstack/react-query'
import { catalogQueryKeys, getCategories, getProductBySlug, getProducts } from './queries'

export const useCategories = () => useQuery({ queryKey: catalogQueryKeys.categories, queryFn: getCategories })
export const useProducts = (category?: string) => useQuery({ queryKey: catalogQueryKeys.products(category), queryFn: () => getProducts(category) })
export const useFeaturedProducts = () => useQuery({ queryKey: catalogQueryKeys.featured, queryFn: () => getProducts(undefined, true) })
export const useProduct = (slug: string) => useQuery({ queryKey: catalogQueryKeys.detail(slug), queryFn: () => getProductBySlug(slug) })
