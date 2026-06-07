import AdminShell from '@/components/admin/AdminShell'

export const metadata = { title: 'Admin | Aura & Ode' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
