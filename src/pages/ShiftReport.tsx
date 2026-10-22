import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft } from 'lucide-react'

interface Props { onBack: () => void }
interface Shift { id: string; opened_at: string; closed_at?: string; opening_cash: number; closing_cash?: number; expected_cash?: number; status: string }

export default function ShiftReport({ onBack }: Props) {
  const [shifts, setShifts] = useState<Shift[]>([])

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await getSupabase().from('shifts').select('*').eq('status', 'closed').order('closed_at', { ascending: false }).limit(30)
    if (data) setShifts(data)
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={onBack}><ArrowLeft size={20} /></button><span className="font-semibold">Laporan Shift</span></header>
      <main className="p-4 max-w-lg">
        {shifts.length === 0 && <div className="text-sm text-slate-400 p-4">Belum ada shift yang ditutup</div>}
        {shifts.map(s => {
          const diff = Number(s.closing_cash || 0) - Number(s.expected_cash || 0)
          return (
            <div key={s.id} className="bg-white rounded-xl border px-4 py-3 mb-2 text-sm">
              <div className="font-medium">{new Date(s.opened_at).toLocaleDateString('id-ID')}</div>
              <div className="text-xs text-slate-500 mt-1">
                Kas awal: Rp {Number(s.opening_cash).toLocaleString('id-ID')}<br/>
                Expected: Rp {Number(s.expected_cash || 0).toLocaleString('id-ID')}<br/>
                Closing: Rp {Number(s.closing_cash || 0).toLocaleString('id-ID')}
              </div>
              <div className={`text-xs mt-1 font-medium ${diff === 0 ? 'text-emerald-600' : diff > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                Selisih: Rp {diff.toLocaleString('id-ID')}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
