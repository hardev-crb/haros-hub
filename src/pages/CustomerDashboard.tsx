import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { Users, ArrowLeft, Plus, Phone, Bell } from 'lucide-react'

interface Props { onBack: () => void }

export default function CustomerDashboard({ onBack }: Props) {
  const [customers, setCustomers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data, error: err } = await getSupabase().from('customers').select('*').order('created_at', { ascending: false })
      if (err) throw err
      if (data) setCustomers(data)
    } catch (e: any) {
      setError(e.message || 'Tabel customers belum tersedia. Akan dibuat nanti.')
    } finally {
      setLoading(false)
    }
  }

  async function add() {
    if (!name.trim()) return
    setAdding(true)
    try {
      const { error: err } = await getSupabase().from('customers').insert({ name: name.trim(), phone })
      if (err) throw err
      setName(''); setPhone('')
      await load()
    } catch (e: any) {
      setError(e.message || 'Gagal menambah pelanggan.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-Customer</div>
              <div className="text-xs text-blue-200">Pelanggan & CRM</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">Manajemen Pelanggan</h1>
          <p className="text-blue-100 text-sm mt-0.5">Kelola data pelanggan dan hubungan bisnis.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="text-[10px] text-slate-500 mb-1">TOTAL PELANGGAN</div>
            <div className="text-lg font-bold text-slate-900">{customers.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="text-[10px] text-slate-500 mb-1">BARU BULAN INI</div>
            <div className="text-lg font-bold text-slate-900">—</div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 mb-4">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus size={16} /> Tambah Pelanggan</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama pelanggan" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nomor HP" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <button onClick={add} disabled={adding || !name.trim()} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition">
            {adding ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-700">Daftar Pelanggan</div>
          {loading ? <div className="p-6 text-center text-sm text-slate-400">Memuat...</div> : customers.length === 0 ? <div className="p-6 text-center text-sm text-slate-400">Belum ada pelanggan</div> : (
            <div className="divide-y">
              {customers.map(c => (
                <div key={c.id} className="px-4 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">{c.name?.slice(0,1)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">{c.name}</div>
                    {c.phone && <div className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12} /> {c.phone}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
