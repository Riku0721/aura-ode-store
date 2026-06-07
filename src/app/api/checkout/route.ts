import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

interface CheckoutBody {
  form: {
    name: string; phone: string; email: string
    city: string; district: string; address: string; postal_code: string
    notes: string; is_guest: boolean
  }
  items: {
    product_id: string; variant_id?: string
    name: string; variant_name?: string
    price: number; quantity: number
  }[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  couponCode: string
}

// Order creation runs server-side with the admin client because anonymous
// (guest) sessions can INSERT into `orders` per RLS, but the matching SELECT
// policy (`auth.uid() = user_id`) never matches a guest row (NULL = NULL is
// not true), so the client-side insert().select().single() always failed.
export async function POST(request: Request) {
  const { form, items, subtotal, shippingFee, discount, total, couponCode } =
    (await request.json()) as CheckoutBody

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: '購物車是空的' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const admin = await createAdminClient()

  const { data: order, error } = await admin
    .from('orders')
    .insert({
      user_id: user?.id ?? null,
      guest_email: form.is_guest ? form.email : null,
      guest_name: form.is_guest ? form.name : null,
      guest_phone: form.is_guest ? form.phone : null,
      shipping_name: form.name,
      shipping_phone: form.phone,
      shipping_city: form.city,
      shipping_district: form.district,
      shipping_address: form.address,
      shipping_postal_code: form.postal_code || null,
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discount,
      total,
      coupon_code: couponCode || null,
      notes: form.notes || null,
      payment_method: 'pending',
    })
    .select('id, order_number')
    .single()

  if (error || !order) {
    console.error('order insert failed', error)
    return NextResponse.json({ error: '訂單建立失敗' }, { status: 500 })
  }

  const { error: itemsError } = await admin.from('order_items').insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id ?? null,
      product_name: item.name,
      variant_name: item.variant_name ?? null,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))
  )

  if (itemsError) {
    console.error('order_items insert failed', itemsError)
    return NextResponse.json({ error: '訂單建立失敗' }, { status: 500 })
  }

  return NextResponse.json({ order_number: order.order_number })
}
