// ─── Parámetros y valor de retorno ───
export function add(a: number, b: number): number {
  return a + b;
}

// ─── Opcionales (?) y con valor por defecto ───
export function greet(name: string, greeting = 'Hola', emoji?: string): string {
  return `${greeting}, ${name}${emoji ? ' ' + emoji : ''}`;
}

// ─── Rest: número variable de argumentos ───
export function sumAll(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

// ─── Arrow functions ───
export const double = (n: number): number => n * 2;
export const isEven = (n: number) => n % 2 === 0; // retorno inferido: boolean

// ─── Parámetro con objeto desestructurado ───
export function createUser({ name, role = 'user' }: { name: string; role?: 'user' | 'admin' }) {
  return { id: crypto.randomUUID().slice(0, 8), name, role };
}

// ─── void (no devuelve nada) y never (nunca termina: lanza o bucle infinito) ───
export function log(message: string): void {
  console.log(`[log] ${message}`);
}

export function fail(message: string): never {
  throw new Error(message);
}

// ─── Tipo de una función ───
export type MathOperation = (a: number, b: number) => number;

export const operations: Record<string, MathOperation> = {
  '+': (a, b) => a + b, // a y b se infieren como number
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? fail('División entre cero') : a / b),
};

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  // @ts-expect-error → Expected 2 arguments, but got 1
  add(1);
  // @ts-expect-error → Argument of type 'string' is not assignable to parameter of type 'number'
  double('4');
}

// ▶ Demo
export default function demo() {
  console.log(add(2, 3), greet('Ana'), greet('Luis', 'Buenas', '👋'));
  console.log('sumAll:', sumAll(1, 2, 3, 4), '| double:', double(21), '| isEven(7):', isEven(7));
  console.log(createUser({ name: 'Marta', role: 'admin' }));
  log('Mensaje sin valor de retorno');

  for (const [symbol, operation] of Object.entries(operations)) {
    console.log(`12 ${symbol} 4 =`, operation(12, 4));
  }
  try {
    operations['÷']?.(1, 0);
  } catch (error) {
    console.log('never lanzó:', (error as Error).message);
  }
}
