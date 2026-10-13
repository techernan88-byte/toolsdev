// ─── Unión (|): el valor puede ser de uno de varios tipos ───
export type Id = string | number;

// "Narrowing": comprobar el tipo para usar sus métodos con seguridad
export function describeId(id: Id): string {
  if (typeof id === 'string') {
    return `id de texto en mayúsculas: ${id.toUpperCase()}`; // aquí id: string
  }
  return `id numérico con 2 decimales: ${id.toFixed(2)}`; // aquí id: number
}

// ─── in: comprobar si existe una propiedad ───
export type Cat = { name: string; meow: () => string };
export type Dog = { name: string; bark: () => string };

export function speak(animal: Cat | Dog): string {
  return 'meow' in animal ? animal.meow() : animal.bark();
}

// ─── instanceof: comprobar clases ───
export function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

// ─── Type guard propio: "value is Tipo" ───
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// ─── Comprobar truthiness (null, undefined, '', 0) ───
export function initials(name?: string | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
}

// ▶ Demo
export default function demo() {
  console.log(describeId('abc-123'));
  console.log(describeId(42));
  console.log(speak({ name: 'Michi', meow: () => 'Miau 🐱' }));
  console.log(speak({ name: 'Rex', bark: () => 'Guau 🐶' }));
  console.log(toDate('2026-10-12').getFullYear());

  const mixed: unknown[] = ['hola', 1, 'mundo', null, true];
  const strings = mixed.filter(isString); // string[] gracias al type guard
  console.log('Solo strings:', strings);

  const maybe = [1, null, 2, undefined, 3];
  const numbers: number[] = maybe.filter(isDefined);
  console.log('Sin nulos:', numbers);
  console.log(initials('Ada Lovelace'), initials(null));
}
