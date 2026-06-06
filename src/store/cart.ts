'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  variant_id?: string
  name: string
  variant_name?: string
  price: number
  quantity: number
  image_url?: string
  slug: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (product_id: string, variant_id?: string) => void
  updateQuantity: (product_id: string, variant_id: string | undefined, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (product_id, variant_id) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === product_id && i.variant_id === variant_id)
          ),
        }))
      },

      updateQuantity: (product_id, variant_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(product_id, variant_id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id && i.variant_id === variant_id
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'aura-ode-cart' }
  )
)
