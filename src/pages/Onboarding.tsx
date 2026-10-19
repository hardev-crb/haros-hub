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

  async function handleFinish() {
    if (!businessName || !ownerName) return
    setLoading(true)
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        business_type: selected,
        business_name: businessName,
        full_name: ownerName,
        onboarding_completed: true,
      })
    }
    localStorage.setItem('haros_business_name', businessName)
    localStorage.setItem('haros_owner_name', ownerName)
    localStorage.setItem('haros_onboarding_done', 'true')
    setLoading(false)
    onContinue()
  }

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Pilih Jenis Usaha</h1>
            <p className="text-slate-500 text-sm mt-1">Ini akan membantu menyesuaikan modul yang ditampilkan</p>
          </div>
          <div className="space-y-3">
            {businessTypes.map((bt) => {
              const Icon = bt.icon
              const active = selected === bt.id
              return (
                <button
                  key={bt.id}
                  onClick={() => setSelected(bt.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition ${
                    active ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bt.bg}`}>
                    <Icon size={24} className={active ? 'text-blue-600' : 'text-slate-600'} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{bt.name}</div>
                    <div className="text-xs text-slate-500">{bt.desc}</div>
                  </div>
                  {active && <Check size={20} className="text-blue-600" />}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setStep('info')}
            disabled={!selected}
            className="w-full mt-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Informasi Usaha</h1>
          <p className="text-slate-500 text-sm mt-1">Isi data dasar usaha Anda</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">Nama Usaha</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Contoh: Toko Maju Jaya"
              className="w-full mt-1.5 px-4 py-3 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Nama Owner</label>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Nama lengkap Anda"
              className="w-full mt-1.5 px-4 py-3 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <button
            onClick={handleFinish}
            disabled={loading || !businessName || !ownerName}
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Selesai'}
          </button>
        </div>
      </div>
    </div>
  )
}
