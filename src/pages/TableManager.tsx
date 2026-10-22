import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface Props { onBack: () => void }
interface Table { id: string; name: string; capacity: number; status: string }

export default function TableManager({ onBack }: Props) {
  const [list, setList] = useState<Table[]>([])
  const [name, setName] = useState('')
  const [cap, setCap] = useState(4)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await getSupabase().from('tables').select('*').order('name')
    if (data) setList(data)
  }
  async function add() {
    if (!name) return
    await getSupabase().from('tables').insert({ name, capacity: cap, status: 'available' })
    setName(''); load()
  }
  async function del(id: string) {
    await getSupabase().from('tables').delete().eq('id', id); load()
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={onBack}><ArrowLeft size={20} /></button><span className="font-semibold">Manajemen Meja</span></header>
      <main className="p-4 max-w-lg">
        <div className="bg-white rounded-2xl border p-4 mb-4 flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama meja" className="flex-1 border rounded-xl px-3 py-2 text-sm" />
          <input type="number" value={cap} onChange={e => setCap(Number(e.target.value))} className="w-16 border rounded-xl px-2 text-sm" />
          <button onClick={add} className="px-3 bg-blue-600 text-white rounded-xl"><Plus size={16} /></button>
        </div>
        {list.map(t => (
          <div key={t.id} className="bg-white rounded-xl border px-4 py-3 mb-2 flex justify-between items-center text-sm">
            <div><div className="font-medium">{t.name}</div><div className="text-xs text-slate-500">{t.capacity} orang · {t.status}</div></div>
            <button onClick={() => del(t.id)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </main>
    </div>
  )
}
