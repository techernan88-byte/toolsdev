// ─── Búsqueda y ordenación sencillas (genéricas: sirven para cualquier tipo) ───

/** Función que compara dos elementos: negativo si a va antes, positivo si va después, 0 si iguales */
export type Comparator<T> = (a: T, b: T) => number;

export const ascending: Comparator<number> = (a, b) => a - b;

/** Búsqueda lineal: recorre uno a uno. O(n) — funciona aunque el array no esté ordenado */
export function linearSearch<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i]!)) return i;
  }
  return -1;
}

/** Búsqueda binaria: parte el array por la mitad en cada paso. O(log n) — requiere array ORDENADO */
export function binarySearch<T>(sorted: T[], target: T, compare: Comparator<T>): number {
  let low = 0;
  let high = sorted.length - 1;
  let steps = 0;

  while (low <= high) {
    steps++;
    const middle = Math.floor((low + high) / 2);
    const comparison = compare(sorted[middle]!, target);
    if (comparison === 0) {
      console.log(`  (encontrado en ${steps} pasos)`);
      return middle;
    }
    if (comparison < 0) {
      low = middle + 1; // el objetivo está en la mitad derecha
    } else {
      high = middle - 1; // el objetivo está en la mitad izquierda
    }
  }
  return -1;
}

/** Ordenación burbuja: intercambia vecinos desordenados. O(n²) — didáctico, no usar en producción */
export function bubbleSort<T>(items: T[], compare: Comparator<T>): T[] {
  const result = [...items]; // no mutar el original
  for (let end = result.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      if (compare(result[i]!, result[i + 1]!) > 0) {
        [result[i], result[i + 1]] = [result[i + 1]!, result[i]!]; // intercambio
        swapped = true;
      }
    }
    if (!swapped) break; // ya estaba ordenado
  }
  return result;
}

/** Ordenación por inserción: como ordenar cartas en la mano. O(n²), pero rápida en arrays casi ordenados */
export function insertionSort<T>(items: T[], compare: Comparator<T>): T[] {
  const result = [...items];
  for (let i = 1; i < result.length; i++) {
    const current = result[i]!;
    let j = i - 1;
    while (j >= 0 && compare(result[j]!, current) > 0) {
      result[j + 1] = result[j]!;
      j--;
    }
    result[j + 1] = current;
  }
  return result;
}

interface Product {
  name: string;
  price: number;
}

// ▶ Demo
export default function demo() {
  const numbers = [42, 7, 19, 3, 88, 25, 61];
  console.log('Original:', numbers);
  console.log('Burbuja:', bubbleSort(numbers, ascending));

  const descending: Comparator<number> = (a, b) => b - a;
  console.log('Inserción (descendente):', insertionSort(numbers, descending));

  const products: Product[] = [
    { name: 'Monitor', price: 329 },
    { name: 'Ratón', price: 39 },
    { name: 'Teclado', price: 89 },
  ];
  const byPrice = bubbleSort(products, (a, b) => a.price - b.price);
  const labels = byPrice.map((product) => `${product.name} ${product.price}€`);
  console.log('Productos por precio:', labels);

  const keyboardIndex = linearSearch(products, (product) => product.name === 'Teclado');
  console.log('Lineal "Teclado" → índice', keyboardIndex);

  const sorted = Array.from({ length: 1000 }, (_, i) => i * 2); // 0, 2, 4 … 1998
  console.log('Binaria 1234 en 1000 elementos:');
  console.log('  → índice', binarySearch(sorted, 1234, ascending));
}
