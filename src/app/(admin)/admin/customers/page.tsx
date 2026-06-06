import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice } from '@/lib/utils/format'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('profiles')
    .select(`
      *,
      orders(total, created_at)
    `)
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">顧客管理</h1>
        <p className="text-gray-500 text-sm mt-1">共 {customers?.length ?? 0} 位會員</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['會員', '信箱', '手機', '訂單數', '消費總額', '加入日期'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers?.map((customer) => {
                const orders = customer.orders as { total: number; created_at: string }[]
                const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
                return (
                  <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0d1b3e] flex items-center justify-center text-white text-xs font-bold">
                          {(customer.full_name ?? customer.email ?? 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{customer.full_name ?? '未設定'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-center font-semibold">{orders.length}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(totalSpent)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(customer.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!customers || customers.length === 0) && (
            <div className="text-center py-12 text-gray-400">
              <p>目前尚無會員</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
