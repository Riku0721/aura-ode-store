import { createClient } from '@/lib/supabase/server'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin' || profile?.role === 'staff'
  }

  return (
    <>
      <Header isAdmin={isAdmin} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  )
}
