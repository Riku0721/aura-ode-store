import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  // Last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: recentOrders },
    { data: topProducts },
    { data: allOrders },
  ] = await Promise.all([
    supabase.from('orders').select('total, created_at, status').gte('created_at', thirtyDaysAgo).eq('payment_status', 'paid'),
    supabase.from('order_items').select('product_name, quantity, subtotal').order('quantity', { ascending: false }).limit(10),
    supabase.from('orders').select('total, status, payment_status').eq('payment_status', 'paid'),
  ])

  const totalRevenue = allOrders?.reduce((s, o) => s + o.total, 0) ?? 0
  const last30Revenue = recentOrders?.reduce((s, o) => s + o.total, 0) ?? 0
  const totalPaidOrders = allOrders?.length ?? 0
  const avgOrderValue = totalPaidOrders > 0 ? totalRevenue / totalPaidOrders : 0

  // Group by product name for top products
  const productMap = new Map<string, { qty: number; revenue: number }>()
  topProducts?.forEach((item) => {
    const existing = productMap.get(item.product_name) ?? { qty: 0, revenue: 0 }
    productMap.set(item.product_name, {
      qty: existing.qty + item.quantity,
      revenue: existing.revenue + item.subtotal,
    })
  })
  const sortedProducts = Array.from(productMap.entries())
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 10)

  // Daily revenue for last 7 days
  const dailyRevenue: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    dailyRevenue[d.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })] = 0
  }
  recentOrders?.forEach((order) => {
    const d = new Date(order.created_at).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })
    if (d in dailyRevenue) dailyRevenue[d] += order.total
  })

  const stats = [
    { label: '累計總營業額', value: formatPrice(totalRevenue), sub: '已付款訂單' },
    { label: '近 30 天營業額', value: formatPrice(last30Revenue), sub: '' },
    { label: '已付款訂單數', value: totalPaidOrders, sub: '筆' },
    { label: '平均客單價', value: formatPrice(avgOrderValue), sub: '' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">數據報表</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart (simple bars) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">近 7 天營業額</h2>
          <div className="space-y-2">
            {Object.entries(dailyRevenue).map(([date, amount]) => {
              const maxVal = Math.max(...Object.values(dailyRevenue), 1)
              const pct = (amount / maxVal) * 100
              return (
                <div key={date} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-12 text-xs">{date}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0d1b3e] to-[#c9a84c] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-20 text-right">
                    {amount > 0 ? formatPrice(amount) : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">熱銷商品排行</h2>
          {sortedProducts.length > 0 ? (
            <div className="space-y-3">
              {sortedProducts.map(([name, { qty, revenue }], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-[#c9a84c] text-[#0d1b3e]' :
                    i === 1 ? 'bg-gray-200 text-gray-700' :
                    i === 2 ? 'bg-orange-200 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{name}</p>
                    <p className="text-xs text-gray-400">賣出 {qty} 件</p>
                  </div>
                  <span className="font-bold text-sm text-gray-900 flex-shrink-0">
                    {formatPrice(revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">尚無銷售資料</p>
          )}
        </div>
      </div>
    </div>
  )
}
