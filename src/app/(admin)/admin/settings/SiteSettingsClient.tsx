'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Check, Plus, X } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { revalidateSettings } from '@/app/actions/revalidate'

interface Banner {
  id: string; image_url: string; title: string; subtitle: string;
  cta_text: string; cta_link: string; is_active: boolean
}
interface StoreInfo {
  store_name: string; tagline: string; email: string; phone: string;
  instagram: string; facebook: string; line_id: string;
  free_shipping_threshold: number; shipping_fee: number
}
interface SeoSettings {
  meta_title: string; meta_description: string; og_image: string
}

export default function SiteSettingsClient({ initialSettings }: { initialSettings: Record<string, unknown> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'hero' | 'store' | 'seo'>('hero')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [banners, setBanners] = useState<Banner[]>(
    (initialSettings.hero_banners as Banner[]) ?? []
  )
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(
    (initialSettings.store_info as StoreInfo) ?? {
      store_name: 'Aura & Ode', tagline: 'ACCESSORIES & SCENT',
      email: '', phone: '', instagram: '', facebook: '', line_id: '',
      free_shipping_threshold: 1500, shipping_fee: 60,
    }
  )
  const [seo, setSeo] = useState<SeoSettings>(
    (initialSettings.seo as SeoSettings) ?? {
      meta_title: 'Aura & Ode | 飾品 × 香氛 × 療癒小物',
      meta_description: '點綴生活儀式感，讓美好與你日常相伴',
      og_image: '',
    }
  )

  const saveSettings = async () => {
    setSaving(true)
    const supabase = createClient()
    const updates = [
      { key: 'hero_banners', value: banners },
      { key: 'store_info', value: storeInfo },
      { key: 'seo', value: seo },
    ]
    for (const { key, value } of updates) {
      await supabase.from('site_settings').upsert({ key, value })
    }
    await revalidateSettings()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  const addBanner = () => setBanners([...banners, {
    id: Date.now().toString(), image_url: '', title: '', subtitle: '',
    cta_text: '開始購買', cta_link: '/products', is_active: false,
  }])

  const updateBanner = (id: string, field: keyof Banner, value: string | boolean) => {
    setBanners(banners.map((b) => b.id === id ? { ...b, [field]: value } : b))
  }

  const tabs = [
    { id: 'hero', label: '首頁 Banner' },
    { id: 'store', label: '商店資訊' },
    { id: 'seo', label: 'SEO 設定' },
  ] as const

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-white shadow-sm text-[#0d1b3e]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        {/* Hero Banners */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">首頁 Banner 管理</h2>
              <button
                onClick={addBanner}
                className="flex items-center gap-1 text-sm text-[#c9a84c] hover:underline"
              >
                <Plus size={14} /> 新增 Banner
              </button>
            </div>
            {banners.map((banner, i) => (
              <div key={banner.id} className="border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-gray-700">Banner #{i + 1}</h3>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={banner.is_active}
                        onChange={(e) => updateBanner(banner.id, 'is_active', e.target.checked)}
                        className="rounded"
                      />
                      啟用
                    </label>
                    <button
                      onClick={() => setBanners(banners.filter((b) => b.id !== banner.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Banner 圖片</label>
                    <ImageUpload
                      value={banner.image_url}
                      onChange={(url) => updateBanner(banner.id, 'image_url', url)}
                      placeholder="圖片 URL 或點擊上傳"
                      folder="banners"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">標題</label>
                    <input
                      value={banner.title}
                      onChange={(e) => updateBanner(banner.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">副標題</label>
                    <input
                      value={banner.subtitle}
                      onChange={(e) => updateBanner(banner.id, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">按鈕文字</label>
                    <input
                      value={banner.cta_text}
                      onChange={(e) => updateBanner(banner.id, 'cta_text', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">按鈕連結</label>
                    <input
                      value={banner.cta_link}
                      onChange={(e) => updateBanner(banner.id, 'cta_link', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                尚未設定 Banner，點擊「新增 Banner」開始
              </div>
            )}
          </div>
        )}

        {/* Store Info */}
        {activeTab === 'store' && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4">商店基本資訊</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'store_name', label: '商店名稱' },
                { key: 'tagline', label: 'Tagline' },
                { key: 'email', label: '聯絡信箱' },
                { key: 'phone', label: '聯絡電話' },
                { key: 'instagram', label: 'Instagram 帳號' },
                { key: 'facebook', label: 'Facebook 連結' },
                { key: 'line_id', label: 'LINE ID' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={(storeInfo as Record<string, unknown>)[key] as string ?? ''}
                    onChange={(e) => setStoreInfo({ ...storeInfo, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">免運費門檻 (TWD)</label>
                <input
                  type="number"
                  value={storeInfo.free_shipping_threshold}
                  onChange={(e) => setStoreInfo({ ...storeInfo, free_shipping_threshold: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">運費 (TWD)</label>
                <input
                  type="number"
                  value={storeInfo.shipping_fee}
                  onChange={(e) => setStoreInfo({ ...storeInfo, shipping_fee: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4">SEO 設定</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">網頁標題 (Meta Title)</label>
                <input
                  value={seo.meta_title}
                  onChange={(e) => setSeo({ ...seo, meta_title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
                <p className="text-xs text-gray-400 mt-1">建議 50-60 字元 | 目前 {seo.meta_title.length} 字</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">網站描述 (Meta Description)</label>
                <textarea
                  value={seo.meta_description}
                  onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#c9a84c]"
                />
                <p className="text-xs text-gray-400 mt-1">建議 120-160 字元 | 目前 {seo.meta_description.length} 字</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image（社群分享圖片）</label>
                <ImageUpload
                  value={seo.og_image}
                  onChange={(url) => setSeo({ ...seo, og_image: url })}
                  placeholder="圖片 URL 或點擊上傳"
                  folder="seo"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-[#0d1b3e] text-white hover:bg-[#1a2f5e]'
        }`}
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saving ? '儲存中...' : saved ? '已儲存！' : '儲存設定'}
      </button>
    </div>
  )
}
