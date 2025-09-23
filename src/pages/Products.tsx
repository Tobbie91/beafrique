import ProductCard from '../components/ProductCard'
import { PRODUCTS, CATEGORIES } from '../data/products'
import { useState } from 'react'

export default function Products(){
  const [cat, setCat] = useState<string>('all')
  const items = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat)

  return (
    <div className="container pb-16">
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-2xl md:text-3xl font-bold">Shop</h1>
        <select value={cat} onChange={(e)=>setCat(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="all">All</option>
          {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (<ProductCard key={p.slug} p={p} />))}
      </div>
    </div>
  )
}
