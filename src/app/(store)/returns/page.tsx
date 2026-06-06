import Link from 'next/link'
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export const metadata = { title: '退換貨政策 | Aura & Ode' }

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">RETURNS & EXCHANGES</p>
        <h1 className="text-3xl font-bold text-[#0d1b3e]">退換貨政策</h1>
        <p className="text-gray-500 mt-3">我們重視每一位顧客的購物體驗，若商品有問題，我們一定協助處理。</p>
      </div>

      {/* 7天鑑賞期 */}
      <div className="bg-[#0d1b3e] text-white rounded-2xl p-6 mb-8 flex gap-4 items-start">
        <RefreshCw size={24} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-lg mb-1">7 天鑑賞期保障</p>
          <p className="text-white/70 text-sm">依消費者保護法，收到商品後 7 天內（含假日）享有鑑賞期，可申請退貨。鑑賞期非試用期，商品需保持全新未使用狀態。</p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" /> 可退換貨情況
          </h2>
          <ul className="space-y-2">
            {[
              '商品有瑕疵、損壞（需附照片）',
              '收到商品與訂單描述不符',
              '7 天鑑賞期內，商品未使用且包裝完整',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-3 flex items-center gap-2">
            <XCircle size={16} className="text-red-400" /> 不接受退換貨情況
          </h2>
          <ul className="space-y-2">
            {[
              '商品已使用、配戴過，或有明顯使用痕跡',
              '吊牌、包裝已拆除或損毀',
              '香氛類商品（基於衛生考量）',
              '超過 7 天鑑賞期',
              '個人因素（不喜歡、選錯尺寸等）不在退貨範圍',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-[#0d1b3e] text-base mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#c9a84c]" /> 退換貨流程
          </h2>
          <ol className="space-y-3">
            {[
              '聯絡我們：透過 Line 或 Email 告知訂單編號及退換貨原因，並附上商品照片',
              '等待確認：我們將在 1-2 個工作天內回覆處理結果',
              '寄回商品：確認後將商品以原包裝寄回指定地址（退貨運費由顧客自行負擔，若為商品瑕疵則由我們支付）',
              '退款處理：確認收到商品後，於 5-7 個工作天內退款至原付款帳號',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="bg-gray-50 rounded-2xl p-5 mt-8">
          <p className="font-semibold text-[#0d1b3e] mb-1">需要協助？</p>
          <p className="text-gray-500 text-sm mb-3">若對退換貨有任何疑問，歡迎隨時聯絡我們，我們很樂意幫助您。</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0d1b3e] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#1a2f5e] transition-colors">
            聯絡我們
          </Link>
        </div>
      </div>
    </div>
  )
}
