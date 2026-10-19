import { useState, useEffect } from 'react'
import { getSupabase, setSupabaseClient, resetToDefault, getCurrentConfig } from '../lib/supabase'

// Demo business ID - nanti diganti dengan ID bisnis user yang login
const DEMO_BUSINESS_ID = '00000000-0000-0000-0000-000000000001'

export default function DatabaseSettings() {
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const config = getCurrentConfig()

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    setLoading(true)
    const supabase = getSupabase()
    const { data } = await supabase
      .from('businesses')
      .select('supabase_url, supabase_anon_key, is_dedicated')
      .eq('id', DEMO_BUSINESS_ID)
      .single()

    if (data?.supabase_url && data?.supabase_anon_key) {
      setUrl(data.supabase_url)
      setKey(data.supabase_anon_key)
      setSupabaseClient(data.supabase_url, data.supabase_anon_key)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!url || !key) {
      setStatus('URL dan Anon Key harus diisi')
      return
    }
    setLoading(true)
    const supabase = getSupabase()

    const { error } = await supabase
      .from('businesses')
      .upsert({
        id: DEMO_BUSINESS_ID,
        name: 'Demo Business',
        supabase_url: url,
        supabase_anon_key: key,
        is_dedicated: true,
      })

    if (error) {
      setStatus('Gagal menyimpan: ' + error.message)
    } else {
      setSupabaseClient(url, key)
      setStatus('Berhasil disimpan dan diarahkan ke database dedicated')
    }
    setLoading(false)
  }

  async function handleReset() {
    setLoading(true)
    const supabase = getSupabase()
    await supabase
      .from('businesses')
      .update({ supabase_url: null, supabase_anon_key: null, is_dedicated: false })
      .eq('id', DEMO_BUSINESS_ID)

    resetToDefault()
    setUrl('')
    setKey('')
    setStatus('Kembali ke database utama')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Pengaturan Database</h1>
        <p className="text-sm text-slate-500">Arahkan bisnis ini ke Supabase dedicated</p>
      </header>

      <div className="bg-white rounded-2xl border p-4 mb-4 shadow-sm">
        <div className="text-sm text-slate-500">Status Saat Ini</div>
        <div className="font-medium mt-1">
          {config.isDefault ? 'Database Utama' : 'Database Dedicated'}
        </div>
        <div className="text-xs text-slate-400 mt-1 truncate">{config.url}</div>
      </div>

      <div className="bg-white rounded-2xl border p-4 space-y-4 shadow-sm">
        <div>
          <label className="text-sm font-medium text-slate-700">Supabase URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://xxxxx.supabase.co"
            className="w-full mt-1 px-3 py-2.5 border rounded-xl text-sm"
            disabled={loading}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Anon Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            className="w-full mt-1 px-3 py-2.5 border rounded-xl text-sm"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium active:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan & Ganti Database'}
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-3 rounded-xl border font-medium active:bg-slate-50 disabled:opacity-50"
        >
          Kembali ke Database Utama
        </button>

        {status && (
          <div className="text-sm text-center text-green-600 font-medium pt-2">{status}</div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        Konfigurasi disimpan di tabel businesses. Nanti hanya Owner yang bisa mengubah.
      </p>
    </div>
  )
}
