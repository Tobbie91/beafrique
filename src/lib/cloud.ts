

// lib/cloud.ts
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const PRESET = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET!;
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "beafrique";

export type CloudUpload = { url: string; publicId: string };

export async function uploadToCloudinary(file: File | string, publicId?: string): Promise<CloudUpload> {
  if (!CLOUD || !PRESET) throw new Error("Cloudinary env not set (cloud or preset).");
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/upload`;

  const form = new FormData();
  form.append("upload_preset", PRESET);
  form.append("folder", FOLDER);
  if (publicId) form.append("public_id", publicId);
  form.append("file", file);

  const res = await fetch(url, { method: "POST", body: form });
  const text = await res.text();
  if (!res.ok) {
    try { throw new Error(JSON.parse(text)?.error?.message || `Cloudinary ${res.status}`); }
    catch { throw new Error(`Cloudinary ${res.status}: ${text}`); }
  }
  const json = JSON.parse(text);
  return { url: json.secure_url as string, publicId: json.public_id as string };
}
