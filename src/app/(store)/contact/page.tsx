'use client'
import { useState } from 'react'
import { Mail, Clock, CheckCircle } from 'lucide-react'

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

const faqs = [
  {
    q: '訂單多久可以出貨？',
    a: '確認付款後 1-3 個工作天內出貨，節假日可能稍有延遲，我們會盡快處理。',
  },
  {
    q: '可以退換貨嗎？',
    a: '收到商品 7 天內（未拆封/未使用）可申請退換貨，請聯絡我們並附上訂單資訊。',
  },
  {
    q: '飾品會過敏嗎？',
    a: '我們的飾品主要使用不鏽鋼、925 純銀等低過敏材質，但若有金屬過敏體質建議先諮詢。',
  },
  {
    q: '可以客製化嗎？',
    a: '目前部分商品提供刻字服務，歡迎透過 Instagram 或 Email 聯絡我們詢問細節。',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#0d1b3e] text-white py-14 text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">
          CONTACT US
        </p>
        <h1 className="text-4xl font-bold mb-3">聯絡我們</h1>
        <p className="text-white/60 text-base">有任何問題都歡迎與我們聯絡，我們會盡快回覆！</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0d1b3e]">聯絡資訊</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#0d1b3e]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0d1b3e] text-sm">電子信箱</p>
                  <p className="text-gray-500 text-sm mt-0.5">hello@auraode.com</p>
                  <p className="text-gray-400 text-xs mt-1">1-2 個工作天內回覆</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#0d1b3e]/5 rounded-xl flex items-center justify-center flex-shrink-0 text-[#c9a84c]">
                  <InstagramIcon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-[#0d1b3e] text-sm">Instagram</p>
                  <p className="text-gray-500 text-sm mt-0.5">@aura.and.ode</p>
                  <p className="text-gray-400 text-xs mt-1">歡迎 DM 詢問</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#0d1b3e]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0d1b3e] text-sm">客服時間</p>
                  <p className="text-gray-500 text-sm mt-0.5">週一 至 週五</p>
                  <p className="text-gray-500 text-sm">10:00 – 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#0d1b3e] mb-6">傳送訊息</h2>

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                <h3 className="font-bold text-green-800 text-lg">訊息已送出！</h3>
                <p className="text-green-600 text-sm mt-2">
                  感謝你的來信，我們會在 1-2 個工作天內回覆你。
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-4 text-sm text-green-700 hover:underline"
                >
                  再傳一則訊息
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="王小明"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電子信箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    主旨 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                  >
                    <option value="">請選擇主旨</option>
                    <option value="order">訂單相關</option>
                    <option value="return">退換貨</option>
                    <option value="product">商品詢問</option>
                    <option value="custom">客製化需求</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    訊息內容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="請描述你的問題或需求..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d1b3e] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a2f5e] transition-all disabled:opacity-50"
                >
                  {loading ? '傳送中...' : '傳送訊息'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-8 text-center">常見問題</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#0d1b3e] text-sm mb-2">Q：{q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">A：{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
