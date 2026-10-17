import { useState } from 'react'

interface Props { onBack: () => void }

export default function DeadlineDashboard({ onBack }: Props) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Bayar listrik', due: '2026-10-20', done: false },
    { id: 2, title: 'Follow up klien A', due: '2026-10-18', done: false },
  ])
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  function add() {
    if (!title || !due) return
    setTasks(prev => [...prev, { id: Date.now(), title, due, done: false }])
    setTitle(''); setDue('')
  }

  function toggle(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={onBack}>←</button>
        <h1 className="text-lg font-semibold">Har-Tenggat</h1>
      </header>
      <main className="p-4 space-y-4 max-w-2xl">
        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul tugas" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm">Tambah</button>
        </div>
        <div className="bg-white rounded-2xl border divide-y">
          {tasks.map(t => (
            <div key={t.id} className="px-4 py-3 flex items-center gap-3">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <div className={t.done ? 'line-through text-slate-400' : ''}>
                <div className="text-sm">{t.title}</div>
                <div className="text-xs text-slate-400">{t.due}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
