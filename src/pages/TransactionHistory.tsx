import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Eye, Ban } from 'lucide-react'

interface Props { onBack: () => void }
interface Tx { id: string; total: number; discount: number; items: any[]; status: string; created_at: string }

export default function TransactionHistory({ onBack }: Props) {
  const [list, setList] = useState<Tx[]>([])
  const [detail, setDetail] = useState<Tx | null>(null)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await getSupabase().from('transactions').select('*').order('created_at', { ascending: false }).limit(50)
    if (data) setList(data)
  }
  async function voidTx(id: string) {
    if (!confirm('Batalkan transaksi ini?')) return
    await getSupabase().from('transactions').update({ status: 'void' }).eq('id', id)
    load(); setDetail(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={onBack}><ArrowLeft size={20} /></button><span className="font-semibold">Riwayat Transaksi</span></header>
      <main className="p-4 max-w-lg">
        {list.map(t => (
          <div key={t.id} className="bg-white rounded-xl border px-4 py-3 mb-2 text-sm">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Rp {Number(t.total).toLocaleString('id-ID')}</div>
                <div className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString('id-ID')}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'void' ? 'bg-red-100 text-red-600' : 'bg-slate-100'}`}>{t.status}</span>
                <button onClick={() => setDetail(t)} className="text-blue-600"><Eye size={16} /></button>
                {t.status !== 'void' && <button onClick={() => voidTx(t.id)} className="text-red-500"><Ban size={16} /></button>}
              </div>
            </div>
          </div>
        ))}
        {detail && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4" onClick={() => setDetail(null)}>
            <div className="bg-white rounded-2xl w-full max-w-sm p-4" onClick={e => e.stopPropagation()}>
              <div className="font-semibold mb-2">Detail Transaksi</div>
              {(detail.items || []).map((it: any, i: number) => (
                <div key={i} className="text-sm flex justify-between py-1 border-b">
                  <span>{it.qty}x {it.name}</span>
                  <span>Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <div className="mt-2 text-sm font-bold flex justify-between"><span>Total</span><span>Rp {Number(detail.total).toLocaleString('id-ID')}</span></div>
              <button onClick={() => setDetail(null)} className="w-full mt-3 py-2 border rounded-xl text-sm">Tutup</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
