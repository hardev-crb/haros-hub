import { useState } from 'react'
import { ArrowLeft, Key, Plus, Bell } from 'lucide-react'

interface Props { onBack: () => void }

interface Item { id: string; name: string; renter: string; due: string; status: string }

export default function RentalDashboard({ onBack }: Props) {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Ruko A', renter: 'Pak Budi', due: '2026-11-01', status: 'Aktif' },
    { id: '2', name: 'Mesin Cuci', renter: 'Bu Sari', due: '2026-10-30', status: 'Aktif' },
  ])
  const [name, setName] = useState('')
  const [renter, setRenter] = useState('')
  const [due, setDue] = useState('')

  function add() {
    if (!name.trim()) return
    setItems(prev => [{ id: Date.now().toString(), name: name.trim(), renter, due, status: 'Aktif' }, ...prev])
    setName(''); setRenter(''); setDue('')
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Key size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-Sewa</div>
              <div className="text-xs text-blue-200">Monitoring Sewa</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">Manajemen Sewa</h1>
          <p className="text-blue-100 text-sm mt-0.5">Pantau unit sewa dan jatuh tempo.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="text-[10px] text-slate-500 mb-1">TOTAL UNIT</div>
            <div className="text-lg font-bold text-slate-900">{items.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="text-[10px] text-slate-500 mb-1">AKTIF</div>
            <div className="text-lg font-bold text-slate-900">{items.filter(i => i.status === 'Aktif').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 mb-4">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus size={16} /> Tambah Sewa</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama unit / barang" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          <input value={renter} onChange={e => setRenter(e.target.value)} placeholder="Penyewa" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          <input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          <button onClick={add} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition">Tambah Sewa</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-700">Daftar Sewa</div>
          <div className="divide-y">
            {items.map(i => (
              <div key={i.id} className="px-4 py-3.5 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-slate-900">{i.name}</div>
                  <div className="text-xs text-slate-500">{i.renter} · Jatuh tempo: {i.due}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${i.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
