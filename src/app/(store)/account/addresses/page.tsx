'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2, MapPin } from 'lucide-react'

interface Address {
  id: string
  recipient_name: string
  phone: string
  city: string
  district: string
  address: string
  postal_code: string | null
  is_default: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ recipient_name: '', phone: '', city: '', district: '', address: '', postal_code: '', is_default: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login?redirect=/account/addresses'); return }
      supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).then(({ data }) => {
        setAddresses(data ?? [])
        setLoading(false)
      })
    })
  }, [router])

  const handleSave = async () => {
    if (!form.recipient_name || !form.phone || !form.city || !form.district || !form.address) {
      alert('請填寫必填欄位')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (form.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    }

    const { data, error } = await supabase.from('addresses').insert({ ...form, user_id: user.id }).select().single()
    if (!error && data) {
      setAddresses((prev) => form.is_default ? [data, ...prev.map(a => ({ ...a, is_default: false }))] : [...prev, data])
      setShowForm(false)
      setForm({ recipient_name: '', phone: '', city: '', district: '', address: '', postal_code: '', is_default: false })
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除此地址？')) return
    const supabase = createClient()
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/account" className="text-gray-400 hover:text-gray-600"><ChevronLeft size={20} /></Link>
          <h1 className="text-2xl font-bold text-[#0d1b3e]">收件地址</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-sm bg-[#0d1b3e] text-white px-4 py-2 rounded-xl hover:bg-[#1a2f5e] transition-colors"
        >
          <Plus size={14} /> 新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-bold text-gray-900 mb-4">新增收件地址</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">收件人 <span className="text-red-400">*</span></label>
              <input value={form.recipient_name} onChange={e => setForm({...form, recipient_name: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">手機號碼 <span className="text-red-400">*</span></label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">縣市 <span className="text-red-400">*</span></label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="台北市" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">鄉鎮市區 <span className="text-red-400">*</span></label>
              <input value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="大安區" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">詳細地址 <span className="text-red-400">*</span></label>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="XX路XX號XX樓" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">郵遞區號</label>
              <input value={form.postal_code} onChange={e => setForm({...form, postal_code: e.target.value})} className={inputClass} />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" id="is_default" checked={form.is_default} onChange={e => setForm({...form, is_default: e.target.checked})} className="rounded" />
              <label htmlFor="is_default" className="text-sm text-gray-700 cursor-pointer">設為預設地址</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#0d1b3e] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a2f5e] transition-colors disabled:opacity-50">
              {saving ? '儲存中...' : '儲存地址'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors">取消</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm">尚未設定收件地址</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
              <div>
                {addr.is_default && <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded-full font-medium mr-2">預設</span>}
                <span className="font-semibold text-gray-900">{addr.recipient_name}</span>
                <span className="text-gray-400 text-sm ml-2">{addr.phone}</span>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.postal_code && `${addr.postal_code} `}{addr.city}{addr.district}{addr.address}
                </p>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-4 mt-0.5">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
