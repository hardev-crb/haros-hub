import { useState } from 'react'
import { ArrowLeft, Gift, Plus, Bell } from 'lucide-react'

interface Props { onBack: () => void }

interface Promo {
  id: string
  name: string
  type: string
  value: string
  status: string
}

export default function PromoDashboard({ onBack }: Props) {
  const [promos, setPromos] = useState<Promo[]>([
    { id: '1', name: 'Diskon Akhir Pekan', type: 'Persen', value: '15%', status: 'Aktif' },
    { id: '2', name: 'Voucher Member', type: 'Nominal', value: 'Rp 20.000', status: 'Aktif' },
  ])
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  function add() {
    if (!name.trim()) return
    setPromos(prev => [{ id: Date.now().toString(), name: name.trim(), type: 'Persen', value: value || '0%', status: 'Aktif' }, ...prev])
    setName(''); setValue('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <header className="relative px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Gift size={18} />
            </div>
            <div>
              <div className="font-semibold text-[15px]">Har-Promo</div>
              <div className="text-[11px] text-blue-200/80">Diskon & Promo</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-5 pb-7">
          <h1 className="text-lg font-semibold">Manajemen Promo</h1>
          <p className="text-blue-100/80 text-[13px] mt-1">Buat dan kelola diskon serta voucher.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="text-[10px] font-medium text-slate-500 tracking-wide mb-1">TOTAL PROMO</div>
            <div className="text-lg font-semibold text-slate-900">{promos.length}</div>
          </div>
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="text-[10px] font-medium text-slate-500 tracking-wide mb-1">AKTIF</div>
            <div className="text-lg font-semibold text-slate-900">{promos.filter(p => p.status === 'Aktif').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] p-4 space-y-3 mb-4 border border-slate-100">
          <div className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Plus size={16} /> Buat Promo Baru</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama promo" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <input value={value} onChange={e => setValue(e.target.value)} placeholder="Nilai (cth: 15% atau Rp 20000)" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <button onClick={add} className="w-full py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition">Simpan Promo</button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-800">Daftar Promo</div>
          <div className="divide-y">
            {promos.map(p => (
              <div key={p.id} className="px-4 py-3.5 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">{p.value}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
