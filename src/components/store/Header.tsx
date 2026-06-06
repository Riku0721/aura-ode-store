'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Search, User, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/products', label: '商品' },
  { href: '/about', label: '關於我們' },
  { href: '/contact', label: '聯絡' },
]

interface Props {
  isAdmin?: boolean
}

export default function Header({ isAdmin = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1b3e]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-wide">
              Aura <span className="text-[#c9a84c]">&</span> Ode
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-[#c9a84c] transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/products?search=true"
              className="p-2 text-white/70 hover:text-[#c9a84c] transition-colors"
              aria-label="搜尋"
            >
              <Search size={20} />
            </Link>
            <Link
              href="/account"
              className="p-2 text-white/70 hover:text-[#c9a84c] transition-colors"
              aria-label="會員中心"
            >
              <User size={20} />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-white/70 hover:text-[#c9a84c] transition-colors"
              aria-label="購物車"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c9a84c] text-[#0d1b3e] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* 管理員後台按鈕 — 只有 admin/staff 才看得到 */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 bg-[#c9a84c] text-[#0d1b3e] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#e2c472] transition-colors"
                aria-label="管理後台"
              >
                <LayoutDashboard size={13} />
                後台
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="選單"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          menuOpen ? 'max-h-72' : 'max-h-0'
        )}
      >
        <nav className="bg-[#0d1b3e] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-[#c9a84c] transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-[#c9a84c] font-bold"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={15} />
              管理後台
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
