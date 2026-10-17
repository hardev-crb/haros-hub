import { useState } from 'react'

interface Props { onBack: () => void }

export default function RentalDashboard({ onBack }: Props) {
  const [items, setItems] = useState([
    { id: 1, name: 'Kamera Canon EOS', renter: 'Andi', due: '2026-10-25', status: 'Aktif' },
    { id: 2, name: 'Proyektor Epson', renter: 'Siti', due: '2026-10-20', status: 'Mendekati Tenggat' },
  ])
  const [name, setName] = useState('')
  const [renter, setRenter] = useState('')
  const [due, setDue] = useState('')

  function add() {
    if (!name || !renter || !due) return
    setItems(prev => [...prev, { id: Date.now(), name, renter, due, status: 'Aktif' }])
    setName(''); setRenter(''); setDue('')
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={onBack}>←</button>
        <h1 className="text-lg font-semibold">Har-Sewa</h1>
      </header>
      <main className="p-4 space-y-4 max-w-2xl">
        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama barang" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input value={renter} onChange={e => setRenter(e.target.value)} placeholder="Penyewa" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm">Tambah Sewa</button>
        </div>
        <div className="bg-white rounded-2xl border divide-y">
          {items.map(i => (
            <div key={i.id} className="px-4 py-3 flex justify-between">
              <div>
                <div className="text-sm font-medium">{i.name}</div>
                <div className="text-xs text-slate-400">{i.renter} · Jatuh tempo: {i.due}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${i.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{i.status}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
