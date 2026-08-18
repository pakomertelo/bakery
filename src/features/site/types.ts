export interface SiteSettings {
  business_name: string
  business_description: string
  public_phone: string | null
  public_email: string | null
  address: string | null
  opening_hours: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  accepting_orders: boolean
  closed_orders_message: string
  allergen_general_notice: string | null
  hero_title: string
  hero_subtitle: string | null
  hero_image: string | null
  custom_orders_title: string
  custom_orders_description: string | null
  about_title: string | null
  about_description: string | null
  about_image: string | null
}
