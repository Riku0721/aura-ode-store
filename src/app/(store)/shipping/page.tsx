import Link from 'next/link'
import { Truck, Clock, MapPin, Package } from 'lucide-react'

export const metadata = { title: '運費說明 | Aura & Ode' }

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">SHIPPING</p>
        <h1 className="text-3xl font-bold text-[#0d1b3e]">運費說明</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Truck, title: '免運門檻', desc: '單筆消費滿 NT$1,500 享免運費' },
          { icon: Clock, title: '出貨時間', desc: '訂單確認後 1-3 個工作天出貨' },
          { icon: MapPin, title: '配送範圍', desc: '台灣本島、離島（運費另計）' },
          { icon: Package, title: '配送方式', desc: '黑貓宅急便 / 新竹物流' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0d1b3e]/5 flex items-center justify-center flex-shrink-0">
              <Icon size={20} className="text-[#c9a84c]" />
            </div>
            <div>
              <p className="font-bold text-[#0d1b3e] text-sm">{title}</p>
              <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-2">運費計算</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 rounded-tl-lg">訂單金額</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 rounded-tr-lg">運費</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-4 py-2.5">NT$0 – NT$1,499</td>
                <td className="px-4 py-2.5 font-medium text-[#0d1b3e]">NT$60</td>
              </tr>
              <tr className="border-t border-gray-100 bg-green-50/50">
                <td className="px-4 py-2.5">NT$1,500 以上</td>
                <td className="px-4 py-2.5 font-medium text-green-600">免運費 🎉</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-2">配送時間</h2>
          <p>訂單於每日 14:00 前付款完成，當日寄出（例假日除外）。付款後您將收到出貨通知 Email，並附上追蹤號碼。一般配送時間約 1-3 個工作天。</p>
        </section>

        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-2">離島配送</h2>
          <p>澎湖、金門、馬祖等離島地區需額外收取運費，實際金額於結帳時顯示。若有疑問歡迎透過 <Link href="/contact" className="text-[#c9a84c] hover:underline">聯絡我們</Link> 詢問。</p>
        </section>

        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-2">注意事項</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-500">
            <li>颱風、天災等不可抗力因素可能造成配送延誤</li>
            <li>請確認收件地址正確，若因地址錯誤導致退件，重寄需補繳運費</li>
            <li>包裹送達時如外包裝有明顯損壞，請拒絕收件並聯絡我們</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
