import { createClient } from '@/lib/supabase/server'
import InventoryEditor from './InventoryEditor'

export default async function AdminInventoryPage() {
  const supabase = await createClient()
  const { data: inventory } = await supabase
    .from('inventory')
    .select(`
      *,
      products(name, sku),
      product_variants(name)
    `)
    .order('quantity', { ascending: true })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">庫存管理</h1>
        <p className="text-gray-500 text-sm mt-1">直接編輯庫存數量，系統會自動在低庫存時發出警告</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['商品', 'SKU', '款式', '庫存數量', '低庫存門檻', '狀態', '操作'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory?.map((item) => {
                const product = item.products as { name?: string; sku?: string } | null
                const variant = item.product_variants as { name?: string } | null
                return (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {product?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {product?.sku ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {variant?.name ?? '預設'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-base ${
                        item.quantity === 0 ? 'text-red-600' : item.quantity <= item.low_stock_threshold ? 'text-orange-500' : 'text-green-600'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.low_stock_threshold}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.quantity === 0
                          ? 'bg-red-100 text-red-700'
                          : item.quantity <= item.low_stock_threshold
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.quantity === 0 ? '售完' : item.quantity <= item.low_stock_threshold ? '庫存不足' : '正常'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <InventoryEditor inventoryId={item.id} currentQty={item.quantity} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
