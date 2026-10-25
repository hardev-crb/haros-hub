import type { Page } from '../App'
import { Bell, TrendingUp, Package, Wallet, Clock } from 'lucide-react'

interface Props {
  onNavigate: (page: Page) => void
}

const modules = [
  { name: 'Har-POS', desc: 'Kasir & Transaksi', page: 'pos' as Page, icon: '🛒', gradient: 'from-blue-500 to-cyan-400' },
  { name: 'Har-Inventory', desc: 'Stok & Inventori', page: 'gudang' as Page, icon: '📦', gradient: 'from-emerald-500 to-teal-400' },
  { name: 'Har-Sale', desc: 'Target & Penjualan', page: 'sales' as Page, icon: '📈', gradient: 'from-violet-500 to-purple-400' },
  { name: 'Har-Staff', desc: 'Karyawan & Tim', page: 'staff' as Page, icon: '👥', gradient: 'from-amber-500 to-orange-400' },
  { name: 'Har-Finance', desc: 'Keuangan & Kas', page: 'finance' as Page, icon: '💰', gradient: 'from-green-500 to-emerald-400' },
  { name: 'Har-Customer', desc: 'Pelanggan & CRM', page: 'customer' as Page, icon: '🤝', gradient: 'from-sky-500 to-blue-400' },
  { name: 'Har-Purchase', desc: 'Pembelian Supplier', page: 'purchase' as Page, icon: '🚚', gradient: 'from-indigo-500 to-blue-400' },
  { name: 'Har-Sewa', desc: 'Monitoring Sewa', page: 'rental' as Page, icon: '🔑', gradient: 'from-rose-500 to-pink-400' },
  { name: 'Har-Tenggat', desc: 'Deadline & Jadwal', page: 'deadline' as Page, icon: '⏰', gradient: 'from-red-500 to-orange-400' },
  { name: 'Har-Promo', desc: 'Diskon & Promo', page: 'promo' as Page, icon: '🎁', gradient: 'from-fuchsia-500 to-pink-400' },
  { name: 'Har-Report', desc: 'Laporan & Analitik', page: 'report' as Page, icon: '📊', gradient: 'from-cyan-500 to-blue-400' },
  { name: 'Har-AI', desc: 'Asisten AI Cerdas', page: 'ai' as Page, icon: '🤖', gradient: 'from-purple-600 to-indigo-500' },
  { name: 'Har-Setting', desc: 'Pengaturan Usaha', page: 'db-settings' as Page, icon: '⚙️', gradient: 'from-slate-500 to-slate-400' },
]

export default function Launcher({ onNavigate }: Props) {
  const businessName = localStorage.getItem('haros_business_name') || 'HarOS Hub'
  const ownerName = localStorage.getItem('haros_owner_name') || 'Andika'

  return (
    <div className="min-h-screen bg-slate-100 pb-6 md:ml-56">
      {/* Dark Blue Gradient Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/4" />
        <header className="relative px-4 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logos/haros-hub-logo.jpg" alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/30" />
            <div>
              <div className="font-bold text-lg leading-tight">{businessName}</div>
              <div className="text-xs text-blue-200">HarOS Hub</div>
            </div>
          </div>
          <button className="relative p-1">
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <div className="relative px-4 pb-6">
          <h1 className="text-xl font-bold">Selamat pagi, {ownerName} 👋</h1>
          <p className="text-blue-100 text-sm mt-1">Pantau performa bisnis dan kelola operasional usaha Anda.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-6xl mx-auto">
        {/* Metric Cards - solid white for readability */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <TrendingUp size={12} className="text-blue-500" /> TRANSAKSI HARI INI
            </div>
            <div className="text-lg font-bold text-slate-900">Rp 4,85 Jt</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">↑ 12% vs kemarin</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Package size={12} className="text-orange-500" /> STOK KRITIS
            </div>
            <div className="text-lg font-bold text-slate-900">7 Item</div>
            <div className="text-[10px] text-orange-600 mt-0.5">Perlu restock</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Wallet size={12} className="text-blue-500" /> SALDO KAS
            </div>
            <div className="text-lg font-bold text-slate-900">Rp 18,2 Jt</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Tersedia</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Clock size={12} className="text-amber-500" /> TUGAS AKTIF
            </div>
            <div className="text-lg font-bold text-slate-900">5</div>
            <div className="text-[10px] text-amber-600 mt-0.5">Menunggu</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => onNavigate('pos')} className="bg-blue-600 text-white rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition shadow-sm">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🛒</div>
            <div className="text-left">
              <div className="font-semibold text-sm">Kasir Baru</div>
              <div className="text-[10px] text-blue-100">Buat transaksi penjualan</div>
            </div>
          </button>
          <button onClick={() => onNavigate('sales')} className="bg-blue-600 text-white rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition shadow-sm">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">📈</div>
            <div className="text-left">
              <div className="font-semibold text-sm">Lihat Penjualan</div>
              <div className="text-[10px] text-blue-100">Target & performa</div>
            </div>
          </button>
        </div>

        {/* Modules */}
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Semua Modul</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {modules.map((m) => (
            <button
              key={m.name}
              onClick={() => onNavigate(m.page)}
              className="bg-white rounded-2xl p-3.5 text-left shadow-sm border border-slate-100 hover:shadow-md active:scale-[0.98] transition"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-lg mb-2`}>
                {m.icon}
              </div>
              <div className="font-semibold text-xs text-slate-900 leading-tight">{m.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
