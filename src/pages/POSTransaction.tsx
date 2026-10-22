import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { Menu, Calendar, Plus, Trash2, Save, Search, Pause, Play } from 'lucide-react'

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

interface HeldOrder {
  id: string
  items: CartItem[]
  note: string
  createdAt: number
}

export default function POSTransaction({ onBack }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [paymentType, setPaymentType] = useState<'tunai' | 'qris' | 'transfer'>('tunai')
  const [search, setSearch] = useState('')
  const [held, setHeld] = useState<HeldOrder[]>([])
  const [showHeld, setShowHeld] = useState(false)

  const filtered = products.filter(p =>
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
  }

  function updateQty(id: string, delta: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function holdOrder() {
    if (items.length === 0) return
    const order: HeldOrder = {
      id: Date.now().toString(),
      items: [...items],
      note: `Pesanan ${held.length + 1}`,
      createdAt: Date.now(),
    }
    setHeld(prev => [order, ...prev])
    setItems([])
    setDiscount(0)
  }

  function recallOrder(id: string) {
    const order = held.find(h => h.id === id)
    if (!order) return
    setItems(order.items)
    setHeld(prev => prev.filter(h => h.id !== id))
    setShowHeld(false)
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)
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
      items,
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
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="p-1"><Menu size={22} /></button>
          <div className="text-center">
            <div className="font-bold text-sm">Har-POS</div>
            <div className="text-[10px] text-blue-100">Transaksi Baru</div>
          </div>
          <div className="flex items-center gap-1 text-xs bg-white/15 rounded-full px-2 py-1">
            <Calendar size={12} />
            <span>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr_340px] gap-4 p-4">
        {/* Product Grid */}
        <div>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center text-sm text-slate-400">
              Produk tidak ditemukan
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map(p => {
                const inCart = items.find(i => i.id === p.id)?.qty || 0
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="bg-white rounded-2xl border border-slate-100 p-3 text-left shadow-sm active:scale-[0.98] transition relative"
                  >
                    {inCart > 0 && (
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">
                        {inCart}
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm mb-2">
                      {p.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">{p.name}</div>
                    <div className="text-xs font-bold text-blue-600 mt-1.5">Rp {Number(p.price).toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Stok: {p.stock}</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Cart Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-fit md:sticky md:top-16">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm">Pesanan</div>
            <div className="flex gap-1">
              <button onClick={() => setShowHeld(true)} className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1">
                <Play size={12} /> {held.length}
              </button>
              <button onClick={holdOrder} disabled={items.length === 0} className="text-xs px-2 py-1 rounded-lg bg-amber-100 text-amber-700 disabled:opacity-40 flex items-center gap-1">
                <Pause size={12} /> Tahan
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Belum ada item</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-auto mb-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500">Rp {Number(item.price).toLocaleString('id-ID')}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded border text-xs">-</button>
                    <span className="w-5 text-center text-xs">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded border text-xs">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 p-1"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
            <div className="flex items-center justify-between">
              <span>Diskon %</span>
              <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-14 border rounded px-1.5 py-0.5 text-right text-xs" />
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-1.5">Metode Bayar</div>
            <div className="flex gap-1.5">
              {(['tunai', 'qris', 'transfer'] as const).map(pt => (
                <button
                  key={pt}
                  onClick={() => setPaymentType(pt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs capitalize ${paymentType === pt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveTransaction}
            disabled={saving || items.length === 0}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </div>
      </div>

      {showHeld && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[60vh] overflow-auto">
            <div className="p-4 border-b font-semibold flex justify-between">
              Pesanan Ditahan
              <button onClick={() => setShowHeld(false)}>✕</button>
            </div>
            {held.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">Tidak ada pesanan ditahan</div>
            ) : (
              held.map(h => (
                <button key={h.id} onClick={() => recallOrder(h.id)} className="w-full text-left px-4 py-3 border-b hover:bg-slate-50">
                  <div className="font-medium text-sm">{h.note}</div>
                  <div className="text-xs text-slate-500">{h.items.length} item · {new Date(h.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
