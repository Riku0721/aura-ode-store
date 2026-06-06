'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'

export default function InventoryEditor({
  inventoryId,
  currentQty,
}: {
  inventoryId: string
  currentQty: number
}) {
  const [editing, setEditing] = useState(false)
  const [qty, setQty] = useState(String(currentQty))
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const save = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('inventory').update({ quantity: parseInt(qty) }).eq('id', inventoryId)
    setEditing(false)
    setLoading(false)
    router.refresh()
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          min="0"
          className="w-16 px-2 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#c9a84c]"
          autoFocus
        />
        <button onClick={save} disabled={loading} className="p-1 text-green-600 hover:bg-green-50 rounded">
          <Check size={14} />
        </button>
        <button onClick={() => { setEditing(false); setQty(String(currentQty)) }} className="p-1 text-red-400 hover:bg-red-50 rounded">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-sm text-[#c9a84c] hover:underline"
    >
      調整庫存
    </button>
  )
}
