import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { ProductWithImages } from '@/types/database'
import { Search } from 'lucide-react'

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>
}

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

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const { category = 'all', search = '', sort = 'newest' } = params

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(*),
      inventory(*),
      product_variants(*)
    `)
    .eq('is_active', true)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  } else if (category && category !== 'all') {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: products } = await query
  const items = (products as ProductWithImages[]) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-[#0d1b3e] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">精緻選品</h1>
          <p className="text-white/60 mt-1">共 {items.length} 件商品</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-[#0d1b3e] mb-4">分類</h2>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <a
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        (category === cat.slug || (cat.slug === 'all' && !category))
                          ? 'bg-[#0d1b3e] text-[#c9a84c] font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Search + Sort toolbar */}
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
              <select
                defaultValue={sort}
                onChange={(e) => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('sort', e.target.value)
                  window.location.href = url.toString()
                }}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#c9a84c]"
              >
                <option value="newest">最新上架</option>
                <option value="price_asc">價格：低到高</option>
                <option value="price_desc">價格：高到低</option>
              </select>
            </div>

            {/* Product grid */}
            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-medium mb-2">找不到商品</p>
                <p className="text-sm">請試試其他搜尋條件</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
