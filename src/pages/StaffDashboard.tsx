import { ArrowLeft, Users, Bell } from 'lucide-react'

interface Props { onBack?: () => void }

const staff = [
  { name: 'Budi Santoso', role: 'Kasir', status: 'Aktif' },
  { name: 'Siti Aminah', role: 'Gudang', status: 'Aktif' },
  { name: 'Andi Wijaya', role: 'Sales', status: 'Cuti' },
]

export default function StaffDashboard({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>}
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-Staff</div>
              <div className="text-xs text-blue-200">Karyawan & Tim</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">Manajemen Karyawan</h1>
          <p className="text-blue-100 text-sm mt-0.5">Kelola data tim dan status karyawan.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="text-[10px] text-slate-500 mb-1">TOTAL KARYAWAN</div>
            <div className="text-lg font-bold text-slate-900">{staff.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="text-[10px] text-slate-500 mb-1">AKTIF HARI INI</div>
            <div className="text-lg font-bold text-slate-900">{staff.filter(s => s.status === 'Aktif').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-slate-700">Daftar Karyawan</div>
          <div className="divide-y">
            {staff.map(s => (
              <div key={s.name} className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">{s.name.slice(0,1)}</div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.role}</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
