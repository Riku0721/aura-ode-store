import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/format'
import { Package, ChevronLeft } from 'lucide-react'

const statusLabel: Record<string, { text: string; color: string }> = {
  pending:    { text: '待處理', color: 'bg-yellow-100 text-yellow-700' },
  processing: { text: '處理中', color: 'bg-blue-100 text-blue-700' },
  shipped:    { text: '已出貨', color: 'bg-purple-100 text-purple-700' },
  delivered:  { text: '已送達', color: 'bg-green-100 text-green-700' },
  cancelled:  { text: '已取消', color: 'bg-gray-100 text-gray-500' },
  refunded:   { text: '已退款', color: 'bg-red-100 text-red-600' },
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/account/orders')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-[#0d1b3e]">我的訂單</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-500 mb-4">還沒有訂單紀錄</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[#0d1b3e] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1a2f5e] transition-colors">
            去購物
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusLabel[order.status] ?? { text: order.status, color: 'bg-gray-100 text-gray-500' }
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-[#0d1b3e]">{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.text}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-0.5 mb-3">
                  {order.order_items?.map((item: { id: string; product_name: string; quantity: number; price: number }) => (
                    <p key={item.id}>{item.product_name} × {item.quantity}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <p className="text-sm text-gray-500">共 {order.order_items?.length ?? 0} 項商品</p>
                  <p className="font-bold text-[#0d1b3e]">{formatPrice(order.total)}</p>
                </div>
                {order.tracking_number && (
                  <p className="text-xs text-gray-400 mt-2">追蹤號碼：{order.carrier} {order.tracking_number}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
