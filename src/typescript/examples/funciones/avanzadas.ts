// ─── Callbacks tipados ───
export function repeat(times: number, callback: (index: number) => void): void {
  for (let i = 0; i < times; i++) callback(i);
}

// ─── Funciones que devuelven funciones (closures) ───
export function createCounter(start = 0) {
  let count = start; // "recordada" por las funciones de dentro
  return {
    increment: () => ++count,
    reset: () => (count = start),
  };
}

// ─── Funciones de orden superior genéricas en arrays ───
export interface Product {
  name: string;
  price: number;
  category: 'audio' | 'video';
}

export const products: Product[] = [
  { name: 'Auriculares', price: 119, category: 'audio' },
  { name: 'Monitor', price: 329, category: 'video' },
  { name: 'Altavoz', price: 75, category: 'audio' },
];

// ─── Sobrecargas: la misma función con distintas firmas ───
export function format(value: number): string;
export function format(value: Date): string;
export function format(value: number | Date): string {
  return typeof value === 'number' ? value.toFixed(2) + ' €' : value.toLocaleDateString('es');
}

// ─── async: devuelve Promise<T> ───
export async function fetchPrice(name: string): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100)); // simula una API
  return products.find((product) => product.name === name)?.price ?? 0;
}

// ▶ Demo
export default async function demo() {
  repeat(3, (index) => console.log(`Repetición ${index + 1}`));

  const counter = createCounter(10);
  counter.increment();
  console.log('Contador:', counter.increment());

  const audioTotal = products
    .filter((product) => product.category === 'audio') // Product[]
    .map((product) => product.price) // number[]
    .reduce((sum, price) => sum + price, 0); // number
  console.log('Total audio:', format(audioTotal));
  console.log('Fecha:', format(new Date('2026-10-12')));

  const price = await fetchPrice('Monitor');
  console.log('Precio desde la "API":', price);
}
