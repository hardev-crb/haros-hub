import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { Menu, Calendar, User, Box, Plus, Trash2, CreditCard, Save } from 'lucide-react'

interface Props {
  onBack: () => void
}

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

export default function POSTransaction({ onBack }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [paymentType, setPaymentType] = useState<'tunai' | 'qris' | 'transfer'>('tunai')
  const [showProducts, setShowProducts] = useState(false)
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { data } = await getSupabase().from('products').select('*').order('name')
    if (data) setProducts(data)
  }

  function addToCart(p: Product) {
    setItems(prev => {
      const existing = prev.find(i => i.id === p.id)
      if (existing) {
        return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    })
    setShowProducts(false)
  }

  function updateQty(id: string, delta: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount

  async function saveTransaction() {
    if (items.length === 0) return
    setSaving(true)
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: txError } = await supabase.from('transactions').insert({
      total,
      discount: discountAmount,
      items: items,
      status: paymentType,
      created_by: user?.id,
    })

    if (txError) {
      setSaving(false)
      alert('Gagal menyimpan transaksi: ' + txError.message)
      return
    }

    for (const item of items) {
      const { data: prod } = await supabase.from('products').select('stock').eq('id', item.id).single()
      if (prod) {
        const newStock = Math.max(0, (prod.stock || 0) - item.qty)
        await supabase.from('products').update({ stock: newStock }).eq('id', item.id)
      }
    }

    setSaving(false)
    alert('Transaksi berhasil disimpan')
    onBack()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <button onClick={onBack}><Menu size={22} /></button>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="font-bold">Har-POS</div>
          <div className="text-xs text-blue-100">Transaksi Baru</div>
        </div>
      </header>

      <main className="p-4 space-y-4 pb-32">
        <div>
          <h1 className="text-2xl font-bold">Transaksi Baru</h1>
          <p className="text-slate-500 text-sm">Buat transaksi penjualan</p>
        </div>

        <div className="bg-white rounded-2xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User size={16} className="text-blue-600" />
              Pelanggan
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-sm">Walk-in Customer</div>
        </div>

        <div className="bg-white rounded-2xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Box size={16} className="text-blue-600" />
              Item Produk
            </div>
            <button onClick={() => setShowProducts(true)} className="text-blue-600 text-sm border border-blue-200 rounded-full px-3 py-1 flex items-center gap-1">
              <Plus size={14} /> Tambah
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Belum ada item</p>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">Rp {item.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full border text-sm">-</button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full border text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showProducts && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[70vh] overflow-auto">
              <div className="p-4 border-b">
                <div className="font-semibold flex justify-between mb-3">
                  Pilih Produk
                  <button onClick={() => { setShowProducts(false); setSearch('') }}>✕</button>
                </div>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama produk..."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  autoFocus
                />
              </div>
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-sm text-slate-400">Produk tidak ditemukan</div>
              ) : (
                filteredProducts.map(p => (
                  <button key={p.id} onClick={() => { addToCart(p); setSearch('') }} className="w-full text-left px-4 py-3 border-b hover:bg-slate-50 active:bg-blue-50">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-slate-500">Rp {Number(p.price).toLocaleString('id-ID')} · Stok: {p.stock}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <div className="text-sm font-medium text-slate-700 mb-2">Metode Pembayaran</div>
          <div className="flex gap-2">
            {(['tunai', 'qris', 'transfer'] as const).map(pt => (
              <button
                key={pt}
                onClick={() => setPaymentType(pt)}
                className={`flex-1 py-2 rounded-xl text-sm capitalize ${paymentType === pt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Diskon (%)</span>
            <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-right text-sm" />
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:ml-56">
        <button onClick={saveTransaction} disabled={saving || items.length === 0} className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </div>
    </div>
  )
}
