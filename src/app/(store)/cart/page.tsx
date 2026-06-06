'use client'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const total = subtotal()
  const shippingFee = total >= 1500 ? 0 : 60
  const grandTotal = total + shippingFee

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-600 mb-2">購物車是空的</h1>
        <p className="text-gray-400 mb-8">快去挑選你喜歡的商品吧！</p>
        <Link
          href="/products"
          className="bg-[#0d1b3e] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a2f5e] transition-colors inline-flex items-center gap-2"
        >
          去逛逛
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#0d1b3e] mb-8">購物車（{items.length} 件）</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.variant_id}`}
              className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a2f5e]/20 to-[#c9a84c]/20" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0d1b3e] text-sm line-clamp-2">{item.name}</h3>
                {item.variant_name && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.variant_name}</p>
                )}
                <p className="text-[#c9a84c] font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id, item.variant_id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="移除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[#0d1b3e] text-sm">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
            <h2 className="font-bold text-[#0d1b3e] text-lg mb-4">訂單摘要</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">小計</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">運費</span>
                <span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                  {shippingFee === 0 ? '免費' : formatPrice(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gray-400">
                  再買 {formatPrice(1500 - total)} 即享免運
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span className="text-[#0d1b3e]">總計</span>
                <span className="text-[#c9a84c] text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 w-full bg-[#0d1b3e] text-white py-3.5 rounded-full font-bold text-center flex items-center justify-center gap-2 hover:bg-[#1a2f5e] transition-all hover:shadow-lg hover:shadow-[#0d1b3e]/30"
            >
              前往結帳
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="mt-3 w-full text-center text-sm text-gray-500 hover:text-[#0d1b3e] transition-colors block"
            >
              繼續購物
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
