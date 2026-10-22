import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface Props { onBack: () => void }
interface Option { id: string; product_id: string; name: string; price: number }
interface Product { id: string; name: string }

export default function ToppingManager({ onBack }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [productId, setProductId] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)

  useEffect(() => { load() }, [])
  async function load() {
    const sb = getSupabase()
    const [p, o] = await Promise.all([
      sb.from('products').select('id, name').order('name'),
      sb.from('product_options').select('*').order('name'),
    ])
    if (p.data) setProducts(p.data)
    if (o.data) setOptions(o.data)
  }
  async function add() {
    if (!productId || !name) return
    await getSupabase().from('product_options').insert({ product_id: productId, name, price })
    setName(''); setPrice(0); load()
  }
  async function del(id: string) {
    await getSupabase().from('product_options').delete().eq('id', id); load()
  }

  const filtered = options.filter(o => !productId || o.product_id === productId)

  return (
    <div className="min-h-screen bg-slate-50 md:ml-56">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={onBack}><ArrowLeft size={20} /></button><span className="font-semibold">Topping / Opsi</span></header>
      <main className="p-4 max-w-lg">
        <div className="bg-white rounded-2xl border p-4 mb-4 space-y-2">
          <select value={productId} onChange={e => setProductId(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm">
            <option value="">Pilih produk</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama topping" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Harga tambahan" className="w-full border rounded-xl px-3 py-2 text-sm" />
          <button onClick={add} disabled={!productId || !name} className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm">Tambah Opsi</button>
        </div>
        {filtered.map(o => (
          <div key={o.id} className="bg-white rounded-xl border px-4 py-3 mb-2 flex justify-between items-center text-sm">
            <div><div className="font-medium">{o.name}</div><div className="text-xs text-slate-500">+Rp {Number(o.price).toLocaleString('id-ID')}</div></div>
            <button onClick={() => del(o.id)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </main>
    </div>
  )
}
