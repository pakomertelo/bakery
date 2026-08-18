export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type GeneratedTable = {
  Row: { [column: string]: Json | undefined }
  Insert: { [column: string]: Json | undefined }
  Update: { [column: string]: Json | undefined }
  Relationships: []
}

/**
 * Bootstrap contract for the generated Supabase client. Regenerate this file from
 * the applied local schema with `npm run supabase:types` before closing Phase 1.
 */
export type Database = {
  public: {
    Tables: {
      admin_profiles: GeneratedTable
      site_settings: GeneratedTable
      categories: GeneratedTable
      products: GeneratedTable
      product_images: GeneratedTable
      product_variants: GeneratedTable
      flavours: GeneratedTable
      product_flavours: GeneratedTable
      allergens: GeneratedTable
      product_allergens: GeneratedTable
      availability_blocks: GeneratedTable
      orders: GeneratedTable
      order_items: GeneratedTable
      custom_order_details: GeneratedTable
      order_reference_images: GeneratedTable
      order_status_history: GeneratedTable
      email_events: GeneratedTable
    }
    Views: Record<PropertyKey, never>
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      get_public_availability: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          start_date: string
          end_date: string
          public_message: string | null
        }[]
      }
    }
    Enums: {
      admin_role: 'admin'
      price_mode: 'fixed' | 'from' | 'quote'
      order_type: 'catalog' | 'custom'
      order_status:
        | 'new'
        | 'pending_confirmation'
        | 'confirmed'
        | 'in_preparation'
        | 'ready'
        | 'completed'
        | 'cancelled'
        | 'no_response'
      fulfilment_type: 'pickup' | 'delivery'
    }
    CompositeTypes: Record<PropertyKey, never>
  }
}
