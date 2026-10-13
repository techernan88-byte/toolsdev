// ─── Tipos primitivos: se escribe ": tipo" después del nombre ───
export const userName: string = 'Ada';
export const age: number = 36; // enteros y decimales son "number"
export const isAdmin: boolean = true;
export const bigNumber: bigint = 9_007_199_254_740_993n;
export const nothing: null = null;
export const notDefined: undefined = undefined;

// ─── Inferencia: si das un valor inicial, TS deduce el tipo solo ───
export let city = 'Madrid'; // string (inferido)

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  city = 'Lima'; // ✅
  // @ts-expect-error → Type 'number' is not assignable to type 'string'
  city = 42;
}

// ─── Arrays ───
export const scores: number[] = [9, 7.5, 10];
export const names: Array<string> = ['Ana', 'Luis']; // forma equivalente
export const matrix: number[][] = [
  [1, 2],
  [3, 4],
];

// ─── Tuplas: arrays de longitud y tipos fijos ───
export const point: [number, number] = [40.4, -3.7];
export const entry: [string, number] = ['manzanas', 3];
export const rgb: readonly [number, number, number] = [255, 128, 0];

// ─── Tipos literales: solo ESE valor exacto ───
export const direction: 'up' | 'down' = 'up';
export const PI = 3.1416; // const → su tipo es el literal 3.1416

// ▶ Demo
export default function demo() {
  console.log('Usuario:', userName, '| edad:', age, '| admin:', isAdmin);
  console.log('typeof:', typeof userName, typeof age, typeof isAdmin, typeof bigNumber);
  console.log('Media de notas:', scores.reduce((sum, score) => sum + score, 0) / scores.length);
  console.log('Matriz:', matrix, '| punto:', point);

  const [fruit, quantity] = entry; // desestructurar una tupla
  console.log(`Tengo ${quantity} ${fruit}`);
  console.log('Color RGB:', rgb, '| dirección:', direction, '| PI:', PI);
}
