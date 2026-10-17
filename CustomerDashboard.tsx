import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

interface Props { onBack: () => void }

export default function CustomerDashboard({ onBack }: Props) {
  const [customers, setCustomers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await getSupabase().from('customers').select('*').order('created_at', { ascending: false })
    if (data) setCustomers(data)
    setLoading(false)
  }

  async function add() {
    if (!name) return
    await getSupabase().from('customers').insert({ name, phone })
    setName('')
    setPhone('')
    load()
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={onBack}>←</button>
        <h1 className="text-lg font-semibold">Har-Customer</h1>
      </header>
      <main className="p-4 space-y-4 max-w-2xl">
        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama pelanggan" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="No. HP" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm">Tambah Pelanggan</button>
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-medium">Daftar Pelanggan</div>
          {loading ? <div className="p-4 text-sm text-slate-400">Memuat...</div> : customers.length === 0 ? <div className="p-4 text-sm text-slate-400">Belum ada</div> : (
            <div className="divide-y">
              {customers.map(c => (
                <div key={c.id} className="px-4 py-3">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.phone || '-'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
