import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductDetailClient from './ProductDetailClient'
import type { ProductWithImages } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const slug = decodeURIComponent(id)
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(*),
      inventory(*),
      product_variants(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  return <ProductDetailClient product={product as ProductWithImages} />
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const slug = decodeURIComponent(id)
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name, short_description').eq('slug', slug).single()
  return {
    title: data ? `${data.name} | Aura & Ode` : 'Aura & Ode',
    description: data?.short_description ?? '',
  }
}
