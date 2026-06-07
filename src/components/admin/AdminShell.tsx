'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'

const STORAGE_KEY = 'admin-sidebar-collapsed'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === '1'
    if (stored !== collapsed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      setCollapsed(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} p-8 min-h-screen transition-[margin] duration-200`}>
        {children}
      </main>
    </div>
  )
}
