import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

interface Props {
  onBack?: () => void
  onNewTx?: () => void
}

export default function POSDashboard({ onBack, onNewTx }: Props) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await getSupabase().from('transactions').select('*').order('created_at', { ascending: false }).limit(10)
    if (data) setTransactions(data)
    setLoading(false)
  }

  const total = transactions.reduce((s, t) => s + Number(t.total || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600 md:hidden">←</button>}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Har-POS</h1>
            <p className="text-xs text-slate-400">Kelola transaksi penjualan</p>
          </div>
          <button onClick={onNewTx} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl">+ Transaksi Baru</button>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="text-xs text-slate-400">Total Omzet</div>
            <div className="text-xl font-bold mt-1">Rp {total.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="text-xs text-slate-400">Transaksi</div>
            <div className="text-xl font-bold mt-1">{transactions.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b text-sm font-medium">Riwayat Transaksi</div>
          {loading ? (
            <div className="p-5 text-sm text-slate-400">Memuat...</div>
          ) : transactions.length === 0 ? (
            <div className="p-5 text-sm text-slate-400">Belum ada transaksi</div>
          ) : (
            <div className="divide-y">
              {transactions.map(tx => (
                <div key={tx.id} className="px-5 py-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{tx.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleString('id-ID')}</div>
                  </div>
                  <div className="text-sm font-semibold">Rp {Number(tx.total).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onNewTx} className="w-full mt-4 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
          + Transaksi Baru
        </button>
      </main>
    </div>
  )
}