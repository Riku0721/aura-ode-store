// Auto-generated types matching the Supabase schema
// Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID` to regenerate

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin' | 'staff'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          compare_price: number | null
          sku: string | null
          category_id: string | null
          tags: string[]
          is_active: boolean
          is_featured: boolean
          weight_grams: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string | null
          price_adjustment: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          quantity: number
          low_stock_threshold: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inventory']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          shipping_name: string
          shipping_phone: string
          shipping_city: string
          shipping_district: string
          shipping_address: string
          shipping_postal_code: string | null
          subtotal: number
          shipping_fee: number
          discount_amount: number
          total: number
          coupon_code: string | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'unpaid' | 'paid' | 'refunded'
          payment_method: string | null
          payment_reference: string | null
          carrier: string | null
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          variant_name: string | null
          price: number
          quantity: number
          subtotal: number
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          minimum_order: number
          usage_limit: number | null
          used_count: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'used_count'>
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: Database['public']['Tables']['site_settings']['Row']
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          message: string
          reference_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          recipient_name: string
          phone: string
          city: string
          district: string
          address: string
          postal_code: string | null
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>
      }
    }
    Views: {}
    Functions: {
      is_admin: { Args: {}; Returns: boolean }
    }
    Enums: {}
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Inventory = Database['public']['Tables']['inventory']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']

// Extended types with joins
export type ProductWithImages = Product & {
  product_images: ProductImage[]
  categories: Category | null
  inventory: Inventory[]
  product_variants: ProductVariant[]
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
  profiles: Profile | null
}
