'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(redirect)
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('')
        alert('請確認您的電子信箱完成驗證！')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(['login', 'signup'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === m ? 'bg-white shadow-sm text-[#0d1b3e]' : 'text-gray-500'
            }`}
          >
            {m === 'login' ? '登入' : '註冊'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">電子信箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
            placeholder="至少 6 位數"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0d1b3e] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a2f5e] transition-all disabled:opacity-50"
        >
          {loading ? '處理中...' : mode === 'login' ? '登入' : '建立帳戶'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/checkout" className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors">
          不想註冊？以訪客身份結帳
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen starry-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">
            Aura <span className="text-[#c9a84c]">&</span> Ode
          </Link>
          <p className="text-white/60 mt-2 text-sm">登入您的帳戶</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-xl p-8 text-center text-gray-400">載入中...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
