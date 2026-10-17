import { Bell, Home, Users, Plus, ShoppingCart, User, FileText, BarChart3, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react'

interface Props {
  onBack?: () => void
}

const recentSales = [
  { id: 'SO-2024-0512', customer: 'PT Maju Bersama', date: '12 Mei 2024 · 10:30', amount: 'Rp 24,80 Jt', status: 'Disetujui', color: 'bg-blue-100 text-blue-700', icon: ShoppingCart },
  { id: 'INV-2024-0508', customer: 'CV Sumber Rezeki', date: '10 Mei 2024 · 14:45', amount: 'Rp 15,60 Jt', status: 'Lunas', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { id: 'SO-2024-0503', customer: 'PT Prima Solusi', date: '9 Mei 2024 · 09:15', amount: 'Rp 18,90 Jt', status: 'Menunggu', color: 'bg-purple-100 text-purple-700', icon: FileText },
  { id: 'INV-2024-0497', customer: 'UD Sejahtera Abadi', date: '8 Mei 2024 · 16:20', amount: 'Rp 9,75 Jt', status: 'Tertunda', color: 'bg-orange-100 text-orange-700', icon: Package },
]

export default function SalesDashboard({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Dark Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">H</span>
            </div>
            <div>
              <div className="font-bold text-lg">HarOS Hub</div>
              <div className="text-xs text-blue-200">Har-Sale</div>
            </div>
          </div>
          <button className="relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <div className="relative px-4 pb-6">
          <h1 className="text-xl font-bold">Selamat pagi, Andika 👋</h1>
          <p className="text-blue-100 text-sm mt-1">Kelola penjualan dan pantau performa bisnis Anda.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10">
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-blue-200 mb-1">
              <FileText size={12} /> TOTAL PENJUALAN BULAN INI
            </div>
            <div className="text-lg font-bold">Rp 128,75 Jt</div>
            <div className="text-[10px] text-green-300 mt-1">↑ 18,6% vs bulan lalu</div>
            <div className="h-6 mt-2 flex items-end gap-0.5">
              {[30, 45, 35, 55, 40, 70, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-400/60 rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10 flex flex-col items-center">
            <div className="text-[10px] text-blue-200 mb-2">TARGET BULAN INI</div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="76, 100" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold">76%</span>
                <span className="text-[8px]">Tercapai</span>
              </div>
            </div>
            <div className="text-[10px] text-blue-200 mt-1">Rp 96,25 Jt / Rp 126,80 Jt</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-blue-200 mb-1">
              <AlertTriangle size={12} /> PIUTANG JATUH TEMPO
            </div>
            <div className="text-lg font-bold">Rp 32,45 Jt</div>
            <div className="flex items-center gap-1 text-[10px] text-orange-300 mt-1">
              <AlertTriangle size={10} /> 12 Invoice
            </div>
            <div className="text-[10px] text-blue-200 mt-1">Segera ditagih</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="bg-blue-600 text-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Buat Penawaran</div>
              <div className="text-[10px] text-blue-100">Buat penawaran baru untuk prospek atau pelanggan.</div>
            </div>
          </button>
          <button className="bg-blue-600 text-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Lihat Laporan</div>
              <div className="text-[10px] text-blue-100">Analisis penjualan dan insight bisnis Anda.</div>
            </div>
          </button>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <h2 className="font-semibold">Penjualan Terakhir</h2>
            <button className="text-blue-600 text-sm flex items-center gap-1">Lihat Semua <span>›</span></button>
          </div>
          <div className="divide-y">
            {recentSales.map((sale) => {
              const Icon = sale.icon
              return (
                <div key={sale.id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sale.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{sale.id.includes('SO') ? 'Penawaran' : 'Invoice'} #{sale.id}</div>
                    <div className="text-xs text-slate-500">{sale.customer}</div>
                    <div className="text-[10px] text-slate-400">{sale.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{sale.amount}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sale.color}`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around py-2 z-50">
        <button className="flex flex-col items-center text-blue-600 text-xs">
          <Home size={20} />
          <span>Beranda</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 text-xs">
          <Users size={20} />
          <span>Pelanggan</span>
        </button>
        <button className="w-12 h-12 -mt-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <Plus size={24} />
        </button>
        <button className="flex flex-col items-center text-slate-400 text-xs">
          <ShoppingCart size={20} />
          <span>Pesanan</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 text-xs">
          <User size={20} />
          <span>Akun</span>
        </button>
      </nav>
    </div>
  )
}
