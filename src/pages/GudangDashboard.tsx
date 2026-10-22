import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { Package, Plus, ArrowLeft, AlertTriangle, Box, Minus, Pencil } from 'lucide-react'

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
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [adding, setAdding] = useState(false)

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

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState('')

  async function updateStock(id: string, newStock: number) {
    try {
      const { error: err } = await getSupabase().from('products').update({ stock: Math.max(0, newStock) }).eq('id', id)
      if (err) throw err
      await loadProducts()
      setEditingId(null)
    } catch (e: any) {
      setError(e.message || 'Gagal update stok')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        {onBack && <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100"><ArrowLeft size={20} /></button>}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white">
          <Package size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Har-Inventory</h1>
          <p className="text-sm text-slate-500">Manajemen Stok & Produk</p>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><Box size={14} className="text-emerald-500" /> Total Barang</div>
            <div className="font-bold text-2xl text-slate-900">{products.length}</div>
          </div>
          <div className={`rounded-2xl border p-4 shadow-sm ${lowStock > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><AlertTriangle size={14} className={lowStock > 0 ? 'text-orange-500' : 'text-slate-400'} /> Stok Rendah</div>
            <div className={`font-bold text-2xl ${lowStock > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{lowStock}</div>
          </div>
        </div>

        {error && <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus size={16} /> Tambah Barang Baru</div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama barang"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Harga jual"
              type="number"
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <input
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Stok awal"
              type="number"
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Kategori (opsional)" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
          <label className="block">
            <span className="text-xs text-slate-500 mb-1 block">Gambar produk</span>
            <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700" />
          </label>
          <button onClick={addProduct} disabled={adding || !newName.trim()} className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition">
            {adding ? 'Menambahkan...' : 'Tambah Barang'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-sm text-slate-700">Daftar Barang</div>
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-400">Memuat...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">Belum ada barang</div>
          ) : (
            <div className="divide-y">
              {products.map((p) => (
                <div key={p.id} className="px-4 py-3.5 flex justify-between items-center hover:bg-slate-50 transition">
                  <div className="flex-1 min-w-0" onClick={onProductDetail}>
                    <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500">Rp {Number(p.price).toLocaleString('id-ID')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editStock}
                          onChange={e => setEditStock(e.target.value)}
                          className="w-16 px-2 py-1 border rounded-lg text-sm"
                          autoFocus
                        />
                        <button onClick={() => updateStock(p.id, Number(editStock) || 0)} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-lg">OK</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-500 px-1">✕</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100"><Minus size={14} /></button>
                        <button
                          onClick={() => { setEditingId(p.id); setEditStock(String(p.stock)) }}
                          className={`text-sm font-semibold px-2.5 py-1 rounded-full min-w-[3rem] text-center ${p.stock < 5 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}
                        >
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
      </main>
    </div>
  )
}
