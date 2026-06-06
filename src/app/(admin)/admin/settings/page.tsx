import { createClient } from '@/lib/supabase/server'
import SiteSettingsClient from './SiteSettingsClient'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*')
  const settingsMap: Record<string, unknown> = {}
  settings?.forEach((s) => { settingsMap[s.key] = s.value })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">網站設定</h1>
        <p className="text-gray-500 text-sm mt-1">管理首頁圖片、商店資訊、SEO 設定等</p>
      </div>
      <SiteSettingsClient initialSettings={settingsMap} />
    </div>
  )
}
