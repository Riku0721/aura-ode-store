'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CreditCard, Truck } from 'lucide-react'

interface ShippingForm {
  name: string; phone: string; email: string
  city: string; district: string; address: string; postal_code: string
  notes: string; is_guest: boolean
}

const twCities = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉義市']

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const [form, setForm] = useState<ShippingForm>({
    name: '', phone: '', email: '',
    city: '台北市', district: '', address: '', postal_code: '',
    notes: '', is_guest: true,
  })

  const sub = subtotal()
  const shippingFee = sub >= 1500 ? 0 : 60
  const total = sub + shippingFee - discount

  const applyCoupon = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (!data) { setCouponMsg('優惠碼無效或已過期'); return }
    if (data.minimum_order > sub) {
      setCouponMsg(`此優惠碼需最低消費 ${formatPrice(data.minimum_order)}`); return
    }
    const amt = data.discount_type === 'percentage'
      ? Math.round(sub * data.discount_value / 100)
      : data.discount_value
    setDiscount(amt)
    setCouponMsg(`已套用！折抵 ${formatPrice(amt)}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form, items, subtotal: sub, shippingFee, discount, total, couponCode,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      clearCart()
      router.push(`/checkout/success?order=${result.order_number}`)
    } catch (err) {
      console.error(err)
      alert('訂單建立失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">購物車是空的</p>
        <Link href="/products" className="text-[#c9a84c] hover:underline">去逛逛</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0d1b3e] mb-6 transition-colors">
        <ChevronLeft size={16} /> 返回購物車
      </Link>
      <h1 className="text-2xl font-bold text-[#0d1b3e] mb-8">填寫訂單資訊</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0d1b3e] mb-4 flex items-center gap-2">
                <Truck size={18} className="text-[#c9a84c]" /> 收件資訊
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: '收件人姓名', placeholder: '王小明', required: true },
                  { name: 'phone', label: '手機號碼', placeholder: '0912345678', required: true },
                  { name: 'email', label: '電子信箱', placeholder: 'email@example.com', required: true, type: 'email' },
                  { name: 'postal_code', label: '郵遞區號', placeholder: '100', required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type ?? 'text'}
                      value={form[field.name as keyof ShippingForm] as string}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">縣市 <span className="text-red-500">*</span></label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                    required
                  >
                    {twCities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">鄉鎮市區 <span className="text-red-500">*</span></label>
                  <input
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="大安區"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">詳細地址 <span className="text-red-500">*</span></label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="路 / 街 / 巷 / 弄 / 號"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="特殊包裝需求、到貨時間等..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </div>
            </div>

            {/* Payment - placeholder for future payment gateway */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0d1b3e] mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#c9a84c]" /> 付款方式
              </h2>
              <div className="border-2 border-[#c9a84c] rounded-xl p-4 bg-[#c9a84c]/5">
                <p className="font-medium text-[#0d1b3e] text-sm">銀行轉帳 / 匯款</p>
                <p className="text-xs text-gray-500 mt-1">下單後將寄送匯款資訊至您的信箱，匯款完成後我們會盡快確認並出貨。</p>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                💡 線上刷卡付款功能即將上線（Stripe / 綠界金流）
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h2 className="font-bold text-[#0d1b3e] text-base mb-4">訂單確認</h2>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 flex-1 line-clamp-1">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium ml-2 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t pt-3 mb-3">
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="優惠碼"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-3 py-2 bg-[#0d1b3e] text-white rounded-lg text-sm hover:bg-[#1a2f5e] transition-colors"
                  >
                    套用
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs mt-1 ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">運費</span>
                  <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                    {shippingFee === 0 ? '免費' : formatPrice(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>優惠折抵</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span className="text-[#0d1b3e]">總計</span>
                  <span className="text-[#c9a84c]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full bg-[#c9a84c] text-[#0d1b3e] py-3.5 rounded-full font-bold text-base hover:bg-[#e2c472] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '處理中...' : '確認下單'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
