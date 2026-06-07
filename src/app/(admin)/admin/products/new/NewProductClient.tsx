'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'
import CategorySelect, { type Category } from '@/components/admin/CategorySelect'
import { revalidateProducts } from '@/app/actions/revalidate'

interface Props {
  categories: Category[]
}

export default function NewProductClient({ categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', short_description: '',
    price: '', compare_price: '', sku: '', category_id: '',
    tags: '', is_active: true, is_featured: false,
  })
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [stock, setStock] = useState('0')

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: name.toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w一-龥-]/g, '')
        .replace(/--+/g, '-'),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          short_description: form.short_description || null,
          price: parseFloat(form.price),
          compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
          sku: form.sku || null,
          category_id: form.category_id || null,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
          is_active: form.is_active,
          is_featured: form.is_featured,
        })
        .select('id')
        .single()

      if (error || !product) throw error

      const validImages = imageUrls.filter(Boolean)
      if (validImages.length > 0) {
        await supabase.from('product_images').insert(
          validImages.map((url, i) => ({
            product_id: product.id,
            url,
            sort_order: i,
            is_primary: i === 0,
          }))
        )
      }

      await supabase.from('inventory').insert({
        product_id: product.id,
        variant_id: null,
        quantity: parseInt(stock),
      })

      await revalidateProducts()
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('新增失敗，請確認欄位並重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">新增商品</h1>
      </div>
      <p className="text-sm text-gray-400 mb-6 ml-8">依序填寫下方欄位，標示 <span className="text-red-500">*</span> 為必填，完成後按下「新增商品」即可上架</p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0d1b3e] text-white text-xs font-bold">1</span>
                <h2 className="font-bold text-gray-900">基本資訊</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4 ml-7">商品的名稱、分類與描述，將顯示在商店與商品頁面上</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商品名稱 <span className="text-red-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="例：星月耳環（金色）"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">網址別名 (Slug)</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="star-moon-earring-gold"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">會根據商品名稱自動產生，用於商店網址，可自行修改</p>
                </div>
                <CategorySelect
                  categories={categories}
                  value={form.category_id}
                  onChange={(category_id) => setForm({ ...form, category_id })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">簡短描述</label>
                  <input
                    value={form.short_description}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    placeholder="商品卡片上的簡短說明"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">詳細描述</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={5}
                    placeholder="商品詳細說明"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-y focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0d1b3e] text-white text-xs font-bold">2</span>
                <h2 className="font-bold text-gray-900">商品圖片</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4 ml-7">第一張圖片將作為主圖，顯示在商品列表與卡片上</p>
              <div className="space-y-4">
                {imageUrls.map((url, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        圖片 {i + 1}{i === 0 ? '（主圖）' : ''}
                      </span>
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <ImageUpload
                      value={url}
                      onChange={(newUrl) => {
                        const next = [...imageUrls]
                        next[i] = newUrl
                        setImageUrls(next)
                      }}
                      folder="products"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setImageUrls([...imageUrls, ''])}
                  className="flex items-center gap-1 text-sm text-[#c9a84c] hover:underline"
                >
                  <Plus size={14} /> 新增圖片
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0d1b3e] text-white text-xs font-bold">3</span>
                <h2 className="font-bold text-gray-900">定價</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4 ml-7">設定顧客看到的售價，原價會以劃線顯示來呈現折扣</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">售價 (TWD) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required min="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">原價（劃掉價）</label>
                  <input
                    type="number"
                    value={form.compare_price}
                    onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                    min="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0d1b3e] text-white text-xs font-bold">4</span>
                <h2 className="font-bold text-gray-900">庫存</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4 ml-7">用來追蹤可販售的數量，售完將無法下單</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">初始庫存數量</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="AO-001"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0d1b3e] text-white text-xs font-bold">5</span>
                <h2 className="font-bold text-gray-900">設定</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4 ml-7">控制商品是否在商店上架顯示，以及搜尋用的標籤</p>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">立即上架</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">設為精選（首頁顯示）</span>
                </label>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">標籤（逗號分隔）</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="耳環, 星月, 金色"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d1b3e] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a2f5e] transition-all disabled:opacity-50"
            >
              {loading ? '儲存中...' : '新增商品'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
