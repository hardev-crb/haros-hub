import { useState } from 'react'
import { ArrowLeft, Bot, Bell, Send } from 'lucide-react'

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
    if (!q.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: q }, { role: 'ai', text: 'Fitur AI sedang dalam pengembangan. Nanti akan terhubung dengan model AI untuk memberikan insight otomatis berdasarkan data usaha Anda.' }])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-AI</div>
              <div className="text-xs text-blue-200">Asisten AI Cerdas</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-4">
          <h1 className="text-lg font-bold">Asisten AI</h1>
          <p className="text-blue-100 text-sm mt-0.5">Tanya insight bisnis berdasarkan data usaha Anda.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4">
        <div className="flex-1 space-y-3 overflow-auto pb-4">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-white border border-slate-100 shadow-sm'}`}>
              {m.text}
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:bg-slate-50">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Tanya sesuatu..."
            className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button onClick={() => send()} className="bg-blue-600 text-white rounded-2xl px-4 flex items-center justify-center active:scale-95 transition">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
