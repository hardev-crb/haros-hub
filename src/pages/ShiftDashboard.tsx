import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Clock, Plus, Check } from 'lucide-react'

interface Props { onBack: () => void }
interface Shift { id: string; opened_at: string; closed_at?: string; opening_cash: number; closing_cash?: number; status: string; note?: string }

export default function ShiftDashboard({ onBack }: Props) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [opening, setOpening] = useState(0)
  const [closing, setClosing] = useState(0)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  const [expected, setExpected] = useState(0)

  async function load() {
    const { data } = await getSupabase().from('shifts').select('*').order('opened_at', { ascending: false }).limit(20)
    if (data) setShifts(data)
    const open = data?.find(s => s.status === 'open')
    if (open) {
      const { data: txs } = await getSupabase().from('transactions').select('total').gte('created_at', open.opened_at).neq('status', 'void')
      const sales = (txs || []).reduce((s, t) => s + Number(t.total || 0), 0)
      setExpected(Number(open.opening_cash || 0) + sales)
    }
  }

  const openShift = shifts.find(s => s.status === 'open')

  async function open() {
    setLoading(true)
    const { data: { user } } = await getSupabase().auth.getUser()
    await getSupabase().from('shifts').insert({ opening_cash: opening, opened_by: user?.id, status: 'open', note })
    setOpening(0); setNote(''); setLoading(false); load()
  }

  async function close() {
    if (!openShift) return
    setLoading(true)
    await getSupabase().from('shifts').update({
      closed_at: new Date().toISOString(),
      closing_cash: closing,
      expected_cash: expected,
      status: 'closed',
      note: note || openShift.note,
    }).eq('id', openShift.id)
    setClosing(0); setNote(''); setLoading(false); load()
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <div className="flex items-center gap-2"><Clock size={18} className="text-blue-600" /><span className="font-semibold">Shift Kasir</span></div>
      </header>
      <main className="p-4 max-w-lg">
        {openShift ? (
          <div className="bg-white rounded-2xl border p-4 mb-4">
            <div className="text-sm font-medium text-emerald-600 mb-2">Shift sedang terbuka</div>
            <div className="text-xs text-slate-500 mb-3">Dibuka: {new Date(openShift.opened_at).toLocaleString('id-ID')}</div>
            <div className="text-sm">Kas awal: Rp {Number(openShift.opening_cash).toLocaleString('id-ID')}</div>
            <div className="text-sm text-emerald-600">Expected: Rp {expected.toLocaleString('id-ID')}</div>
            <div className="mt-3 space-y-2">
              <input type="number" value={closing} onChange={e => setClosing(Number(e.target.value))} placeholder="Kas akhir" className="w-full border rounded-xl px-3 py-2 text-sm" />
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan penutupan" className="w-full border rounded-xl px-3 py-2 text-sm" />
              <button onClick={close} disabled={loading} className="w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium">Tutup Shift</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border p-4 mb-4">
            <div className="text-sm font-medium mb-3">Buka Shift Baru</div>
            <input type="number" value={opening} onChange={e => setOpening(Number(e.target.value))} placeholder="Kas awal" className="w-full border rounded-xl px-3 py-2 text-sm mb-2" />
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan" className="w-full border rounded-xl px-3 py-2 text-sm mb-3" />
            <button onClick={open} disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1"><Plus size={16} /> Buka Shift</button>
          </div>
        )}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-2 border-b text-sm font-medium">Riwayat Shift</div>
          {shifts.length === 0 && <div className="p-4 text-sm text-slate-400">Belum ada shift</div>}
          {shifts.map(s => (
            <div key={s.id} className="px-4 py-3 border-b text-sm flex justify-between">
              <div>
                <div className="font-medium">{new Date(s.opened_at).toLocaleDateString('id-ID')}</div>
                <div className="text-xs text-slate-500">Kas awal Rp {Number(s.opening_cash).toLocaleString('id-ID')}</div>
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>{s.status}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
