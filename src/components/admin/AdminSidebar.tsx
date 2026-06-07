'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  BarChart3, Settings, Tag, Bell, ExternalLink,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: '總覽' },
  { href: '/admin/orders', icon: ShoppingCart, label: '訂單管理' },
  { href: '/admin/products', icon: Package, label: '商品管理' },
  { href: '/admin/inventory', icon: Tag, label: '庫存管理' },
  { href: '/admin/customers', icon: Users, label: '顧客管理' },
  { href: '/admin/analytics', icon: BarChart3, label: '數據報表' },
  { href: '/admin/settings', icon: Settings, label: '網站設定' },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-[#0d1b3e] text-white flex flex-col z-40 transition-[width] duration-200`}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between gap-2">
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-bold text-lg truncate">
              Aura <span className="text-[#c9a84c]">&</span> Ode
            </h1>
            <p className="text-xs text-white/40 mt-0.5">管理後台</p>
          </div>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? '展開選單' : '收合選單'}
          className="shrink-0 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-[#c9a84c] text-[#0d1b3e]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? '前往商店' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <ExternalLink size={16} />
          {!collapsed && '前往商店'}
        </Link>
        <NotificationBell collapsed={collapsed} />
      </div>
    </aside>
  )
}

function NotificationBell({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/admin/notifications"
      title={collapsed ? '通知' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all ${collapsed ? 'justify-center' : ''}`}
    >
      <Bell size={16} />
      {!collapsed && '通知'}
    </Link>
  )
}
