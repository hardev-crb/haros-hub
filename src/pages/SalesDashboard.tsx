import { useState } from 'react'
import { Bell, FileText, BarChart3, AlertTriangle, CheckCircle, Clock, Package, Plus, ArrowLeft } from 'lucide-react'

interface Props {
  onBack?: () => void
}

interface Sale {
  id: string
  type: 'SO' | 'INV'
  customer: string
  date: string
  amount: number
  status: 'Disetujui' | 'Lunas' | 'Menunggu' | 'Tertunda'
}

const initialSales: Sale[] = [
  { id: 'SO-2024-0512', type: 'SO', customer: 'PT Maju Bersama', date: '12 Mei 2024 · 10:30', amount: 24800000, status: 'Disetujui' },
  { id: 'INV-2024-0508', type: 'INV', customer: 'CV Sumber Rezeki', date: '10 Mei 2024 · 14:45', amount: 15600000, status: 'Lunas' },
  { id: 'SO-2024-0503', type: 'SO', customer: 'PT Prima Solusi', date: '9 Mei 2024 · 09:15', amount: 18900000, status: 'Menunggu' },
  { id: 'INV-2024-0497', type: 'INV', customer: 'UD Sejahtera Abadi', date: '8 Mei 2024 · 16:20', amount: 9750000, status: 'Tertunda' },
]

const statusStyle: Record<string, string> = {
  Disetujui: 'bg-blue-100 text-blue-700',
  Lunas: 'bg-emerald-100 text-emerald-700',
  Menunggu: 'bg-violet-100 text-violet-700',
  Tertunda: 'bg-orange-100 text-orange-700',
}

const statusIcon: Record<string, any> = {
  Disetujui: FileText,
  Lunas: CheckCircle,
  Menunggu: Clock,
  Tertunda: Package,
}

export default function SalesDashboard({ onBack }: Props) {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [showForm, setShowForm] = useState(false)
  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState('')

  const totalMonth = 128750000
  const target = 126800000
  const achieved = 96250000
  const percent = Math.round((achieved / target) * 100)
  const receivables = 32450000
  const overdueCount = 12

  function createOffer() {
    if (!customer.trim() || !amount) return
    const newSale: Sale = {
      id: `SO-2024-${String(sales.length + 1).padStart(4, '0')}`,
      type: 'SO',
      customer: customer.trim(),
      date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: Number(amount),
      status: 'Menunggu',
    }
    setSales(prev => [newSale, ...prev])
    setCustomer('')
    setAmount('')
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      {/* Header matching the image */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">H</span>
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">HarOS Hub</div>
              <div className="text-xs text-blue-200">Sales Dashboard</div>
            </div>
          </div>
          <button className="relative p-1">
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <div className="relative px-4 pb-8">
          <h1 className="text-xl font-bold">Selamat pagi, Andika 👋</h1>
          <p className="text-blue-100 text-sm mt-1">Kelola penjualan dan pantau performa bisnis Anda.</p>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10 max-w-lg mx-auto">
        {/* 3 Metric Cards - solid for readability but matching layout */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {/* Total Penjualan */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500 mb-1">
              <FileText size={11} /> TOTAL PENJUALAN BULAN INI
            </div>
            <div className="text-base font-bold text-slate-900">Rp 128,75 Jt</div>
            <div className="text-[9px] text-emerald-600 mt-0.5">↑ 18,6% vs bulan lalu</div>
            <div className="h-5 mt-1.5 flex items-end gap-0.5">
              {[30, 45, 35, 55, 40, 70, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-400 rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="text-[9px] font-medium text-slate-500 mb-1">TARGET BULAN INI</div>
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${percent}, 100`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-900">{percent}%</span>
                <span className="text-[7px] text-slate-500">Tercapai</span>
              </div>
            </div>
            <div className="text-[8px] text-slate-500 mt-1 text-center">Rp 96,25 Jt / Rp 126,80 Jt</div>
          </div>

          {/* Piutang */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500 mb-1">
              <AlertTriangle size={11} /> PIUTANG JATUH TEMPO
            </div>
            <div className="text-base font-bold text-slate-900">Rp 32,45 Jt</div>
            <div className="flex items-center gap-1 text-[9px] text-orange-600 mt-0.5">
              <AlertTriangle size={9} /> {overdueCount} Invoice
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">Segera ditagih</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Buat Penawaran</div>
              <div className="text-[10px] text-blue-100">Buat penawaran baru untuk prospek atau pelanggan.</div>
            </div>
          </button>
          <button className="bg-blue-600 text-white rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Lihat Laporan</div>
              <div className="text-[10px] text-blue-100">Analisis penjualan dan insight bisnis Anda.</div>
            </div>
          </button>
        </div>

        {/* Form Buat Penawaran */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-slate-100 space-y-3">
            <div className="text-sm font-semibold text-slate-800">Buat Penawaran Baru</div>
            <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Nama pelanggan / perusahaan" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Nilai penawaran (Rp)" type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm">Batal</button>
              <button onClick={createOffer} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium">Simpan</button>
            </div>
          </div>
        )}

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <h2 className="font-semibold text-slate-800">Penjualan Terakhir</h2>
            <button className="text-blue-600 text-sm flex items-center gap-1">Lihat Semua <span>›</span></button>
          </div>
          <div className="divide-y">
            {sales.map((sale) => {
              const Icon = statusIcon[sale.status] || FileText
              return (
                <div key={sale.id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusStyle[sale.status]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{sale.type === 'SO' ? 'Penawaran' : 'Invoice'} #{sale.id}</div>
                    <div className="text-xs text-slate-500">{sale.customer}</div>
                    <div className="text-[10px] text-slate-400">{sale.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">Rp {(sale.amount / 1_000_000).toFixed(2).replace('.', ',')} Jt</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[sale.status]}`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
