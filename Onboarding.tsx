import { useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { ShoppingBag, Coffee, Briefcase, Check } from 'lucide-react'
import type { BusinessType } from '../types'

interface Props {
  onContinue: () => void
}

const businessTypes: { id: BusinessType; name: string; desc: string; icon: any; bg: string }[] = [
  { id: 'retail', name: 'Retail / Toko', desc: 'Kelola toko, stok, penjualan, dan pelanggan', icon: ShoppingBag, bg: 'bg-blue-50' },
  { id: 'fnb', name: 'F&B', desc: 'Kelola menu, pesanan, dapur, dan meja', icon: Coffee, bg: 'bg-green-50' },
  { id: 'jasa', name: 'Jasa', desc: 'Kelola layanan, klien, jadwal, dan tagihan', icon: Briefcase, bg: 'bg-purple-50' },
]

export default function Onboarding({ onContinue }: Props) {
  const [selected, setSelected] = useState<BusinessType | null>('retail')
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [step, setStep] = useState<'type' | 'info'>('type')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!businessName.trim() || !ownerName.trim() || !selected) {
      setError('Semua field harus diisi')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('User tidak ditemukan')
        setLoading(false)
        return
      }

      // Create business
      const { data: biz, error: bizError } = await supabase.from('businesses').insert({
        name: businessName.trim(),
        business_type: selected,
        owner_id: user.id,
      }).select().single()

      if (bizError) throw bizError

      // Create or update profile (trigger may have already created it)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        business_id: biz.id,
        full_name: ownerName.trim(),
        role: 'owner',
      }, { onConflict: 'id' })

      if (profileError) throw profileError

      localStorage.setItem('haros_business_name', businessName.trim())
      localStorage.setItem('haros_owner_name', ownerName.trim())
      localStorage.setItem('haros_business_type', selected)
      localStorage.setItem('haros_onboarding_done', 'true')
      onContinue()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logos/haros-hub-logo.jpg" alt="HarOS Hub" className="w-16 h-16 rounded-2xl object-cover shadow-md" />
        </div>

        <h1 className="text-center text-2xl font-bold text-slate-900 leading-tight">
          Selamat Datang di<br />
          <span className="text-blue-600">HarOS Hub</span>
        </h1>
        <p className="text-center text-slate-500 text-sm mt-2 mb-8">
          Lengkapi pengaturan awal untuk mulai mengelola usaha Anda
        </p>

        {step === 'type' ? (
          <>
            <div className="space-y-3">
              {businessTypes.map((bt) => {
                const Icon = bt.icon
                const isSelected = selected === bt.id
                return (
                  <button
                    key={bt.id}
                    onClick={() => setSelected(bt.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${bt.bg} flex items-center justify-center`}>
                      <Icon size={22} className={isSelected ? 'text-blue-600' : 'text-slate-600'} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{bt.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{bt.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setStep('info')}
              className="w-full mt-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              Lanjutkan
              <span className="text-lg">›</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setStep('type')} className="text-sm text-slate-500 mb-4">← Kembali</button>
            <h2 className="text-lg font-semibold mb-1">Informasi Usaha</h2>
            <p className="text-slate-500 text-sm mb-5">Lengkapi data berikut agar sistem dapat menyesuaikan pengalaman Anda</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600">Nama Usaha</label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Toko Maju Jaya"
                  className="w-full mt-1.5 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Nama Owner</label>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full mt-1.5 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-2xl bg-blue-600 text-white font-semibold disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Mulai Sekarang'}
            </button>
          </>
        )}

        <div className="flex justify-center mt-8">
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        </div>
      </div>
    </div>
  )
}
