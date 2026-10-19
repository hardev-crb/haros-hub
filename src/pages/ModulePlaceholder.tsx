import type { Page } from '../App'

interface Props {
  onBack: () => void
  title: string
  desc: string
  icon: string
}

export default function ModulePlaceholder({ onBack, title, desc, icon }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 md:ml-56 p-4 md:p-6">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700">← Kembali</button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </header>
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center max-w-md mx-auto">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-slate-500 text-sm mb-6">{desc}</p>
        <p className="text-xs text-slate-400">Modul ini sedang dalam pengembangan. Fitur lengkap akan ditambahkan sesuai prioritas.</p>
      </div>
    </div>
  )
}
