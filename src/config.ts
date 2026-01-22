// src/config.ts

export type BrandConfig = {
  name: string;
  whatsapp: string; 
  email: string;
  phone: string;  
  address: string;
  currencySymbol?: string;
  currencyCode?: string;  
};

export const BRAND: BrandConfig = {
  name: "Be Afrique",
  whatsapp: "447733729418",
  email: "Bukonla@beafrique.com",
  phone: "+447733729418",
  address: "24 Jubilee Road, Southsea, Portsmouth PO4 0JE, United Kingdom",
  currencySymbol: "£",     
  currencyCode: "GBP",
};

export type BankConfig = {
  country: "GB" | "NG" | "US" | "EU" | string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string; 
  iban?: string;      
  bic?: string;       
  note?: string;
};



export const BANK: BankConfig = {
  country: "GB",
  bankName: "Tide bank / Clear bank",
  accountName: "Be Afrique Limited",
  sortCode: "04-06-05",       
  accountNumber: "26481523",
  // iban: "GB12BARC12345612345678",
  // bic: "BARCGB22",               
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