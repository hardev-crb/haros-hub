import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Calendar, Plus } from 'lucide-react'

interface Props { onBack: () => void }
interface Reservation { id: string; customer_name: string; phone?: string; reserved_at: string; party_size: number; status: string; table_id?: string; note?: string }
interface Table { id: string; name: string }

export default function ReservationDashboard({ onBack }: Props) {
  const [list, setList] = useState<Reservation[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [tableId, setTableId] = useState('')
  const [when, setWhen] = useState('')
  const [size, setSize] = useState(2)
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const sb = getSupabase()
    const [r, t] = await Promise.all([
      sb.from('reservations').select('*').order('reserved_at', { ascending: false }).limit(30),
      sb.from('tables').select('id, name').order('name'),
    ])
    if (r.data) setList(r.data)
    if (t.data) setTables(t.data)
  }

  async function add() {
    if (!name || !when) return
    setLoading(true)
    await getSupabase().from('reservations').insert({
      customer_name: name, phone, table_id: tableId || null,
      reserved_at: new Date(when).toISOString(), party_size: size, status: 'pending'
    })
    setName(''); setPhone(''); setWhen(''); setLoading(false); load()
  }

  async function setStatus(id: string, status: string) {
    await getSupabase().from('reservations').update({ status }).eq('id', id)
    load()
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <div className="flex items-center gap-2"><Calendar size={18} className="text-blue-600" /><span className="font-semibold">Reservasi</span></div>
      </header>
      <main className="p-4 max-w-lg">
        <div className="bg-white rounded-2xl border p-4 mb-4 space-y-2">
          <div className="text-sm font-medium">Reservasi Baru</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama pelanggan" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="No. HP" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <select value={tableId} onChange={e => setTableId(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm">
            <option value="">Pilih meja (opsional)</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input type="number" value={size} onChange={e => setSize(Number(e.target.value))} placeholder="Jumlah orang" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} disabled={loading || !name || !when} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1"><Plus size={16} /> Simpan</button>
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-2 border-b text-sm font-medium">Daftar Reservasi</div>
          {list.length === 0 && <div className="p-4 text-sm text-slate-400">Belum ada reservasi</div>}
          {list.map(r => (
            <div key={r.id} className="px-4 py-3 border-b text-sm">
              <div className="flex justify-between">
                <div className="font-medium">{r.customer_name}</div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{r.status}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{new Date(r.reserved_at).toLocaleString('id-ID')} · {r.party_size} orang</div>
              <div className="flex gap-1 mt-2">
                {['confirmed', 'seated', 'cancelled'].map(st => (
                  <button key={st} onClick={() => setStatus(r.id, st)} className="text-[10px] px-2 py-0.5 border rounded">{st}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
