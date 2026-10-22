import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { Menu, Calendar, Plus, Trash2, Save, Search, Pause, Play, Utensils } from 'lucide-react'

interface Props { onBack: () => void }
interface CartItem { id: string; name: string; price: number; qty: number; options?: { name: string; price: number }[] }
interface Product { id: string; name: string; price: number; stock: number; category?: string; image_url?: string }
interface HeldOrder { id: string; items: CartItem[]; note: string; table_id?: string; created_at: string }
interface Table { id: string; name: string; status: string; capacity: number }
interface Promo { id: string; name: string; code?: string; type: 'percent' | 'amount'; value: number; min_subtotal: number; active: boolean }
interface Settings { tax_percent: number; service_percent: number; default_packing_fee: number }

export default function POSTransaction({ onBack }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null)
  const [paymentType, setPaymentType] = useState<'tunai' | 'qris' | 'transfer'>('tunai')
  const [orderType, setOrderType] = useState<'dinein' | 'takeaway' | 'delivery'>('dinein')
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [held, setHeld] = useState<HeldOrder[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [settings, setSettings] = useState<Settings>({ tax_percent: 0, service_percent: 0, default_packing_fee: 0 })
  const [promos, setPromos] = useState<Promo[]>([])
  const [options, setOptions] = useState<{id:string; product_id:string; name:string; price:number}[]>([])
  const [picking, setPicking] = useState<Product | null>(null)
  const [selectedOpts, setSelectedOpts] = useState<{name:string; price:number}[]>([])

  const [category, setCategory] = useState('')

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[]
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (!category || p.category === category)
  )

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const sb = getSupabase()
    const [p, h, t, s, pr, op] = await Promise.all([
      sb.from('products').select('*').order('name'),
      sb.from('held_orders').select('*').order('created_at', { ascending: false }),
      sb.from('tables').select('*').order('name'),
      sb.from('pos_settings').select('*').limit(1).maybeSingle(),
      sb.from('promos').select('*').eq('active', true),
      sb.from('product_options').select('*'),
    ])
    if (p.data) setProducts(p.data)
    if (h.data) setHeld(h.data)
    if (t.data) setTables(t.data)
    if (s.data) setSettings(s.data)
    if (pr.data) setPromos(pr.data)
    if (op.data) setOptions(op.data)
  }

  function addToCart(p: Product) {
    const opts = options.filter(o => o.product_id === p.id)
    if (opts.length > 0) {
      setPicking(p)
      setSelectedOpts([])
      return
    }
    setItems(prev => {
      const existing = prev.find(i => i.id === p.id && !i.options?.length)
      if (existing) return prev.map(i => i.id === p.id && !i.options?.length ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: p.id, name: p.name, price: Number(p.price), qty: 1 }]
    })
  }

  function confirmOptions() {
    if (!picking) return
    const extra = selectedOpts.reduce((s, o) => s + Number(o.price), 0)
    setItems(prev => [...prev, {
      id: picking.id,
      name: picking.name + (selectedOpts.length ? ` (${selectedOpts.map(o => o.name).join(', ')})` : ''),
      price: Number(picking.price) + extra,
      qty: 1,
      options: selectedOpts,
    }])
    setPicking(null)
    setSelectedOpts([])
  }

  function updateQty(idx: number, delta: number) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  function applyPromo() {
    const code = promoCode.trim().toUpperCase()
    const found = promos.find(p => p.code?.toUpperCase() === code && p.active)
    if (!found) { alert('Kode promo tidak valid'); return }
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0)
    if (sub < Number(found.min_subtotal || 0)) { alert('Minimum belanja belum tercapai'); return }
    setAppliedPromo(found)
  }

  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0)
  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'percent' ? Math.round(subtotal * appliedPromo.value / 100) : Math.min(subtotal, appliedPromo.value)
    : 0
  const manualDiscount = Math.round(subtotal * (discount / 100))
  const totalDiscount = Math.min(subtotal, promoDiscount + manualDiscount)
  const afterDiscount = subtotal - totalDiscount
  const tax = Math.round(afterDiscount * (settings.tax_percent || 0) / 100)
  const service = Math.round(afterDiscount * (settings.service_percent || 0) / 100)
  const packing = orderType === 'takeaway' ? Number(settings.default_packing_fee || 0) : 0
  const delivery = orderType === 'delivery' ? Number(deliveryFee || 0) : 0
  const total = afterDiscount + tax + service + packing + delivery

  async function holdOrder() {
    if (items.length === 0) return
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()
    const { data, error } = await sb.from('held_orders').insert({
      items, note: `Pesanan ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      table_id: selectedTable, created_by: user?.id
    }).select().single()
    if (error) { alert(error.message); return }
    if (data) setHeld(prev => [data, ...prev])
    setItems([])
    setDiscount(0)
    setAppliedPromo(null)
    setPromoCode('')
  }

  async function recallOrder(id: string) {
    const order = held.find(h => h.id === id)
    if (!order) return
    setItems(order.items || [])
    setSelectedTable(order.table_id || null)
    await getSupabase().from('held_orders').delete().eq('id', id)
    setHeld(prev => prev.filter(h => h.id !== id))
    setShowHeld(false)
  }

  async function saveTransaction() {
    if (items.length === 0) return
    setSaving(true)
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()
    const { error } = await sb.from('transactions').insert({
      total, discount: totalDiscount, items,
      status: paymentType,
      created_by: user?.id,
    })
    if (error) { setSaving(false); alert(error.message); return }
    for (const item of items) {
      const { data: prod } = await sb.from('products').select('stock').eq('id', item.id).single()
      if (prod) await sb.from('products').update({ stock: Math.max(0, (prod.stock || 0) - item.qty) }).eq('id', item.id)
    }
    if (selectedTable) await sb.from('tables').update({ status: 'available' }).eq('id', selectedTable)
    setSaving(false)
    alert('Transaksi berhasil')
    onBack()
  }

  function printKitchen() {
    const lines = items.map(i => `${i.qty}x ${i.name}`).join('\n')
    const text = `KITCHEN TICKET\n${new Date().toLocaleString('id-ID')}\nMeja: ${tables.find(t => t.id === selectedTable)?.name || '-'}\n\n${lines}\n\nTotal item: ${items.reduce((s, i) => s + i.qty, 0)}`
    const w = window.open('', '_blank', 'width=400,height=600')
    if (w) { w.document.write(`<pre style="font-family:monospace;padding:16px">${text}</pre>`); w.print() }
  }

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={onBack}><Menu size={22} /></button>
          <div className="text-center text-sm font-bold">Har-POS</div>
          <div className="text-xs bg-white/15 rounded-full px-2 py-1 flex items-center gap-1">
            <Calendar size={12} /> {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr_360px] gap-4 p-4">
        <div>
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            <button onClick={() => setCategory('')} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${!category ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Semua</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${category === c ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{c}</button>
            ))}
          </div>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..." className="w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-sm" />
            </div>
            <button onClick={() => setShowTables(true)} className="px-3 py-2 bg-white border rounded-xl text-sm flex items-center gap-1">
              <Utensils size={14} /> {selectedTable ? tables.find(t => t.id === selectedTable)?.name : 'Meja'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map(p => {
              const qty = items.filter(i => i.id === p.id).reduce((s, i) => s + i.qty, 0)
              return (
                <button key={p.id} onClick={() => addToCart(p)} className="bg-white rounded-2xl border p-3 text-left relative active:scale-[0.98]">
                  {qty > 0 && <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold min-w-[18px] h-5 rounded-full flex items-center justify-center">{qty}</span>}
                  {p.image_url ? <img src={p.image_url} alt="" className="w-full h-16 object-cover rounded-lg mb-2" /> : <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold mb-2">{p.name.slice(0,1)}</div>}
                  <div className="text-xs font-semibold line-clamp-2">{p.name}</div>
                  <div className="text-xs font-bold text-blue-600 mt-1">Rp {Number(p.price).toLocaleString('id-ID')}</div>
                  <div className="text-[10px] text-slate-400">Stok: {p.stock}{p.category ? ` · ${p.category}` : ''}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4 h-fit md:sticky md:top-16">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-sm">Pesanan</div>
            <div className="flex gap-1">
              <button onClick={() => setShowHeld(true)} className="text-xs px-2 py-1 bg-slate-100 rounded-lg flex items-center gap-1"><Play size={12} /> {held.length}</button>
              <button onClick={holdOrder} disabled={!items.length} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg disabled:opacity-40 flex items-center gap-1"><Pause size={12} /> Tahan</button>
            </div>
          </div>
          <div className="space-y-2 max-h-52 overflow-auto mb-3">
            {items.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Belum ada item</p>}
            {items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="flex-1 min-w-0"><div className="font-medium truncate">{it.name}</div><div className="text-[11px] text-slate-500">Rp {Number(it.price).toLocaleString('id-ID')}</div></div>
                <div className="flex items-center gap-1"><button onClick={() => updateQty(idx, -1)} className="w-6 h-6 border rounded text-xs">-</button><span className="w-5 text-center text-xs">{it.qty}</span><button onClick={() => updateQty(idx, 1)} className="w-6 h-6 border rounded text-xs">+</button></div>
                <button onClick={() => removeItem(idx)} className="text-red-500"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 space-y-1 text-xs">
            <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
            <div className="flex items-center gap-1"><input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Kode promo" className="flex-1 border rounded px-2 py-1 text-xs" /><button onClick={applyPromo} className="px-2 py-1 bg-slate-100 rounded text-xs">Apply</button></div>
            {appliedPromo && <div className="text-emerald-600">Promo: {appliedPromo.name} (-Rp {promoDiscount.toLocaleString('id-ID')})</div>}
            <div className="flex items-center justify-between"><span>Diskon %</span><input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-12 border rounded px-1 text-right" /></div>
            {tax > 0 && <div className="flex justify-between"><span>Pajak ({settings.tax_percent}%)</span><span>Rp {tax.toLocaleString('id-ID')}</span></div>}
            {service > 0 && <div className="flex justify-between"><span>Service ({settings.service_percent}%)</span><span>Rp {service.toLocaleString('id-ID')}</span></div>}
            {packing > 0 && <div className="flex justify-between"><span>Packing</span><span>Rp {packing.toLocaleString('id-ID')}</span></div>}
            {orderType === 'delivery' && <div className="flex items-center justify-between"><span>Ongkir</span><input type="number" value={deliveryFee} onChange={e => setDeliveryFee(Number(e.target.value))} className="w-16 border rounded px-1 text-right" /></div>}
            <div className="flex justify-between font-bold text-sm pt-1"><span>Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
          </div>
          <div className="mt-2 flex gap-1">
            {(['dinein', 'takeaway', 'delivery'] as const).map(ot => (
              <button key={ot} onClick={() => setOrderType(ot)} className={`flex-1 py-1 rounded text-[11px] ${orderType === ot ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{ot}</button>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            {(['tunai', 'qris', 'transfer'] as const).map(pt => (
              <button key={pt} onClick={() => setPaymentType(pt)} className={`flex-1 py-1.5 rounded text-xs capitalize ${paymentType === pt ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{pt}</button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={printKitchen} disabled={!items.length} className="flex-1 py-2 border rounded-xl text-xs">Kitchen</button>
            <button onClick={saveTransaction} disabled={saving || !items.length} className="flex-[2] py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50">{saving ? '...' : 'Simpan'}</button>
          </div>
        </div>
      </div>

      {showHeld && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4" onClick={() => setShowHeld(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[50vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b font-semibold">Pesanan Ditahan</div>
            {held.length === 0 && <div className="p-4 text-sm text-slate-400">Kosong</div>}
            {held.map(h => (
              <button key={h.id} onClick={() => recallOrder(h.id)} className="w-full text-left px-4 py-3 border-b text-sm">
                {h.note} · {h.items?.length || 0} item
              </button>
            ))}
          </div>
        </div>
      )}

      {picking && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4" onClick={() => setPicking(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-4" onClick={e => e.stopPropagation()}>
            <div className="font-semibold mb-2">{picking.name}</div>
            <div className="text-xs text-slate-500 mb-3">Pilih opsi</div>
            {options.filter(o => o.product_id === picking.id).map(o => {
              const on = selectedOpts.some(s => s.name === o.name)
              return (
                <button key={o.id} onClick={() => setSelectedOpts(prev => on ? prev.filter(s => s.name !== o.name) : [...prev, { name: o.name, price: Number(o.price) }])} className={`w-full text-left px-3 py-2 mb-1 rounded-lg border text-sm ${on ? 'border-blue-500 bg-blue-50' : ''}`}>
                  {o.name} <span className="text-slate-500">+Rp {Number(o.price).toLocaleString('id-ID')}</span>
                </button>
              )
            })}
            <button onClick={confirmOptions} className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm">Tambah</button>
          </div>
        </div>
      )}
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4" onClick={() => setShowTables(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[50vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b font-semibold">Pilih Meja</div>
            {tables.length === 0 && <div className="p-4 text-sm text-slate-400">Belum ada meja. Tambah di Admin.</div>}
            {tables.map(t => (
              <button key={t.id} onClick={() => { setSelectedTable(t.id); setShowTables(false) }} className="w-full text-left px-4 py-3 border-b text-sm flex justify-between">
                <span>{t.name}</span><span className="text-xs text-slate-400">{t.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
