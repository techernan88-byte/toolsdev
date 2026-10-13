// ─── Técnicas que convierten soluciones O(n²) o exponenciales en O(n) ───

/** 1. MEMOIZACIÓN: guardar resultados ya calculados (Fibonacci sin memo es O(2ⁿ)) */
export function memoize<A extends PropertyKey, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new Map<A, R>();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg)!;
  };
}

export const fibonacci: (n: number) => number = memoize((n: number): number =>
  n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
);

/** 2. HASH MAP: "Two Sum" — índices de dos números que suman target. O(n) en vez de O(n²) */
export function twoSum(numbers: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // valor → índice
  for (let i = 0; i < numbers.length; i++) {
    const needed = target - numbers[i]!;
    if (seen.has(needed)) return [seen.get(needed)!, i];
    seen.set(numbers[i]!, i);
  }
  return null;
}

/** 3. CONTADOR DE FRECUENCIAS: ¿son anagramas? O(n) */
export function areAnagrams(a: string, b: string): boolean {
  const normalize = (text: string) => text.toLowerCase().replace(/\s/g, '');
  const [first, second] = [normalize(a), normalize(b)];
  if (first.length !== second.length) return false;

  const counts = new Map<string, number>();
  for (const char of first) counts.set(char, (counts.get(char) ?? 0) + 1);
  for (const char of second) {
    const count = counts.get(char);
    if (!count) return false;
    counts.set(char, count - 1);
  }
  return true;
}

/** 4. DOS PUNTEROS: pares que suman target en un array ORDENADO. O(n) */
export function pairsWithSum(sorted: number[], target: number): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left]! + sorted[right]!;
    if (sum === target) pairs.push([sorted[left++]!, sorted[right--]!]);
    else if (sum < target) left++;
    else right--;
  }
  return pairs;
}

/** 5. VENTANA DESLIZANTE: subcadena más larga sin caracteres repetidos. O(n) */
export function longestUniqueSubstring(text: string): string {
  const lastSeen = new Map<string, number>();
  let start = 0;
  let best = '';
  for (let end = 0; end < text.length; end++) {
    const char = text[end]!;
    if ((lastSeen.get(char) ?? -1) >= start) start = lastSeen.get(char)! + 1; // mover la ventana
    lastSeen.set(char, end);
    if (end - start + 1 > best.length) best = text.slice(start, end + 1);
  }
  return best;
}

/** 6. RECURSIÓN: todas las permutaciones de un array */
export function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest])
  );
}

// ▶ Demo
export default function demo() {
  const start = performance.now();
  // Sin memo, fibonacci(75) haría billones de llamadas; con memo, solo 76.
  // (Por encima de fibonacci(78) se supera Number.MAX_SAFE_INTEGER y se pierde precisión: usa bigint)
  const fib75 = fibonacci(75);
  const elapsedMs = (performance.now() - start).toFixed(2);
  console.log('fibonacci(75):', fib75, `(${elapsedMs} ms con memo)`);

  console.log('twoSum([2,7,11,15], 9):', twoSum([2, 7, 11, 15], 9));

  const anagramChecks = [areAnagrams('Roma', 'amor'), areAnagrams('hola', 'halo'), areAnagrams('ts', 'js')];
  console.log('anagramas (Roma/amor, hola/halo, ts/js):', anagramChecks);

  console.log('pares que suman 10:', pairsWithSum([1, 2, 3, 4, 6, 7, 8, 9], 10));
  console.log('subcadena única más larga:', longestUniqueSubstring('abcabcbbxyzw'));

  const words = permutations(['a', 'b', 'c']).map((letters) => letters.join(''));
  console.log('permutaciones de [a,b,c]:', words);
}
