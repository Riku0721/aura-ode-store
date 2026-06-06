import { createClient } from '@/lib/supabase/server'
import NewProductClient from './NewProductClient'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')

  return <NewProductClient categories={categories ?? []} />
}
