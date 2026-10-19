import type { Page } from '../App'

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
  const ownerName = localStorage.getItem('haros_owner_name') || 'Owner'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:ml-56 text-white">
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logos/haros-hub-logo.jpg" alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/20" />
          <div>
            <div className="font-semibold text-sm">{businessName}</div>
            <div className="text-xs text-slate-400">{ownerName}</div>
          </div>
        </div>
        <div className="text-xs bg-white/10 px-3 py-1 rounded-full">HarOS Hub</div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full opacity-50" />
          <h1 className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent">
            Selamat datang di HarOS Hub
          </h1>
          <p className="relative text-slate-400 mt-2 text-sm md:text-base">
            Pusat kendali operasional usaha Anda — modern, terintegrasi, dan siap berkembang.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Transaksi Hari Ini', value: '—', icon: '🛒' },
            { label: 'Stok Kritis', value: '—', icon: '📦' },
            { label: 'Pendapatan', value: '—', icon: '💰' },
            { label: 'Tugas Aktif', value: '—', icon: '⏰' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className="text-lg font-semibold mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-medium text-slate-300 mb-3">Modul Aplikasi</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {modules.map((m) => (
            <button
              key={m.name}
              onClick={() => onNavigate(m.page)}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl mb-3 shadow-lg`}>
                  {m.icon}
                </div>
                <div className="font-semibold text-sm text-white">{m.name}</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-tight">{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
