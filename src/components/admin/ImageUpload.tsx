'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Props {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  folder?: string // e.g. 'banners', 'products'
}

export default function ImageUpload({
  value,
  onChange,
  placeholder = '圖片 URL 或點擊上傳',
  folder = 'misc',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片檔案')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('圖片大小不能超過 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      onChange(data.publicUrl)
    } catch (err) {
      console.error(err)
      setError('上傳失敗，請重試')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && !value.startsWith('/images/hero') && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <Image src={value} alt="預覽" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow transition-colors"
          >
            <X size={14} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Input + Upload button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#0d1b3e] text-white rounded-xl text-sm font-medium hover:bg-[#1a2f5e] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? '上傳中...' : '上傳圖片'}
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-[#c9a84c]/50 hover:text-gray-500 transition-colors"
      >
        拖曳圖片到這裡，或點擊選擇檔案（JPG、PNG、WebP，最大 5MB）
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
