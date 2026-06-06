import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#050d1f] text-white/70 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-xl font-bold mb-2">
              Aura <span className="text-[#c9a84c]">&</span> Ode
            </h2>
            <p className="text-sm text-white/50 mb-1">ACCESSORIES & SCENT</p>
            <p className="text-sm mt-4 leading-relaxed">
              Live in light. Sing your life.<br />
              Wear your little universe.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 rounded-full border border-white/20 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full border border-white/20 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/products', label: '所有商品' },
                { href: '/products?category=earrings', label: '耳飾' },
                { href: '/products?category=bracelets', label: '手鍊' },
                { href: '/products?category=scents', label: '香氛' },
                { href: '/about', label: '關於我們' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#c9a84c] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">顧客服務</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/account', label: '會員中心' },
                { href: '/account/orders', label: '訂單查詢' },
                { href: '/shipping', label: '運費說明' },
                { href: '/returns', label: '退換貨政策' },
                { href: '/contact', label: '聯絡我們' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#c9a84c] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Aura & Ode. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">隱私政策</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">服務條款</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
