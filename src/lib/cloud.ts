import { CLOUDINARY } from "../config";

/** Optional: create nice thumbnails via Cloudinary transformations */
export const withTx = (url: string, tx: string) =>
  url.includes("/upload/")
    ? url.replace("/upload/", `/upload/${tx}/`)
    : url;

/** Unsigned upload (no backend) */
export function uploadToCloudinary(
  file: File,
  opts?: { folder?: string }
): Promise<{
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  original_filename: string;
}> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY.uploadPreset);
    if (opts?.folder || CLOUDINARY.folder) {
      form.append("folder", opts?.folder ?? CLOUDINARY.folder);
    }

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`
    );

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));

    xhr.send(form);
  });
}
