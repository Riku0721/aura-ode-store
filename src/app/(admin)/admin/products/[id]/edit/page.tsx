import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditProductClient from './EditProductClient'
import type { ProductWithImages } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(`*, product_images(*), categories(*), inventory(*), product_variants(*)`)
      .eq('id', id)
      .single(),
    supabase.from('categories').select('id, name').order('name'),
  ])

  if (!product) notFound()

  return <EditProductClient product={product as ProductWithImages} categories={categories ?? []} />
}
