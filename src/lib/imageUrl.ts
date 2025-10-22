// src/lib/imageUrl.ts
// If it's a Google Drive "file/d/<id>/view" link, convert to direct view.
// Otherwise return as-is (works for Cloudinary).
export function toDirectImageUrl(url: string) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("drive.google.com")) {
        // formats: /file/d/{id}/view   or   ?id={id}
        const idMatch = u.pathname.match(/\/d\/([^/]+)\//)?.[1] || u.searchParams.get("id");
        if (idMatch) return `https://drive.google.com/uc?export=view&id=${idMatch}`;
      }
      return url;
    } catch {
      return url;
    }
  }
  