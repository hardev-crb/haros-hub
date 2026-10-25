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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8 md:ml-56">
      {/* Elegant Dark Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <header className="relative px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img src="/logos/haros-hub-logo.jpg" alt="" className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="font-semibold text-[17px] tracking-tight">{businessName}</div>
              <div className="text-[11px] text-blue-200/80 font-medium">HarOS Hub</div>
            </div>
          </div>
          <button className="relative p-2 rounded-xl hover:bg-white/10 transition">
            <Bell size={20} strokeWidth={1.75} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900" />
          </button>
        </header>

        <div className="relative px-5 pb-8">
          <h1 className="text-[22px] font-semibold tracking-tight">Selamat pagi, {ownerName}</h1>
          <p className="text-blue-100/80 text-[13px] mt-1.5 leading-relaxed">Pantau performa bisnis dan kelola operasional usaha Anda.</p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 max-w-6xl mx-auto">
        {/* Elegant Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 tracking-wide mb-2">
              <TrendingUp size={13} className="text-blue-500" strokeWidth={2} /> TRANSAKSI HARI INI
            </div>
            <div className="text-xl font-semibold text-slate-900 tracking-tight">Rp 4,85 Jt</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">↑ 12% vs kemarin</div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 tracking-wide mb-2">
              <Package size={13} className="text-orange-500" strokeWidth={2} /> STOK KRITIS
            </div>
            <div className="text-xl font-semibold text-slate-900 tracking-tight">7 Item</div>
            <div className="text-[11px] text-orange-600 font-medium mt-1">Perlu restock</div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 tracking-wide mb-2">
              <Wallet size={13} className="text-blue-500" strokeWidth={2} /> SALDO KAS
            </div>
            <div className="text-xl font-semibold text-slate-900 tracking-tight">Rp 18,2 Jt</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Tersedia</div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 tracking-wide mb-2">
              <Clock size={13} className="text-amber-500" strokeWidth={2} /> TUGAS AKTIF
            </div>
            <div className="text-xl font-semibold text-slate-900 tracking-tight">5</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Menunggu</div>
          </div>
        </div>

        {/* Quick Actions - more refined */}
        <div className="grid grid-cols-2 gap-3 mb-7">
          <button onClick={() => onNavigate('pos')} className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 flex items-center gap-3.5 active:scale-[0.98] transition shadow-lg shadow-blue-600/20">
            <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-xl">🛒</div>
            <div className="text-left">
              <div className="font-semibold text-sm tracking-tight">Kasir Baru</div>
              <div className="text-[11px] text-blue-100/90 mt-0.5">Buat transaksi penjualan</div>
            </div>
          </button>
          <button onClick={() => onNavigate('sales')} className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 flex items-center gap-3.5 active:scale-[0.98] transition shadow-lg shadow-blue-600/20">
            <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-xl">📈</div>
            <div className="text-left">
              <div className="font-semibold text-sm tracking-tight">Lihat Penjualan</div>
              <div className="text-[11px] text-blue-100/90 mt-0.5">Target & performa</div>
            </div>
          </button>
        </div>

        {/* Modules - elegant tiles */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Semua Modul</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {modules.map((m) => (
            <button
              key={m.name}
              onClick={() => onNavigate(m.page)}
              className="group bg-white rounded-2xl p-3.5 text-left shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] border border-slate-100/80 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] hover:border-slate-200 active:scale-[0.97] transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-lg mb-2.5 shadow-sm`}>
                {m.icon}
              </div>
              <div className="font-semibold text-[12px] text-slate-900 leading-tight tracking-tight">{m.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
