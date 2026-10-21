import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { Users, ArrowLeft, Plus, Phone } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 md:ml-56">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100"><ArrowLeft size={20} /></button>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center text-white">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Har-Customer</h1>
          <p className="text-xs text-slate-500">Pelanggan & CRM</p>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-2xl">
        {error && <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus size={16} /> Tambah Pelanggan</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama pelanggan" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="No. HP" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
          <button onClick={add} disabled={adding || !name.trim()} className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition">
            {adding ? 'Menyimpan...' : 'Tambah Pelanggan'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-700 flex items-center gap-2"><Users size={16} /> Daftar Pelanggan</div>
          {loading ? <div className="p-6 text-center text-sm text-slate-400">Memuat...</div> : customers.length === 0 ? <div className="p-6 text-center text-sm text-slate-400">Belum ada pelanggan</div> : (
            <div className="divide-y">
              {customers.map(c => (
                <div key={c.id} className="px-4 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-semibold">
                    {c.name?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12} /> {c.phone || '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
