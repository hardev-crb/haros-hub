import { useState } from 'react'
import { ArrowLeft, Truck, Plus, Bell } from 'lucide-react'

interface Props { onBack: () => void }

interface Purchase {
  id: string
  supplier: string
  item: string
  amount: number
  date: string
  status: string
}

export default function PurchaseDashboard({ onBack }: Props) {
  const [items, setItems] = useState<Purchase[]>([
    { id: '1', supplier: 'PT Sumber Jaya', item: 'Bahan baku kopi', amount: 2500000, date: '2026-10-20', status: 'Diterima' },
    { id: '2', supplier: 'CV Maju Bersama', item: 'Kemasan', amount: 850000, date: '2026-10-22', status: 'Menunggu' },
  ])
  const [supplier, setSupplier] = useState('')
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')

  function add() {
    if (!supplier.trim() || !item.trim()) return
    setItems(prev => [{
      id: Date.now().toString(),
      supplier: supplier.trim(),
      item: item.trim(),
      amount: Number(amount) || 0,
      date: new Date().toISOString().slice(0, 10),
      status: 'Menunggu'
    }, ...prev])
    setSupplier(''); setItem(''); setAmount('')
  }

  const total = items.reduce((s, i) => s + i.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <header className="relative px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <div className="font-semibold text-[15px]">Har-Purchase</div>
              <div className="text-[11px] text-blue-200/80">Pembelian Supplier</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-5 pb-7">
          <h1 className="text-lg font-semibold">Manajemen Pembelian</h1>
          <p className="text-blue-100/80 text-[13px] mt-1">Catat pembelian dari supplier dan stok masuk.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="text-[10px] font-medium text-slate-500 tracking-wide mb-1">TOTAL PEMBELIAN</div>
            <div className="text-lg font-semibold text-slate-900">Rp {total.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="text-[10px] font-medium text-slate-500 tracking-wide mb-1">ITEM</div>
            <div className="text-lg font-semibold text-slate-900">{items.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] p-4 space-y-3 mb-4 border border-slate-100">
          <div className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Plus size={16} /> Catat Pembelian</div>
          <input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nama supplier" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <input value={item} onChange={e => setItem(e.target.value)} placeholder="Barang / bahan" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Total (Rp)" type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <button onClick={add} className="w-full py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium active:scale-[0.98] transition">Simpan</button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-800">Riwayat Pembelian</div>
          <div className="divide-y">
            {items.map(i => (
              <div key={i.id} className="px-4 py-3.5 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-slate-900">{i.item}</div>
                  <div className="text-xs text-slate-500">{i.supplier} · {i.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">Rp {i.amount.toLocaleString('id-ID')}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${i.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{i.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
