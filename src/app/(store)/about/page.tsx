import Link from 'next/link'
import { ArrowRight, Gem, Heart, Star, Sparkles } from 'lucide-react'

const values = [
  {
    icon: Gem,
    title: '精緻工藝',
    desc: '每一件飾品都經過嚴格篩選，細節決定品質，我們只選最好的給你。',
  },
  {
    icon: Heart,
    title: '帶著愛製作',
    desc: '相信每件飾品都有自己的能量，希望它能陪伴你走過每個重要時刻。',
  },
  {
    icon: Star,
    title: '獨特設計',
    desc: '融合星象、自然與療癒元素，打造屬於你的專屬宇宙。',
  },
  {
    icon: Sparkles,
    title: '療癒生活',
    desc: '不只是飾品，更是一種生活態度——讓美好的事物為日常注入光芒。',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] starry-bg flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
            OUR STORY
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            關於 Aura & Ode
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            每一件飾品，都是一首獻給自己的頌歌。<br />
            我們相信，美好的事物能為日常注入光芒。
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">
                BRAND STORY
              </p>
              <h2 className="text-3xl font-bold text-[#0d1b3e] mb-6">品牌故事</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Aura & Ode 誕生於一個簡單的信念——每個人都值得被珍惜，
                  都值得擁有能讓自己閃閃發光的飾品。
                </p>
                <p>
                  「Aura」代表每個人獨特的光芒與氣場；「Ode」則是一首頌歌，
                  獻給那些勇敢做自己、活出光彩的你。
                </p>
                <p>
                  我們精心挑選每一件商品，從星月主題的精緻飾品到撫慰身心的香氛療癒小物，
                  希望每一樣都能成為你日常生活中的小確幸。
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] flex items-center justify-center border border-[#c9a84c]/20">
                <div className="text-center">
                  <Gem size={80} className="mx-auto mb-4 text-[#c9a84c]/80" />
                  <p className="text-white/60 text-sm">Aura & Ode</p>
                  <p className="text-[#c9a84c] text-xs mt-1">ACCESSORIES & SCENT</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-[#c9a84c]/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-[#6b4fa0]/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">
              OUR VALUES
            </p>
            <h2 className="text-3xl font-bold text-[#0d1b3e]">我們的理念</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#c9a84c]/30 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-[#0d1b3e]/5 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-bold text-[#0d1b3e] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-20 starry-bg text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
            OUR PROMISE
          </p>
          <h2 className="text-3xl font-bold mb-6">我們的承諾</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { label: '精選商品', value: '嚴格品管' },
              { label: '快速出貨', value: '1-3 個工作天' },
              { label: '安心購物', value: '7 天鑑賞期' },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/20 rounded-2xl p-5">
                <p className="text-[#c9a84c] font-bold text-lg">{value}</p>
                <p className="text-white/60 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0d1b3e] px-8 py-3.5 rounded-full font-bold hover:bg-[#e2c472] transition-all hover:scale-105"
          >
            開始選購
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
