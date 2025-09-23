import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLOUDINARY } from '../config'
import { useProducts } from '../store/products'
import type { Product } from '../data/products'

const CATEGORIES = [
  { id: 'long-dresses', name: 'Long Dresses' },
  { id: 'two-piece', name: 'Two-Piece Sets' },
  { id: 'tops', name: 'Tops' },
  { id: 'accessories', name: 'Accessories' },
] as const

export default function AdminNewProduct() {
  const navigate = useNavigate()
  const add = useProducts((s) => s.add)

  const [name, setName] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [category, setCategory] = useState<typeof CATEGORIES[number]['id']>('long-dresses')
  const [description, setDescription] = useState('')
  const [sizes, setSizes] = useState<string>('S,M,L') // comma-separated
  const [image, setImage] = useState<string>('')      // Cloudinary URL
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')

  const slugify = (s: string) =>
    s.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const handleFile = async (file?: File) => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY.uploadPreset)
      if (CLOUDINARY.folder) fd.append('folder', CLOUDINARY.folder)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error?.message || 'Upload failed')
      }
      // optional: inject delivery transformations for faster cards
      const url: string = json.secure_url
      const i = url.indexOf('/upload/')
      const optimized = i > -1 ? url.slice(0, i + 8) + 'f_auto,q_auto,c_fill' + url.slice(i + 8) : url

      setImage(optimized)
    } catch (e: any) {
      setError(e.message || 'Upload error')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !price || !image) {
      setError('Name, price and image are required.')
      return
    }

    setSaving(true)
    try {
      const product: Product = {
        slug: slugify(name),
        name,
        price: Number(price),
        image,
        category,
        sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
        description: description || '—',
      }
      add(product)
      navigate('/catalogue')
    } catch (e: any) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold">Add New Product</h1>
      <p className="mt-2 text-gray-600">Upload image to Cloudinary and publish to your catalogue.</p>

      <form onSubmit={onSubmit} className="mt-6 grid lg:grid-cols-3 gap-8">
        {/* Left: Image uploader */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Product image</label>
          <div className="mt-2 rounded-xl border-dashed border-2 p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="block w-full text-sm"
            />
            {uploading && <p className="mt-3 text-sm text-gray-500">Uploading…</p>}
            {image && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img src={image} alt="preview" className="w-full aspect-[4/5] object-cover" />
              </div>
            )}
          </div>
          {image && (
            <p className="mt-2 text-xs text-gray-500 break-all">
              URL: {image}
            </p>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="mt-1 w-full h-11 rounded-lg border px-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Afara Maxi Dress"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (NGN)</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full h-11 rounded-lg border px-3"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="48000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 w-full h-11 rounded-lg border px-3 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Available sizes (comma-separated)</label>
            <input
              className="mt-1 w-full h-11 rounded-lg border px-3"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="XS,S,M,L,XL"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Timeless silhouette in premium fabric with elegant flow and structured fit."
            />
          </div>

          {error && (
            <div className="sm:col-span-2 text-sm text-red-600">{error}</div>
          )}

          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-lg bg-green-600 text-white px-5 py-3 hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Publish Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/catalogue')}
              className="rounded-lg border px-5 py-3 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
