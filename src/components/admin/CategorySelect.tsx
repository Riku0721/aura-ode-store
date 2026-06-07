'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Settings2, X, Pencil, Trash2 } from 'lucide-react'

export interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
  value: string
  onChange: (id: string) => void
}

const slugify = (name: string) =>
  name.toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w一-龥-]/g, '')
    .replace(/--+/g, '-')

const sortByName = (cats: Category[]) =>
  [...cats].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))

export default function CategorySelect({ categories: initial, value, onChange }: Props) {
  const [categories, setCategories] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug: slugify(name) })
      .select('id, name')
      .single()
    setSaving(false)
    if (error || !data) {
      alert('新增分類失敗，請確認名稱是否重複')
      return
    }
    setCategories(sortByName([...categories, data]))
    onChange(data.id)
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">分類</label>
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="flex items-center gap-1 text-[#c9a84c] hover:underline"
          >
            <Plus size={12} /> 新增分類
          </button>
          <button
            type="button"
            onClick={() => setShowManage(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <Settings2 size={12} /> 管理分類
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-1.5">選擇此商品要顯示在商店的哪個分類，沒有適合的分類可以直接新增</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
      >
        <option value="">未分類</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {showAdd && (
        <div className="mt-2 flex items-center gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
            placeholder="新分類名稱，例如：耳飾"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !newName.trim()}
            className="px-3 py-2 rounded-xl bg-[#0d1b3e] text-white text-xs font-medium disabled:opacity-50"
          >
            {saving ? '新增中...' : '新增'}
          </button>
          <button
            type="button"
            onClick={() => { setShowAdd(false); setNewName('') }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {showManage && (
        <CategoryManageModal
          categories={categories}
          selectedId={value}
          onClose={() => setShowManage(false)}
          onUpdate={setCategories}
          onSelectedRemoved={() => onChange('')}
        />
      )}
    </div>
  )
}

function CategoryManageModal({
  categories, selectedId, onClose, onUpdate, onSelectedRemoved,
}: {
  categories: Category[]
  selectedId: string
  onClose: () => void
  onUpdate: (cats: Category[]) => void
  onSelectedRemoved: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const saveEdit = async (id: string) => {
    const name = editingName.trim()
    if (!name) return
    setBusyId(id)
    const supabase = createClient()
    const { error } = await supabase.from('categories').update({ name, slug: slugify(name) }).eq('id', id)
    setBusyId(null)
    if (error) {
      alert('更新分類失敗')
      return
    }
    onUpdate(sortByName(categories.map((c) => (c.id === id ? { ...c, name } : c))))
    setEditingId(null)
  }

  const remove = async (cat: Category) => {
    if (!confirm(`確定要刪除分類「${cat.name}」嗎？使用此分類的商品將會變成未分類。`)) return
    setBusyId(cat.id)
    const supabase = createClient()
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    setBusyId(null)
    if (error) {
      alert('刪除失敗，請稍後再試')
      return
    }
    onUpdate(categories.filter((c) => c.id !== cat.id))
    if (selectedId === cat.id) onSelectedRemoved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900">管理分類</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4">重新命名或刪除商店的商品分類</p>
        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {categories.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">尚無分類，請先在上方新增</p>
          )}
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(cat.id) } }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(cat.id)}
                    disabled={busyId === cat.id || !editingName.trim()}
                    className="text-xs text-[#c9a84c] font-medium px-2 py-1.5 disabled:opacity-50"
                  >
                    儲存
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 px-3 py-1.5 truncate">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="text-gray-400 hover:text-[#c9a84c] p-1.5"
                    title="重新命名"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(cat)}
                    disabled={busyId === cat.id}
                    className="text-gray-400 hover:text-red-500 p-1.5 disabled:opacity-50"
                    title="刪除"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
