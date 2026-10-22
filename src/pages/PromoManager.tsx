import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface Props { onBack: () => void }
interface Promo { id: string; name: string; code?: string; type: string; value: number; min_subtotal: number; active: boolean }

export default function PromoManager({ onBack }: Props) {
  const [list, setList] = useState<Promo[]>([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percent' | 'amount'>('percent')
  const [value, setValue] = useState(10)
  const [min, setMin] = useState(0)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await getSupabase().from('promos').select('*').order('created_at', { ascending: false })
    if (data) setList(data)
  }
  async function add() {
    if (!name) return
    await getSupabase().from('promos').insert({ name, code: code || null, type, value, min_subtotal: min, active: true })
    setName(''); setCode(''); load()
  }
  async function del(id: string) {
    await getSupabase().from('promos').delete().eq('id', id); load()
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={onBack}><ArrowLeft size={20} /></button><span className="font-semibold">Manajemen Promo</span></header>
      <main className="p-4 max-w-lg">
        <div className="bg-white rounded-2xl border p-4 mb-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama promo" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Kode (opsional)" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <select value={type} onChange={e => setType(e.target.value as any)} className="border rounded-xl px-2 py-2 text-sm"><option value="percent">Persen</option><option value="amount">Nominal</option></select>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="flex-1 border rounded-xl px-3 py-2 text-sm" />
          </div>
          <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} placeholder="Min belanja" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm">Tambah Promo</button>
        </div>
        {list.map(p => (
          <div key={p.id} className="bg-white rounded-xl border px-4 py-3 mb-2 flex justify-between items-center text-sm">
            <div><div className="font-medium">{p.name}</div><div className="text-xs text-slate-500">{p.code || '-'} · {p.type === 'percent' ? `${p.value}%` : `Rp ${p.value}`}</div></div>
            <button onClick={() => del(p.id)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </main>
    </div>
  )
}
