import { unstable_cache } from 'next/cache'
import { createClient, createPublicClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import ProductSortSelect from './ProductSortSelect'
import type { ProductWithImages } from '@/types/database'
import { Search } from 'lucide-react'

export const revalidate = 60

const categories = [
  { slug: 'all', name: '所有商品' },
  { slug: 'bestsellers', name: '最暢銷' },
  { slug: 'earrings', name: '耳飾' },
  { slug: 'bracelets', name: '手鍊' },
  { slug: 'rings', name: '戒指' },
  { slug: 'necklaces', name: '項鍊' },
  { slug: 'scents', name: '香氛' },
  { slug: 'healing', name: '療癒小物' },
]

const getCategoryId = unstable_cache(
  async (slug: string) => {
    const supabase = createPublicClient()
    const { data } = await supabase.from('categories').select('id').eq('slug', slug).single()
    return data?.id ?? null
  },
  ['category-id'],
  { revalidate: 3600, tags: ['categories'] }
)

// 這個元件單獨做資料查詢，讓外層 Suspense 只 block 它
async function ProductGrid({
  category, search, sort,
}: {
  category: string; search: string; sort: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, product_images(*), categories(*), inventory(*), product_variants(*)')
    .eq('is_active', true)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  } else if (category && category !== 'all') {
    const catId = await getCategoryId(category)
    if (catId) query = query.eq('category_id', catId)
  }

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  const items = (data as ProductWithImages[]) ?? []

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium mb-2">找不到商品</p>
        <p className="text-sm">請試試其他搜尋條件</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="aspect-square bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const { category = 'all', search = '', sort = 'newest' } = params

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面 header — 立刻顯示，不等資料 */}
      <div className="bg-[#0d1b3e] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">精緻選品</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 分類側欄 — 立刻顯示 */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-[#0d1b3e] mb-4">分類</h2>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.slug || (cat.slug === 'all' && !category)
                          ? 'bg-[#0d1b3e] text-[#c9a84c] font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* 主內容區 */}
          <div className="flex-1">
            {/* 搜尋 + 排序 — 立刻顯示 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <form className="flex-1 relative" action="/products" method="GET">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="搜尋商品..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </form>
              <Suspense fallback={<div className="w-36 h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                <ProductSortSelect current={sort} />
              </Suspense>
            </div>

            {/* 商品格子 — 單獨串流，只有這裡在等 */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category={category} search={search} sort={sort} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
