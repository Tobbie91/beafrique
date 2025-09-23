// src/components/ProductImageUploader.tsx
import { useState } from 'react'
import { CLOUDINARY } from '../config'

export default function ProductImageUploader({ onUploadSuccess }: { onUploadSuccess: (url: string, publicId: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', CLOUDINARY.uploadPreset)
    if (CLOUDINARY.folder) fd.append('folder', CLOUDINARY.folder)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()

      if (!res.ok) {
        // Common message when preset is missing/wrong
        throw new Error(data?.error?.message || 'Upload failed')
      }

      setPreview(data.secure_url)
      onUploadSuccess(data.secure_url, data.public_id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium">Product image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full rounded-lg border p-2"
        />
      </label>

      {loading && <p className="text-sm text-gray-600">Uploading…</p>}
      {error && <p className="text-sm text-red-600">Error: {error}</p>}
      {preview && (
        <img
          src={preview}
          alt="Uploaded preview"
          className="mt-2 h-48 w-full object-cover rounded-lg border"
        />
      )}
    </div>
  )
}
