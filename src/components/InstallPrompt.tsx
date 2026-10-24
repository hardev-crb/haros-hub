import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    if (window.matchMedia('(display-mode: standalone)').matches) setShow(false)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function install() {
    if (!deferred) return
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferred(null)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><Download size={18} /></div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Install HarOS Hub</div>
          <div className="text-xs text-slate-400">Tambah ke home screen</div>
        </div>
        <button onClick={install} className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs font-medium">Install</button>
        <button onClick={() => setShow(false)} className="text-slate-400"><X size={16} /></button>
      </div>
    </div>
  )
}
