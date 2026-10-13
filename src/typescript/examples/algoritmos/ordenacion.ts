// ─── Ordenaciones eficientes: O(n log n) ───
export type Comparator<T> = (a: T, b: T) => number;

/** Merge sort: divide en mitades, ordena cada una y las mezcla. O(n log n) siempre, estable */
export function mergeSort<T>(items: T[], compare: Comparator<T>): T[] {
  if (items.length <= 1) return items;

  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle), compare);
  const right = mergeSort(items.slice(middle), compare);

  // Mezclar dos arrays ya ordenados
  const merged: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    merged.push(compare(left[i]!, right[j]!) <= 0 ? left[i++]! : right[j++]!);
  }
  return [...merged, ...left.slice(i), ...right.slice(j)];
}

/** Quick sort: elige un pivote y separa menores / mayores. O(n log n) de media */
export function quickSort<T>(items: T[], compare: Comparator<T>): T[] {
  if (items.length <= 1) return items;

  const pivot = items[Math.floor(items.length / 2)]!;
  const smaller = items.filter((item) => compare(item, pivot) < 0);
  const equal = items.filter((item) => compare(item, pivot) === 0);
  const bigger = items.filter((item) => compare(item, pivot) > 0);

  return [...quickSort(smaller, compare), ...equal, ...quickSort(bigger, compare)];
}

/** Burbuja, para comparar tiempos con un algoritmo O(n²) */
export function bubbleSort<T>(items: T[], compare: Comparator<T>): T[] {
  const result = [...items];
  for (let end = result.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      if (compare(result[i]!, result[i + 1]!) > 0) [result[i], result[i + 1]] = [result[i + 1]!, result[i]!];
    }
  }
  return result;
}

function measure(label: string, sort: () => unknown): void {
  const start = performance.now();
  sort();
  console.log(`${label.padEnd(18)} ${(performance.now() - start).toFixed(1).padStart(7)} ms`);
}

// ▶ Demo
export default function demo() {
  const ascending: Comparator<number> = (a, b) => a - b;
  const descending: Comparator<number> = (a, b) => b - a;

  const small = [38, 27, 43, 3, 9, 82, 10];
  console.log('mergeSort:', mergeSort(small, ascending));
  console.log('quickSort desc:', quickSort(small, descending));

  const people = [
    { name: 'Luis', age: 30 },
    { name: 'Ana', age: 25 },
    { name: 'Marta', age: 30 },
  ];
  // Merge sort es ESTABLE: Luis sigue antes que Marta (tienen la misma edad)
  const namesByAge = mergeSort(people, (a, b) => a.age - b.age).map((person) => person.name);
  console.log('Por edad (estable):', namesByAge);

  const big = Array.from({ length: 5000 }, () => Math.floor(Math.random() * 100_000));
  console.log(`\nOrdenando ${big.length} números aleatorios:`);
  measure('bubbleSort O(n²)', () => bubbleSort(big, ascending));
  measure('mergeSort', () => mergeSort(big, ascending));
  measure('quickSort', () => quickSort(big, ascending));
  measure('Array.sort nativo', () => [...big].sort(ascending));
}
