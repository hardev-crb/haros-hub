import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { ShoppingCart, Plus, ArrowLeft, TrendingUp, Receipt, Bell } from 'lucide-react'

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
    <div className="min-h-screen bg-slate-100 pb-6">
      {/* Dark Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>}
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingCart size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-POS</div>
              <div className="text-xs text-blue-200">Kasir & Transaksi</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">Dashboard Kasir</h1>
          <p className="text-blue-100 text-sm mt-0.5">Kelola transaksi dan pantau omzet hari ini.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-4xl mx-auto">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-blue-200 mb-1"><TrendingUp size={12} /> OMZET HARI INI</div>
            <div className="text-base font-bold">Rp {todayTotal.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-blue-200 mb-1"><Receipt size={12} /> TRANSAKSI</div>
            <div className="text-base font-bold">{todayTx.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10 col-span-2 md:col-span-1">
            <div className="text-[10px] text-blue-200 mb-1">TOTAL OMZET</div>
            <div className="text-base font-bold">Rp {total.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Quick Module Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
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
            <button key={m.page} onClick={() => onNavigate?.(m.page)} className="bg-white rounded-xl p-2.5 text-center text-xs shadow-sm border border-slate-100 active:scale-95 transition">
              <div className="text-lg mb-0.5">{m.icon}</div>
              <div className="font-medium text-slate-700">{m.label}</div>
            </button>
          ))}
        </div>

        <button onClick={onNewTx} className="w-full bg-blue-600 text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition">
          <Plus size={18} /> Transaksi Baru
        </button>

        {error && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                <div key={tx.id} className="px-4 py-3.5 flex justify-between items-center">
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
      </div>
    </div>
  )
}
