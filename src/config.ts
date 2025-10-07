// src/config.ts

export type BrandConfig = {
  name: string;
  whatsapp: string;   // digits only for wa.me
  email: string;
  phone: string;      // display version
  address: string;
  currencySymbol?: string; // ← optional
  currencyCode?: string;   // ← optional (e.g., "GBP")
};

export const BRAND: BrandConfig = {
  name: "Be Afrique",
  whatsapp: "447733729418",
  email: "hello@beafrique.com",
  phone: "+44 7733 729 418",
  address: "24 Jubilee Road, Southsea, Portsmouth PO4 0JE, United Kingdom",
  currencySymbol: "£",      // ← add this to silence TS2339
  currencyCode: "GBP",
};

export type BankConfig = {
  country: "GB" | "NG" | "US" | "EU" | string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string;   // ✅ UK needs this
  iban?: string;       // optional (international)
  bic?: string;        // optional (international)
  note?: string;
};



export const BANK: BankConfig = {
  country: "GB",
  bankName: "Barclays",
  accountName: "Be Afrique Ltd",
  sortCode: "12-34-56",       
  accountNumber: "12345678",
  iban: "GB12BARC12345612345678",
  bic: "BARCGB22",               
  note: "Use your Order ID as the payment reference.",
};

export const STORE = {
  name: 'Be Afrique Limited',
  whatsappNumber: '2348012345678', // international format, no leading +
  bank: {
    name: 'GTBank',
    accountName: 'SupreWatch Ltd',
    accountNumber: '0123456789',
  },
  currency: 'NGN',
  adminPin: '1234',
}

// OPTIONAL: Cloudinary unsigned upload (no backend needed)
export const CLOUDINARY = {
  cloudName: 'dbl85m2kz',     
  uploadPreset: 'unsigned_beafrique',   
  folder: 'beafrique',   
}