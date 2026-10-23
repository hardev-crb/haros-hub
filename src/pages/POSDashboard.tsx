import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { ShoppingCart, Plus, ArrowLeft, TrendingUp, Receipt } from 'lucide-react'

interface Props {
  onBack?: () => void
  onNewTx?: () => void
  onNavigate?: (page: string) => void
}

export default function POSDashboard({ onBack, onNewTx, onNavigate }: Props) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data, error: err } = await getSupabase().from('transactions').select('*').order('created_at', { ascending: false }).limit(20)
      if (err) throw err
      if (data) setTransactions(data)
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  const total = transactions.reduce((s, t) => s + Number(t.total || 0), 0)
  const today = new Date().toDateString()
  const todayTx = transactions.filter(t => new Date(t.created_at).toDateString() === today)
  const todayTotal = todayTx.reduce((s, t) => s + Number(t.total || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 md:ml-56">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 md:px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {onBack && <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 md:hidden"><ArrowLeft size={20} /></button>}
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Har-POS</h1>
              <p className="text-xs text-slate-500">Kasir & Transaksi Penjualan</p>
            </div>
          </div>
          <button onClick={onNewTx} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow active:scale-95 transition flex items-center gap-1.5">
            <Plus size={16} /> Baru
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><TrendingUp size={14} className="text-blue-500" /> Omzet Hari Ini</div>
            <div className="text-xl font-bold text-slate-900">Rp {todayTotal.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><Receipt size={14} className="text-emerald-500" /> Transaksi Hari Ini</div>
            <div className="text-xl font-bold text-slate-900">{todayTx.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
            <div className="text-xs text-slate-500 mb-1">Total Omzet (terakhir)</div>
            <div className="text-xl font-bold text-slate-900">Rp {total.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { label: 'Meja', page: 'tables', icon: '🪑' },
            { label: 'Promo', page: 'promos', icon: '🎁' },
            { label: 'Topping', page: 'toppings', icon: '🧋' },
            { label: 'Shift', page: 'shift', icon: '⏱️' },
            { label: 'Reservasi', page: 'reservation', icon: '📅' },
            { label: 'Riwayat', page: 'tx-history', icon: '📋' },
            { label: 'Laporan', page: 'shift-report', icon: '📊' },
            { label: 'Setting', page: 'pos-settings', icon: '⚙️' },
          ].map(m => (
            <button key={m.page} onClick={() => onNavigate?.(m.page)} className="bg-white border rounded-xl p-3 text-center text-xs hover:bg-slate-50">
              <div className="text-lg">{m.icon}</div>
              <div className="mt-1 font-medium">{m.label}</div>
            </button>
          ))}
        </div>

        {error && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Receipt size={16} className="text-blue-500" /> Riwayat Transaksi
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Memuat...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-400 text-sm mb-2">Belum ada transaksi</div>
              <button onClick={onNewTx} className="text-blue-600 text-sm font-medium">Buat transaksi pertama</button>
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map(tx => (
                <div key={tx.id} className="px-5 py-3.5 flex justify-between items-center hover:bg-slate-50 transition">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{tx.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleString('id-ID')}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">Rp {Number(tx.total).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
