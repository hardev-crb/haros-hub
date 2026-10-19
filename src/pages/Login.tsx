import { useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { LogIn, Eye, EyeOff } from 'lucide-react'

interface Props {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Username dan password wajib diisi')
      return
    }
    setLoading(true)
    setError('')
    const supabase = getSupabase()
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) {
          if (signUpError.message?.includes('Database error') || signUpError.message?.includes('saving new user')) {
            throw new Error('Gagal membuat akun (database). Silakan coba lagi atau hubungi admin.')
          }
          throw signUpError
        }
        setError('Akun berhasil dibuat. Silakan login.')
        setIsSignUp(false)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        onLogin()
      }
    } catch (err: any) {
      setError(err.message || 'Gagal login. Periksa username dan password.')
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const supabase = getSupabase()
    const redirectUrl = window.location.hostname.includes('netlify.app')
      ? 'https://haros-hub.netlify.app/'
      : window.location.origin + '/'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
    if (error) {
      setError(error.message || 'Gagal login dengan Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logos/haros-hub-logo.jpg" alt="HarOS Hub" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
          <h1 className="text-2xl font-bold text-slate-900">HarOS Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Masuk ke akun HarOS Hub Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Username / Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full mt-1.5 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-700 transition"
          >
            <LogIn size={18} />
            {loading ? 'Memproses...' : isSignUp ? 'Daftar' : 'Masuk'}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-3 text-sm text-blue-600 hover:underline"
          >
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </form>
      </div>
    </div>
  )
}
