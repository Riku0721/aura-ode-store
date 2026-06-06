import Link from 'next/link'
import { CheckCircle, Package } from 'lucide-react'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-2xl font-bold text-[#0d1b3e] mb-2">訂單已成立！</h1>
      {order && (
        <p className="text-gray-500 mb-1">訂單編號：<strong className="text-[#0d1b3e]">{order}</strong></p>
      )}
      <p className="text-gray-500 mb-8 max-w-md">
        感謝您的訂購！我們會盡快處理您的訂單並寄送確認信件。
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 bg-[#0d1b3e] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1a2f5e] transition-colors"
        >
          <Package size={16} />
          查看訂單
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 border-2 border-[#0d1b3e] text-[#0d1b3e] px-6 py-3 rounded-full font-semibold hover:bg-[#0d1b3e] hover:text-white transition-all"
        >
          繼續購物
        </Link>
      </div>
    </div>
  )
}
