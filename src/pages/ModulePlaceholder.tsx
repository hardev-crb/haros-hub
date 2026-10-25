import { ArrowLeft, Bell } from 'lucide-react'

interface Props {
  onBack: () => void
  title: string
  desc: string
  icon: string
}

export default function ModulePlaceholder({ onBack, title, desc, icon }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              {icon}
            </div>
            <div>
              <div className="font-bold text-base">{title}</div>
              <div className="text-xs text-blue-200">HarOS Hub</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-blue-100 text-sm mt-0.5">{desc}</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">{icon}</div>
          <h2 className="font-semibold text-slate-900 mb-1">Segera Hadir</h2>
          <p className="text-sm text-slate-500">Modul ini sedang dalam pengembangan dan akan tersedia di update berikutnya.</p>
        </div>
      </div>
    </div>
  )
}
