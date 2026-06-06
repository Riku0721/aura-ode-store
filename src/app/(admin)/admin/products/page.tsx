import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye, EyeOff } from 'lucide-react'
import type { ProductWithImages } from '@/types/database'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select(`*, product_images(*), categories(*), inventory(*), product_variants(*)`)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {products?.length ?? 0} 件商品</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#0d1b3e] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1a2f5e] transition-colors"
        >
          <Plus size={16} />
          新增商品
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['商品', '分類', '售價', '庫存', '特色', '狀態', '操作'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products as ProductWithImages[])?.map((product) => {
                const primaryImg = product.product_images.find((i) => i.is_primary) ?? product.product_images[0]
                const totalStock = product.inventory.reduce((s, i) => s + i.quantity, 0)
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {primaryImg ? (
                            <Image
                              src={primaryImg.url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1a2f5e]/20 to-[#c9a84c]/20" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku ?? product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.categories?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                      {product.compare_price && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        totalStock === 0 ? 'text-red-600' : totalStock <= 5 ? 'text-orange-500' : 'text-green-600'
                      }`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.is_featured ? (
                        <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded-full font-medium">精選</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.is_active ? '上架中' : '已下架'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#0d1b3e] transition-colors"
                          title="編輯"
                        >
                          <Edit size={14} />
                        </Link>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                          title="前台預覽"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-3">尚無商品</p>
              <Link href="/admin/products/new" className="text-[#c9a84c] hover:underline text-sm">
                立即新增第一個商品
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
