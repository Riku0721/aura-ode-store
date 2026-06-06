'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  current: string
}

export default function ProductSortSelect({ current }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#c9a84c]"
    >
      <option value="newest">最新上架</option>
      <option value="price_asc">價格：低到高</option>
      <option value="price_desc">價格：高到低</option>
    </select>
  )
}
