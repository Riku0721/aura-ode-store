import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '@/lib/utils/format'
import Link from 'next/link'
import OrderStatusUpdater from './OrderStatusUpdater'

interface Props {
  searchParams: Promise<{ status?: string; search?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, search } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*, order_items(*), profiles(full_name, email)')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') query = query.eq('status', status)
  if (search) query = query.ilike('order_number', `%${search}%`)

  const { data: orders } = await query

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
        <p className="text-gray-500 text-sm mt-1">共 {orders?.length ?? 0} 筆訂單</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (status === s || (!status && s === 'all'))
                ? 'bg-[#0d1b3e] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0d1b3e]'
            }`}
          >
            {s === 'all' ? '全部' : ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['訂單編號', '日期', '顧客', '商品數', '金額', '訂單狀態', '付款狀態', '操作'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => {
                const profile = order.profiles as { full_name?: string; email?: string } | null
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#0d1b3e] hover:text-[#c9a84c]">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.shipping_name}</p>
                      <p className="text-xs text-gray-400">{profile?.email ?? order.guest_email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 text-center">{order.order_items.length}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {PAYMENT_STATUS_LABELS[order.payment_status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="text-center py-12 text-gray-400">
              <p>目前沒有符合條件的訂單</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
