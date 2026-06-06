import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/format'
import Link from 'next/link'
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()

  const [
    { count: totalOrders },
    { data: recentOrders },
    { count: totalCustomers },
    { data: monthOrders },
    { data: lowStock },
    { data: notifications },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('total').gte('created_at', startOfMonth).eq('payment_status', 'paid'),
    supabase.from('inventory').select('*, products(name)').lte('quantity', 5),
    supabase.from('notifications').select('*').eq('is_read', false).order('created_at', { ascending: false }).limit(5),
  ])

  const monthRevenue = monthOrders?.reduce((sum, o) => sum + o.total, 0) ?? 0

  const stats = [
    { label: '本月營業額', value: formatPrice(monthRevenue), icon: TrendingUp, color: 'bg-green-500', change: '+12%' },
    { label: '總訂單數', value: totalOrders ?? 0, icon: ShoppingCart, color: 'bg-blue-500', change: '' },
    { label: '總顧客數', value: totalCustomers ?? 0, icon: Users, color: 'bg-purple-500', change: '' },
    { label: '低庫存警告', value: lowStock?.length ?? 0, icon: AlertTriangle, color: 'bg-red-500', change: '' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">總覽</h1>
        <p className="text-gray-500 text-sm mt-1">{formatDate(new Date().toISOString())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              {change && <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">{change}</span>}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">最新訂單</h2>
            <Link href="/admin/orders" className="text-sm text-[#c9a84c] hover:underline flex items-center gap-1">
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <p className="font-bold text-sm text-gray-900 mt-1">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">尚無訂單</p>
          )}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-500" />
                低庫存警告
              </h2>
              <Link href="/admin/inventory" className="text-sm text-[#c9a84c] hover:underline">
                管理庫存
              </Link>
            </div>
            {lowStock && lowStock.length > 0 ? (
              <div className="space-y-2">
                {lowStock.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-orange-50 rounded-lg">
                    <span className="text-gray-700 truncate flex-1">
                      {(item as unknown as { products?: { name: string } }).products?.name ?? '未知商品'}
                    </span>
                    <span className={`font-bold ml-2 ${item.quantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                      剩 {item.quantity} 件
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 text-sm flex items-center gap-1">
                ✓ 所有商品庫存充足
              </p>
            )}
          </div>

          {/* Notifications */}
          {notifications && notifications.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">未讀通知</h2>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
