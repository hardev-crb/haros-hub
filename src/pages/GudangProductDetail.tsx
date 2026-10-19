import { ArrowLeft, Bell, Box, Tag, TrendingUp, MapPin, Filter, RefreshCw, ChevronRight, Pencil, SlidersHorizontal } from 'lucide-react'

interface Props {
  onBack?: () => void
}

const movements = [
  { type: 'Pembelian', ref: 'PO-2024-05-17-0012', date: '17 Mei 2024, 10:24', qty: '+50 unit', stock: 78, color: 'text-green-600', iconBg: 'bg-green-500' },
  { type: 'Penjualan', ref: 'INV-2024-05-16-0087', date: '16 Mei 2024, 14:35', qty: '-12 unit', stock: 28, color: 'text-red-500', iconBg: 'bg-blue-500' },
  { type: 'Penyesuaian Stok', ref: 'Penambahan stok opname', date: '15 Mei 2024, 09:15', qty: '+20 unit', stock: 40, color: 'text-green-600', iconBg: 'bg-green-500' },
  { type: 'Penjualan', ref: 'INV-2024-05-14-0063', date: '14 Mei 2024, 11:42', qty: '-8 unit', stock: 20, color: 'text-red-500', iconBg: 'bg-blue-500' },
  { type: 'Pembelian', ref: 'PO-2024-05-13-0008', date: '13 Mei 2024, 16:05', qty: '+30 unit', stock: 28, color: 'text-green-600', iconBg: 'bg-green-500' },
]

export default function GudangProductDetail({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><ArrowLeft size={22} /></button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Box size={14} />
          </div>
          <div className="text-sm font-medium">HarOS<br /><span className="text-xs text-blue-200">Hub Gudang</span></div>
        </div>
        <button className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* Product Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-4xl">
              🪖
            </div>
            <div className="flex-1">
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Barang & Material</span>
              <h1 className="font-bold text-lg mt-1">Safety Helmet ProGuard X2</h1>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                SKU: HELM-PG-X2-BIRU
                <button className="text-slate-400">📋</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Box size={14} className="text-blue-600" /> Stok Saat Ini
              </div>
              <div className="font-bold text-lg">128 <span className="text-sm font-normal">unit</span></div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Aman
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Tag size={14} className="text-blue-600" /> Harga Beli (HPP)
              </div>
              <div className="font-bold text-lg">Rp 78.500</div>
              <div className="text-xs text-slate-400">/unit</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrendingUp size={14} className="text-blue-600" /> Harga Jual
              </div>
              <div className="font-bold text-lg">Rp 105.000</div>
              <div className="text-xs text-slate-400">/unit</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={16} className="text-blue-600" />
              Lokasi <span className="font-medium">Rak B2 - Gudang Utama</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Stock History */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold">
              <RefreshCw size={16} className="text-blue-600" />
              Riwayat Pergerakan Stok
            </div>
            <button className="flex items-center gap-1 text-xs border rounded-full px-3 py-1 text-slate-600">
              <Filter size={12} /> Filter
            </button>
          </div>

          <div className="flex bg-slate-100 rounded-full p-1 mb-4 text-sm">
            <button className="flex-1 py-1.5 rounded-full bg-blue-600 text-white font-medium">Semua</button>
            <button className="flex-1 py-1.5 text-slate-600">Masuk</button>
            <button className="flex-1 py-1.5 text-slate-600">Keluar</button>
          </div>

          <div className="space-y-4">
            {movements.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${m.iconBg} flex items-center justify-center text-white text-xs mt-0.5`}>
                  {m.qty.startsWith('+') ? '↓' : '🛒'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{m.type}</div>
                  <div className="text-xs text-slate-400">{m.ref}</div>
                </div>
                <div className="text-right text-xs text-slate-400">{m.date}</div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${m.color}`}>{m.qty}</div>
                  <div className="text-xs text-slate-400">Stok: {m.stock}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-blue-600 text-sm flex items-center justify-center gap-1">
            Lihat lebih banyak riwayat <ChevronRight size={14} />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="border-2 border-slate-200 rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-medium">
            <Pencil size={16} /> Edit
          </button>
          <button className="bg-blue-600 text-white rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-medium">
            <SlidersHorizontal size={16} /> Sesuaikan Stok
          </button>
        </div>
      </main>
    </div>
  )
}
