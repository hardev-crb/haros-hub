import { useState } from 'react'

interface Props { onBack: () => void }

const suggestions = [
  'Produk apa yang paling laris minggu ini?',
  'Bagaimana cara meningkatkan penjualan?',
  'Buat ringkasan keuangan bulan ini',
  'Rekomendasi stok yang perlu diisi ulang',
]

export default function AIDashboard({ onBack }: Props) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: 'Halo! Saya Har-AI. Tanya apa saja tentang usaha Anda.' },
  ])
  const [input, setInput] = useState('')

  function send(text?: string) {
    const q = text || input
    if (!q) return
    setMessages(prev => [...prev, { role: 'user', text: q }, { role: 'ai', text: 'Fitur AI sedang dalam pengembangan. Nanti akan terhubung dengan model AI untuk memberikan insight otomatis berdasarkan data usaha Anda.' }])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56 flex flex-col">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={onBack}>←</button>
        <h1 className="text-lg font-semibold">Har-AI</h1>
      </header>
      <main className="flex-1 p-4 space-y-3 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-white border'}`}>
            {m.text}
          </div>
        ))}
        <div className="flex flex-wrap gap-2 pt-2">
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} className="text-xs bg-white border px-3 py-1.5 rounded-full text-slate-600">{s}</button>
          ))}
        </div>
      </main>
      <div className="p-4 border-t bg-white flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Tanya sesuatu..." className="flex-1 border rounded-xl px-3 py-2 text-sm" />
        <button onClick={() => send()} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">Kirim</button>
      </div>
    </div>
  )
}
