import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { Wallet, ArrowLeft, ArrowDownCircle, ArrowUpCircle, Plus, Bell } from 'lucide-react'

interface Props { onBack: () => void }

interface Entry {
  id: string
  type: 'in' | 'out'
  amount: number
  note: string
  created_at: string
}

export default function FinanceDashboard({ onBack }: Props) {
  const [items, setItems] = useState<Entry[]>([])
  const [type, setType] = useState<'in' | 'out'>('in')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data, error: err } = await getSupabase().from('finance_entries').select('*').order('created_at', { ascending: false }).limit(50)
      if (err) throw err
      if (data) setItems(data)
    } catch (e: any) {
      setError(e.message || 'Tabel finance_entries belum tersedia. Akan dibuat nanti.')
    } finally {
      setLoading(false)
    }
  }

  async function add() {
    if (!amount || isNaN(Number(amount))) return
    setAdding(true)
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      const { error: err } = await supabase.from('finance_entries').insert({
        type,
        amount: Number(amount),
        note,
        created_by: user?.id,
      })
      if (err) throw err
      setAmount(''); setNote('')
      await load()
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan. Pastikan tabel finance_entries sudah dibuat.')
    } finally {
      setAdding(false)
    }
  }

  const income = items.filter(i => i.type === 'in').reduce((s, i) => s + Number(i.amount), 0)
  const expense = items.filter(i => i.type === 'out').reduce((s, i) => s + Number(i.amount), 0)
  const balance = income - expense

  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      {/* Dark Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-Finance</div>
              <div className="text-xs text-blue-200">Keuangan & Kas</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">Ringkasan Keuangan</h1>
          <p className="text-blue-100 text-sm mt-0.5">Pantau pemasukan, pengeluaran, dan saldo usaha.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1"><ArrowDownCircle size={12} /> MASUK</div>
            <div className="text-lg font-semibold text-slate-900">Rp {income.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1"><ArrowUpCircle size={12} /> KELUAR</div>
            <div className="text-lg font-semibold text-slate-900">Rp {expense.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="text-[10px] font-medium text-slate-500 mb-1">SALDO</div>
            <div className={`text-lg font-semibold text-slate-900 ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>Rp {balance.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 mb-4">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus size={16} /> Catat Transaksi</div>
          <div className="flex gap-2">
            <button onClick={() => setType('in')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${type === 'in' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Masuk</button>
            <button onClick={() => setType('out')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${type === 'out' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Keluar</button>
          </div>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Jumlah (Rp)" type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Keterangan" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <button onClick={add} disabled={adding || !amount} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition">
            {adding ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-700">Riwayat Keuangan</div>
          {loading ? <div className="p-6 text-center text-sm text-slate-400">Memuat...</div> : items.length === 0 ? <div className="p-6 text-center text-sm text-slate-400">Belum ada data</div> : (
            <div className="divide-y">
              {items.map(i => (
                <div key={i.id} className="px-4 py-3.5 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{i.note || (i.type === 'in' ? 'Pemasukan' : 'Pengeluaran')}</div>
                    <div className="text-xs text-slate-400">{new Date(i.created_at).toLocaleString('id-ID')}</div>
                  </div>
                  <div className={`text-sm font-semibold ${i.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {i.type === 'in' ? '+' : '-'} Rp {Number(i.amount).toLocaleString('id-ID')}
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
