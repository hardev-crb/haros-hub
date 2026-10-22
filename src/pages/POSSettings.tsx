import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'

interface Props { onBack: () => void }

export default function POSSettings({ onBack }: Props) {
  const [tax, setTax] = useState(0)
  const [service, setService] = useState(0)
  const [packing, setPacking] = useState(0)
  const [id, setId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await getSupabase().from('pos_settings').select('*').limit(1).maybeSingle()
    if (data) { setTax(data.tax_percent || 0); setService(data.service_percent || 0); setPacking(data.default_packing_fee || 0); setId(data.id) }
  }
  async function save() {
    setSaving(true)
    const sb = getSupabase()
    if (id) await sb.from('pos_settings').update({ tax_percent: tax, service_percent: service, default_packing_fee: packing }).eq('id', id)
    else await sb.from('pos_settings').insert({ tax_percent: tax, service_percent: service, default_packing_fee: packing })
    setSaving(false); alert('Tersimpan'); load()
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={onBack}><ArrowLeft size={20} /></button><span className="font-semibold">Pengaturan POS</span></header>
      <main className="p-4 max-w-lg">
        <div className="bg-white rounded-2xl border p-4 space-y-3">
          <div><label className="text-xs text-slate-500">Pajak (%)</label><input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-slate-500">Service Charge (%)</label><input type="number" value={service} onChange={e => setService(Number(e.target.value))} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-slate-500">Biaya Packing (Rp)</label><input type="number" value={packing} onChange={e => setPacking(Number(e.target.value))} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></div>
          <button onClick={save} disabled={saving} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm flex items-center justify-center gap-1"><Save size={16} /> Simpan</button>
        </div>
      </main>
    </div>
  )
}
