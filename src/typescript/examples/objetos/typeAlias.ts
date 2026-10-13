// ─── type: un "alias" para cualquier tipo (objetos, uniones, tuplas, funciones…) ───
export type ID = string | number;
export type Coordinates = [lat: number, lng: number];
export type Product = {
  id: ID;
  name: string;
  price: number;
};

// ─── Intersección (&): combinar tipos ───
export type Timestamps = { createdAt: Date; updatedAt: Date };
export type ProductRecord = Product & Timestamps;

export const keyboard: ProductRecord = {
  id: 'p-001',
  name: 'Teclado',
  price: 89.9,
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-10-12'),
};

// ─── ¿type o interface? ───
// interface → objetos y clases; se puede extender y "reabrir" (declaration merging)
// type      → todo lo demás: uniones, tuplas, funciones, tipos calculados
export interface Settings {
  theme: string;
}
export interface Settings {
  language: string; // se FUSIONA con la anterior
}
export const settings: Settings = { theme: 'dark', language: 'es' };

// ─── Objetos anidados y opcionales con ?. ───
export type Company = {
  name: string;
  ceo?: { name: string; twitter?: string };
};

export const companies: Company[] = [
  { name: 'Acme', ceo: { name: 'Wile E.', twitter: '@wile' } },
  { name: 'Initech' },
];

// ▶ Demo
export default function demo() {
  console.log(keyboard);
  console.log('Settings fusionadas:', settings);
  const madrid: Coordinates = [40.41, -3.7];
  console.log('Coordenadas:', madrid);

  for (const company of companies) {
    // ?. evita el error si ceo no existe
    console.log(company.name, '→ CEO:', company.ceo?.name ?? '—', '| twitter:', company.ceo?.twitter ?? '—');
  }
}
