import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { Package, Plus, ArrowLeft, AlertTriangle, Box, Minus, Pencil, Bell } from 'lucide-react'

interface Props {
  onBack?: () => void
  onProductDetail?: () => void
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image_url?: string
  category?: string
}

export default function GudangDashboard({ onBack, onProductDetail }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState('')

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    try {
      const { data, error: err } = await getSupabase().from('products').select('*').order('created_at', { ascending: false })
      if (err) throw err
      if (data) setProducts(data)
    } catch (e: any) {
      setError(e.message || 'Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  async function addProduct() {
    if (!newName.trim()) return
    setAdding(true)
    try {
      const sb = getSupabase()
      let imageUrl = ''
      if (newImage) {
        const path = `products/${Date.now()}-${newImage.name}`
        const { error: upErr } = await sb.storage.from('product-images').upload(path, newImage)
        if (!upErr) {
          const { data } = sb.storage.from('product-images').getPublicUrl(path)
          imageUrl = data.publicUrl
        }
      }
      const { error: err } = await sb.from('products').insert({
        name: newName.trim(),
        price: Number(newPrice) || 0,
        stock: Number(newStock) || 0,
        category: newCategory || null,
        image_url: imageUrl || null,
      })
      if (err) throw err
      setNewName(''); setNewPrice(''); setNewStock(''); setNewCategory(''); setNewImage(null)
      await loadProducts()
    } catch (e: any) {
      setError(e.message || 'Gagal menambah produk')
    } finally {
      setAdding(false)
    }
  }

  async function updateStock(id: string, newStockVal: number) {
    try {
      const { error: err } = await getSupabase().from('products').update({ stock: Math.max(0, newStockVal) }).eq('id', id)
      if (err) throw err
      await loadProducts()
      setEditingId(null)
    } catch (e: any) {
      setError(e.message || 'Gagal update stok')
    }
  }

  const lowStock = products.filter(p => p.stock < 5).length

  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      {/* Dark Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
        <header className="relative px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={20} /></button>}
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Package size={18} />
            </div>
            <div>
              <div className="font-bold text-base">Har-Inventory</div>
              <div className="text-xs text-blue-200">Stok & Produk</div>
            </div>
          </div>
          <Bell size={20} />
        </header>
        <div className="relative px-4 pb-6">
          <h1 className="text-lg font-bold">Manajemen Inventori</h1>
          <p className="text-blue-100 text-sm mt-0.5">Kelola stok barang dan pantau ketersediaan.</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-2xl mx-auto">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-blue-200 mb-1"><Box size={12} /> TOTAL BARANG</div>
            <div className="text-lg font-bold">{products.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-blue-200 mb-1"><AlertTriangle size={12} /> STOK RENDAH</div>
            <div className="text-lg font-bold">{lowStock}</div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        {/* Add Form */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 mb-4">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus size={16} /> Tambah Barang Baru</div>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama barang" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          <div className="grid grid-cols-2 gap-2">
            <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Harga jual" type="number" className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            <input value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="Stok awal" type="number" className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Kategori (opsional)" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
          <label className="block">
            <span className="text-xs text-slate-500 mb-1 block">Gambar produk</span>
            <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
          </label>
          <button onClick={addProduct} disabled={adding || !newName.trim()} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition">
            {adding ? 'Menambahkan...' : 'Tambah Barang'}
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-sm text-slate-700">Daftar Barang</div>
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-400">Memuat...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">Belum ada barang</div>
          ) : (
            <div className="divide-y">
              {products.map((p) => (
                <div key={p.id} className="px-4 py-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={onProductDetail}>
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-10 h-10 object-contain bg-slate-50 rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm">{p.name.slice(0,1)}</div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
                      <div className="text-xs text-slate-500">Rp {Number(p.price).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} className="w-16 px-2 py-1 border rounded-lg text-sm" autoFocus />
                        <button onClick={() => updateStock(p.id, Number(editStock) || 0)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded-lg">OK</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-500 px-1">✕</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100"><Minus size={14} /></button>
                        <button onClick={() => { setEditingId(p.id); setEditStock(String(p.stock)) }} className={`text-sm font-semibold px-2.5 py-1 rounded-full min-w-[3rem] text-center ${p.stock < 5 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                          {p.stock}
                        </button>
                        <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100"><Plus size={14} /></button>
                        <button onClick={() => { setEditingId(p.id); setEditStock(String(p.stock)) }} className="text-slate-400 hover:text-slate-600 ml-1"><Pencil size={14} /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
