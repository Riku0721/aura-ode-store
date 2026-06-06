import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import { ArrowRight, Gem, Sparkles, Gift, HeartHandshake } from 'lucide-react'
import type { ProductWithImages } from '@/types/database'

async function getFeaturedProducts(): Promise<ProductWithImages[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(*),
      inventory(*),
      product_variants(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as ProductWithImages[]) ?? []
}

async function getSiteSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['hero_banners', 'homepage_sections', 'store_info'])
  const settings: Record<string, unknown> = {}
  data?.forEach((s) => { settings[s.key] = s.value })
  return settings
}

const features = [
  { icon: Gem, title: '精緻飾品', desc: '點綴每個閃閃亮亮的時刻' },
  { icon: Sparkles, title: '香氛系列', desc: '療癒你的每一天' },
  { icon: Gift, title: '精美包裝', desc: '送禮自用都心動' },
  { icon: HeartHandshake, title: '安心服務', desc: '快速出貨好安心' },
]

export default async function HomePage() {
  const [products, settings] = await Promise.all([getFeaturedProducts(), getSiteSettings()])
  const banners = (settings.hero_banners as Array<{
    id: string; image_url: string; title: string; subtitle: string;
    cta_text: string; cta_link: string; is_active: boolean
  }>) ?? []
  const activeBanner = banners.find((b) => b.is_active) ?? banners[0]
  const storeInfo = settings.store_info as { free_shipping_threshold?: number } ?? {}

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] starry-bg flex items-center overflow-hidden">
        {/* Stars background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.6 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Text */}
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
                Aura & Ode — ACCESSORIES & SCENT
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {activeBanner?.title ?? 'Live in light.\nSing your life.'}
              </h1>
              <p className="text-xl text-[#c9a84c] font-medium mb-4">
                {activeBanner?.subtitle ?? 'Wear your little universe.'}
              </p>
              <ul className="space-y-2 mb-8 text-white/70">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-[#c9a84c]">›</span> 願星辰為你指引方向
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-[#c9a84c]">›</span> 願月亮陪你安放心緒
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-[#c9a84c]">›</span> 願太陽照亮你的生命
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-[#c9a84c]">›</span> 願你始終被愛，也值得被珍惜
                </li>
              </ul>
              <Link
                href={activeBanner?.cta_link ?? '/products'}
                className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0d1b3e] px-8 py-3.5 rounded-full font-bold hover:bg-[#e2c472] transition-all hover:scale-105 shadow-lg shadow-[#c9a84c]/30"
              >
                {activeBanner?.cta_text ?? '開始購買'}
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {activeBanner?.image_url && activeBanner.image_url !== '/images/hero-1.jpg' ? (
                  <Image
                    src={activeBanner.image_url}
                    alt="Aura & Ode"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#1a2f5e] to-[#6b4fa0]/40 border border-[#c9a84c]/20 flex items-center justify-center">
                    <div className="text-center text-white/50">
                      <Gem size={64} className="mx-auto mb-4 text-[#c9a84c]/60" />
                      <p className="text-sm">上傳首頁主圖</p>
                      <p className="text-xs mt-1">於後台 › 網站設定 › 首頁圖片</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      {storeInfo.free_shipping_threshold && (
        <div className="bg-[#c9a84c] text-[#0d1b3e] text-center py-2.5 text-sm font-semibold">
          🎁 單筆消費滿 NT${storeInfo.free_shipping_threshold} 免運費！
        </div>
      )}

      {/* Features */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0d1b3e]/5 flex items-center justify-center">
                  <Icon size={22} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0d1b3e] text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">FEATURED</p>
              <h2 className="text-3xl font-bold text-[#0d1b3e]">精選商品</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border-2 border-[#0d1b3e] text-[#0d1b3e] px-8 py-3 rounded-full font-semibold hover:bg-[#0d1b3e] hover:text-white transition-all"
              >
                瀏覽所有商品
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0d1b3e]">商品分類</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { slug: 'earrings', name: '耳飾', emoji: '✨' },
              { slug: 'bracelets', name: '手鍊', emoji: '💫' },
              { slug: 'rings', name: '戒指', emoji: '💍' },
              { slug: 'necklaces', name: '項鍊', emoji: '🌙' },
              { slug: 'scents', name: '香氛', emoji: '🕯️' },
              { slug: 'healing', name: '療癒小物', emoji: '🔮' },
              { slug: 'bestsellers', name: '最暢銷', emoji: '⭐' },
              { slug: 'all', name: '所有商品', emoji: '🛍️' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-square rounded-2xl bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] flex flex-col items-center justify-center gap-3 hover:from-[#1a2f5e] hover:to-[#6b4fa0]/50 transition-all duration-300 border border-white/10 hover:border-[#c9a84c]/30 shadow-sm hover:shadow-[#c9a84c]/20 hover:shadow-lg"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-white font-semibold text-sm">{cat.name}</span>
                <ArrowRight
                  size={14}
                  className="text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 starry-bg text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">OUR STORY</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">關於 Aura & Ode</h2>
          <p className="text-white/70 leading-relaxed text-lg mb-8">
            每一件飾品，都是一首獻給自己的頌歌。<br />
            我們相信，美好的事物能為日常注入光芒，<br />
            讓每個人都能在細節中感受到被珍惜的溫度。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-[#c9a84c] text-[#c9a84c] px-8 py-3 rounded-full font-semibold hover:bg-[#c9a84c] hover:text-[#0d1b3e] transition-all"
          >
            了解更多
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
