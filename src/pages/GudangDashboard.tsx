import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

interface Props {
  onBack?: () => void
  onProductDetail?: () => void
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

export default function GudangDashboard({ onBack, onProductDetail }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const supabase = getSupabase()
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  async function addProduct() {
    if (!newName) return
    const supabase = getSupabase()
    await supabase.from('products').insert({ name: newName, price: 0, stock: 0 })
    setNewName('')
    loadProducts()
  }

  const lowStock = products.filter(p => p.stock < 5).length

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0">
        {onBack && <button onClick={onBack} className="text-slate-600 text-xl">←</button>}
        <div>
          <h1 className="text-xl font-bold">Har-Inventory</h1>
          <p className="text-sm text-slate-500">Manajemen Stok</p>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border p-4">
            <div className="text-xs text-slate-500">Total Barang</div>
            <div className="font-bold text-lg">{products.length}</div>
          </div>
          <div className={`rounded-2xl border p-4 ${lowStock > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
            <div className="text-xs text-slate-500">Stok Rendah</div>
            <div className={`font-bold text-lg ${lowStock > 0 ? 'text-orange-600' : ''}`}>{lowStock}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama barang baru"
              className="flex-1 px-3 py-2 border rounded-xl text-sm"
            />
            <button onClick={addProduct} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">Tambah</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b font-semibold text-sm">Daftar Barang</div>
          {loading ? (
            <div className="p-4 text-sm text-slate-400">Memuat...</div>
          ) : products.length === 0 ? (
            <div className="p-4 text-sm text-slate-400">Belum ada barang</div>
          ) : (
            <div className="divide-y">
              {products.map((p) => (
                <div key={p.id} className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50" onClick={onProductDetail}>
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">Rp {Number(p.price).toLocaleString('id-ID')}</div>
                  </div>
                  <div className={`text-sm font-medium ${p.stock < 5 ? 'text-orange-600' : 'text-slate-700'}`}>
                    Stok: {p.stock}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
