import { useState, useEffect } from 'react'
import { getSupabase } from './lib/supabase'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Launcher from './pages/Launcher'
import POSDashboard from './pages/POSDashboard'
import POSTransaction from './pages/POSTransaction'
import GudangDashboard from './pages/GudangDashboard'
import GudangProductDetail from './pages/GudangProductDetail'
import SalesDashboard from './pages/SalesDashboard'
import StaffDashboard from './pages/StaffDashboard'
import DatabaseSettings from './pages/DatabaseSettings'
import FinanceDashboard from './pages/FinanceDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import RentalDashboard from './pages/RentalDashboard'
import DeadlineDashboard from './pages/DeadlineDashboard'
import ShiftDashboard from './pages/ShiftDashboard'
import TableManager from './pages/TableManager'
import PromoManager from './pages/PromoManager'
import ToppingManager from './pages/ToppingManager'
import ShiftReport from './pages/ShiftReport'
import ModulePlaceholder from './pages/ModulePlaceholder'

export type Page = 
  | 'login' | 'onboarding' | 'launcher' 
  | 'pos' | 'pos-tx' | 'shift' | 'reservation' | 'tables' | 'promos' | 'pos-settings' | 'toppings' | 'tx-history' | 'shift-report' 
  | 'gudang' | 'gudang-detail' 
  | 'sales' | 'staff' 
  | 'finance' | 'customer' | 'purchase' 
  | 'rental' | 'deadline' | 'promo' | 'report' | 'ai'
  | 'db-settings'

function App() {
  const [page, setPage] = useState<Page>('login')
  const [loading, setLoading] = useState(true)
  const navigate = (p: Page) => setPage(p)

  useEffect(() => {
    const supabase = getSupabase()
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const done = await isOnboardingDone(session.user.id)
        setPage(done ? 'launcher' : 'onboarding')
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('haros_onboarding_done')
        setPage('login')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function isOnboardingDone(userId: string): Promise<boolean> {
    // Fast cache first
    if (localStorage.getItem('haros_onboarding_done') === 'true') return true

    try {
      const supabase = getSupabase()
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, business_id')
        .eq('id', userId)
        .maybeSingle()

      if (profile && (profile.full_name || profile.business_id)) {
        localStorage.setItem('haros_onboarding_done', 'true')
        return true
      }
    } catch {
      // Table may not exist yet — fall back to localStorage
    }
    return false
  }

  async function checkAuth() {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const done = await isOnboardingDone(session.user.id)
      setPage(done ? 'launcher' : 'onboarding')
    } else {
      setPage('login')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <img src="/logos/haros-hub-logo.jpg" alt="HarOS Hub" className="w-16 h-16 rounded-2xl object-cover shadow-lg mb-4 ring-2 ring-white/20" />
        <p className="text-slate-400 text-sm">Memuat HarOS Hub...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {page === 'login' && <Login onLogin={async () => {
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const done = await isOnboardingDone(user.id)
          navigate(done ? 'launcher' : 'onboarding')
        } else {
          navigate('onboarding')
        }
      }} />}
      {page === 'onboarding' && <Onboarding onContinue={() => navigate('launcher')} />}
      {page === 'launcher' && <Launcher onNavigate={navigate} />}
      {page === 'pos' && <POSDashboard onBack={() => navigate('launcher')} onNewTx={() => navigate('pos-tx')} />}
      {page === 'pos-tx' && <POSTransaction onBack={() => navigate('pos')} />}
      {page === 'shift' && <ShiftDashboard onBack={() => navigate('launcher')} />}
      {page === 'reservation' && <ReservationDashboard onBack={() => navigate('launcher')} />}
      {page === 'tables' && <TableManager onBack={() => navigate('launcher')} />}
      {page === 'promos' && <PromoManager onBack={() => navigate('launcher')} />}
      {page === 'pos-settings' && <POSSettings onBack={() => navigate('launcher')} />}
      {page === 'toppings' && <ToppingManager onBack={() => navigate('launcher')} />}
      {page === 'tx-history' && <TransactionHistory onBack={() => navigate('launcher')} />}
      {page === 'shift-report' && <ShiftReport onBack={() => navigate('launcher')} />}
      {page === 'gudang' && <GudangDashboard onBack={() => navigate('launcher')} onProductDetail={() => navigate('gudang-detail')} />}
      {page === 'gudang-detail' && <GudangProductDetail onBack={() => navigate('gudang')} />}
      {page === 'sales' && <SalesDashboard onBack={() => navigate('launcher')} />}
      {page === 'staff' && <StaffDashboard onBack={() => navigate('launcher')} />}
      {page === 'db-settings' && <DatabaseSettings />}

      {/* New modules */}
      {page === 'finance' && <FinanceDashboard onBack={() => navigate('launcher')} />}
      {page === 'customer' && <CustomerDashboard onBack={() => navigate('launcher')} />}
      {page === 'purchase' && <ModulePlaceholder onBack={() => navigate('launcher')} title="Har-Purchase" desc="Pembelian dari supplier dan manajemen stok masuk." icon="🚚" />}
      {page === 'rental' && <RentalDashboard onBack={() => navigate('launcher')} />}
      {page === 'deadline' && <DeadlineDashboard onBack={() => navigate('launcher')} />}
      {page === 'promo' && <ModulePlaceholder onBack={() => navigate('launcher')} title="Har-Promo" desc="Buat dan kelola diskon, voucher, dan promosi." icon="🎁" />}
      {page === 'report' && <ModulePlaceholder onBack={() => navigate('launcher')} title="Har-Report" desc="Laporan penjualan, keuangan, dan analitik usaha." icon="📊" />}
      {page === 'ai' && <AIDashboard onBack={() => navigate('launcher')} />}

      {page !== 'login' && page !== 'onboarding' && page !== 'launcher' && page !== 'pos-tx' && page !== 'gudang-detail' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-white/10 shadow-lg z-50 md:hidden">
          <div className="flex justify-around py-2 overflow-x-auto">
            <button onClick={() => navigate('launcher')} className="flex flex-col items-center px-3 py-1 text-xs text-slate-300"><span className="text-lg">🏠</span>Home</button>
            <button onClick={() => navigate('pos')} className="flex flex-col items-center px-3 py-1 text-xs text-slate-300"><span className="text-lg">🛒</span>POS</button>
            <button onClick={() => navigate('gudang')} className="flex flex-col items-center px-3 py-1 text-xs text-slate-300"><span className="text-lg">📦</span>Inv</button>
            <button onClick={() => navigate('finance')} className="flex flex-col items-center px-3 py-1 text-xs text-slate-300"><span className="text-lg">💰</span>Fin</button>
            <button onClick={() => navigate('ai')} className="flex flex-col items-center px-3 py-1 text-xs text-slate-300"><span className="text-lg">🤖</span>AI</button>
          </div>
        </nav>
      )}

      {page !== 'login' && page !== 'onboarding' && (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 bg-slate-900 border-r border-white/10 flex-col p-4 z-40 text-white">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logos/haros-hub-logo.jpg" alt="" className="w-9 h-9 rounded-xl object-cover" />
            <span className="font-bold">HarOS Hub</span>
          </div>
          <nav className="space-y-1 flex-1 overflow-y-auto text-sm">
            <button onClick={() => navigate('launcher')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">🏠 Home</button>
            <button onClick={() => navigate('pos')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">🛒 Har-POS</button>
            <button onClick={() => navigate('gudang')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">📦 Har-Inventory</button>
            <button onClick={() => navigate('finance')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">💰 Har-Finance</button>
            <button onClick={() => navigate('sales')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">📈 Har-Sale</button>
            <button onClick={() => navigate('staff')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">👥 Har-Staff</button>
            <button onClick={() => navigate('customer')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">🤝 Har-Customer</button>
            <button onClick={() => navigate('rental')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">🔑 Har-Sewa</button>
            <button onClick={() => navigate('deadline')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">⏰ Har-Tenggat</button>
            <button onClick={() => navigate('ai')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">🤖 Har-AI</button>
            <button onClick={() => navigate('db-settings')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10">⚙️ Setting</button>
          </nav>
          <button
            onClick={async () => {
              const supabase = getSupabase()
              await supabase.auth.signOut()
              localStorage.clear()
              navigate('login')
            }}
            className="text-sm text-red-400 font-medium mt-4 hover:text-red-300"
          >
            Keluar
          </button>
        </aside>
      )}

      {page !== 'login' && page !== 'onboarding' && <div className="hidden md:block md:ml-56" />}
    </div>
  )
}

export default App
