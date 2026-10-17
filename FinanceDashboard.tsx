import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

interface Props {
  onBack: () => void
}

interface Transaction {
  id: string
  type: 'in' | 'out'
  amount: number
  note: string
  created_at: string
}

export default function FinanceDashboard({ onBack }: Props) {
  const [items, setItems] = useState<Transaction[]>([])
  const [type, setType] = useState<'in' | 'out'>('in')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await getSupabase().from('finance_entries').select('*').order('created_at', { ascending: false }).limit(50)
    if (data) setItems(data)
    setLoading(false)
  }

  async function add() {
    if (!amount || isNaN(Number(amount))) return
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('finance_entries').insert({
      type,
      amount: Number(amount),
      note,
      created_by: user?.id,
    })
    setAmount('')
    setNote('')
    load()
  }

  const income = items.filter(i => i.type === 'in').reduce((s, i) => s + Number(i.amount), 0)
  const expense = items.filter(i => i.type === 'out').reduce((s, i) => s + Number(i.amount), 0)
  const balance = income - expense

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-500">←</button>
        <div>
          <h1 className="text-lg font-semibold">Har-Finance</h1>
          <p className="text-xs text-slate-400">Keuangan & Kas</p>
        </div>
      </header>
      <main className="p-4 space-y-4 max-w-2xl">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border p-4">
            <div className="text-xs text-slate-400">Masuk</div>
            <div className="font-bold text-green-600">Rp {income.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white rounded-2xl border p-4">
            <div className="text-xs text-slate-400">Keluar</div>
            <div className="font-bold text-red-600">Rp {expense.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white rounded-2xl border p-4">
            <div className="text-xs text-slate-400">Saldo</div>
            <div className="font-bold">Rp {balance.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setType('in')} className={`flex-1 py-2 rounded-xl text-sm ${type === 'in' ? 'bg-green-600 text-white' : 'bg-slate-100'}`}>Masuk</button>
            <button onClick={() => setType('out')} className={`flex-1 py-2 rounded-xl text-sm ${type === 'out' ? 'bg-red-600 text-white' : 'bg-slate-100'}`}>Keluar</button>
          </div>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Jumlah" type="number" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Keterangan" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium">Tambah</button>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-medium">Riwayat</div>
          {loading ? <div className="p-4 text-sm text-slate-400">Memuat...</div> : items.length === 0 ? <div className="p-4 text-sm text-slate-400">Belum ada data</div> : (
            <div className="divide-y">
              {items.map(i => (
                <div key={i.id} className="px-4 py-3 flex justify-between">
                  <div>
                    <div className="text-sm">{i.note || (i.type === 'in' ? 'Pemasukan' : 'Pengeluaran')}</div>
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
      </main>
    </div>
  )
}
