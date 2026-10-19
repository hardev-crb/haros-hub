interface Props {
  onBack?: () => void
}

const staff = [
  { name: 'Budi Santoso', role: 'Kasir', status: 'Aktif' },
  { name: 'Siti Aminah', role: 'Gudang', status: 'Aktif' },
  { name: 'Andi Wijaya', role: 'Sales', status: 'Cuti' },
]

export default function StaffDashboard({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        {onBack && <button onClick={onBack} className="text-xl">←</button>}
        <div>
          <h1 className="text-xl font-bold">Har-Staff</h1>
          <p className="text-sm text-slate-500">Manajemen Karyawan</p>
        </div>
      </header>
      <main className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b font-semibold text-sm">Daftar Karyawan</div>
          <div className="divide-y">
            {staff.map(s => (
              <div key={s.name} className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {s.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.role}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button className="w-full mt-4 py-3 rounded-2xl border font-medium active:bg-slate-50">
          + Tambah Karyawan
        </button>
      </main>
    </div>
  )
}
