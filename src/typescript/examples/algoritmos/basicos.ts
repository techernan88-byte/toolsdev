// ─── Algoritmos básicos: los clásicos de las entrevistas y los ejercicios ───

/** FizzBuzz: múltiplos de 3 → Fizz, de 5 → Buzz, de ambos → FizzBuzz. O(n) */
export function fizzBuzz(n: number): string[] {
  const result: string[] = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(String(i));
  }
  return result;
}

/** Invertir un texto. O(n) */
export function reverse(text: string): string {
  return [...text].reverse().join(''); // [...text] respeta los emojis
}

/** ¿Palíndromo? (se lee igual al revés) ignorando espacios, tildes y mayúsculas. O(n) */
export function isPalindrome(text: string): boolean {
  const clean = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return clean === reverse(clean);
}

/** Máximo de un array sin Math.max. O(n) */
export function max(numbers: number[]): number | undefined {
  if (numbers.length === 0) return undefined;
  let biggest = numbers[0]!;
  for (const n of numbers) if (n > biggest) biggest = n;
  return biggest;
}

/** Contar cuántas veces aparece cada elemento. O(n) */
export function countOccurrences<T>(items: T[]): Map<T, number> {
  const counts = new Map<T, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return counts;
}

/** Factorial recursivo: n! = n × (n-1)! */
export function factorial(n: number): number {
  if (n < 0) throw new Error('No existe el factorial de un negativo');
  return n <= 1 ? 1 : n * factorial(n - 1);
}

/** ¿Es primo? Solo hace falta probar divisores hasta √n. O(√n) */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    if (n % divisor === 0) return false;
  }
  return true;
}

/** Dividir un array en trozos de tamaño fijo. O(n) */
export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

// ▶ Demo
export default function demo() {
  console.log('FizzBuzz(15):', fizzBuzz(15).join(' '));
  console.log('reverse:', reverse('TypeScript 🚀'));
  console.log('palíndromo:', isPalindrome('Anita lava la tina'), isPalindrome('Hola'));
  console.log('max:', max([3, 17, 8, -2]), max([]));
  console.log('ocurrencias:', countOccurrences(['ts', 'js', 'ts', 'py', 'ts']));
  console.log('5! =', factorial(5));
  console.log('primos < 30:', Array.from({ length: 30 }, (_, i) => i).filter(isPrime));
  console.log('chunk:', chunk([1, 2, 3, 4, 5, 6, 7], 3));
}
