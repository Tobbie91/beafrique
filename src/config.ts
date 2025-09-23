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
  bankName: string;
  accountName: string;
  accountNumber: string;
  note?: string;
  sortCode?: string;  // ← optional (UK)
  iban?: string;      // ← optional (international)
  bic?: string;       // ← optional (aka SWIFT)
};

export const BANK: BankConfig = {
  bankName: "Monzo Bank",
  accountName: "Be Afrique Limited",
  accountNumber: "12345678",
  sortCode: "04-00-04",
  iban: "GB00MONZ04000412345678",
  bic: "MONZGB2L",
  note: "Use your order name/number as payment reference.",
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