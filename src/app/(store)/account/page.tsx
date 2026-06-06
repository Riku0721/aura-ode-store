import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, LogOut } from 'lucide-react'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/format'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/account')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#0d1b3e] mb-8">會員中心</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0d1b3e] rounded-full flex items-center justify-center text-white font-bold">
                {(profile?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0d1b3e] text-sm">{profile?.full_name ?? '會員'}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { href: '/account', icon: User, label: '個人資料' },
                { href: '/account/orders', icon: Package, label: '我的訂單' },
                { href: '/account/addresses', icon: MapPin, label: '收件地址' },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={16} className="text-[#c9a84c]" />
                  {label}
                </Link>
              ))}
            </nav>
            <form action="/api/auth/signout" method="POST" className="mt-4 pt-4 border-t">
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
              >
                <LogOut size={16} />
                登出
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-[#0d1b3e] mb-4">個人資料</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-gray-500 mb-1">姓名</label>
                <p className="font-medium text-[#0d1b3e]">{profile?.full_name ?? '未設定'}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">電子信箱</label>
                <p className="font-medium text-[#0d1b3e]">{user.email}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">手機號碼</label>
                <p className="font-medium text-[#0d1b3e]">{profile?.phone ?? '未設定'}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">會員等級</label>
                <span className="inline-block bg-[#c9a84c]/20 text-[#c9a84c] text-xs px-2 py-0.5 rounded-full font-semibold">
                  一般會員
                </span>
              </div>
            </div>
            <Link
              href="/account/edit"
              className="mt-4 inline-block text-sm text-[#c9a84c] hover:underline"
            >
              編輯資料
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0d1b3e]">近期訂單</h2>
              <Link href="/account/orders" className="text-sm text-[#c9a84c] hover:underline">
                查看全部
              </Link>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#0d1b3e] text-sm">{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          共 {order.order_items.length} 件
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                        <p className="font-bold text-[#0d1b3e] text-sm mt-1">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">還沒有訂單紀錄</p>
                <Link href="/products" className="text-[#c9a84c] text-sm hover:underline mt-2 block">
                  去購物
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
