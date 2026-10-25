import { ArrowLeft, BarChart3, Bell } from 'lucide-react'

interface Props { onBack: () => void }

export default function ReportDashboard({ onBack }: Props) {
  const reports = [
    { title: 'Penjualan Hari Ini', value: 'Rp 4,85 Jt', sub: '↑ 12% vs kemarin' },
    { title: 'Penjualan Bulan Ini', value: 'Rp 128,75 Jt', sub: '76% dari target' },
    { title: 'Transaksi', value: '342', sub: 'Rata-rata Rp 376rb' },
    { title: 'Produk Terlaris', value: 'Brosu Latte', sub: '128 terjual' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <header className="relative px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="font-semibold text-[15px]">Har-Report</div>
              <div className="text-[11px] text-blue-200/80">Laporan & Analitik</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-5 pb-7">
          <h1 className="text-lg font-semibold">Laporan Usaha</h1>
          <p className="text-blue-100/80 text-[13px] mt-1">Ringkasan penjualan dan performa bisnis.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {reports.map(r => (
            <div key={r.title} className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-white/60">
              <div className="text-[10px] font-medium text-slate-500 tracking-wide mb-1">{r.title.toUpperCase()}</div>
              <div className="text-lg font-semibold text-slate-900 tracking-tight">{r.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{r.sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] p-6 border border-slate-100 text-center">
          <BarChart3 className="mx-auto text-slate-300 mb-3" size={40} />
          <div className="text-sm font-medium text-slate-700">Laporan detail akan tersedia setelah data transaksi terkumpul.</div>
          <div className="text-xs text-slate-500 mt-1">Fitur export dan grafik akan ditambahkan di update berikutnya.</div>
        </div>
      </div>
    </div>
  )
}
