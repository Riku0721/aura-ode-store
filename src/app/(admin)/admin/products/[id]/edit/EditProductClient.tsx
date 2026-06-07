'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, X, Trash2 } from 'lucide-react'
import type { ProductWithImages } from '@/types/database'
import ImageUpload from '@/components/admin/ImageUpload'
import CategorySelect, { type Category } from '@/components/admin/CategorySelect'
import { revalidateProducts } from '@/app/actions/revalidate'

interface Props {
  product: ProductWithImages
  categories: Category[]
}

export default function EditProductClient({ product, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    short_description: product.short_description ?? '',
    price: String(product.price),
    compare_price: product.compare_price ? String(product.compare_price) : '',
    sku: product.sku ?? '',
    category_id: product.category_id ?? '',
    tags: (product.tags as string[] | null)?.join(', ') ?? '',
    is_active: product.is_active,
    is_featured: product.is_featured,
  })
  const [imageUrls, setImageUrls] = useState<string[]>(
    product.product_images.length > 0
      ? product.product_images.sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url)
      : ['']
  )
  const totalStock = product.inventory.reduce((s, i) => s + i.quantity, 0)
  const [stock, setStock] = useState(String(totalStock))

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
      // Update product
      const { error } = await supabase
        .from('products')
        .update({
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
        .eq('id', product.id)

      if (error) throw error

      // Replace images: delete all then re-insert
      await supabase.from('product_images').delete().eq('product_id', product.id)
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

      // Update inventory (update the first record, or insert if none)
      if (product.inventory.length > 0) {
        await supabase
          .from('inventory')
          .update({ quantity: parseInt(stock) })
          .eq('id', product.inventory[0].id)
      } else {
        await supabase.from('inventory').insert({
          product_id: product.id,
          variant_id: null,
          quantity: parseInt(stock),
        })
      }

      await revalidateProducts()
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('儲存失敗，請重試')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`確定要刪除「${product.name}」嗎？此操作無法復原。`)) return
    setDeleting(true)
    const supabase = createClient()
    try {
      await supabase.from('product_images').delete().eq('product_id', product.id)
      await supabase.from('inventory').delete().eq('product_id', product.id)
      await supabase.from('products').delete().eq('id', product.id)
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('刪除失敗，請重試')
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">編輯商品</h1>
            <p className="text-xs text-gray-400 mt-0.5">ID: {product.id}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} />
          {deleting ? '刪除中...' : '刪除商品'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">基本資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商品名稱 <span className="text-red-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">網址別名 (Slug)</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] font-mono"
                  />
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
                    rows={6}
                    placeholder="商品詳細說明"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-y focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">商品圖片</h2>
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
            {/* Pricing */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">定價</h2>
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

            {/* Inventory */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">庫存</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">庫存數量</label>
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

            {/* Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">設定</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">上架中</span>
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
              {loading ? '儲存中...' : '儲存變更'}
            </button>

            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="block text-center text-sm text-gray-500 hover:text-[#0d1b3e] mt-2"
            >
              在前台預覽 →
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
