// ─── Mapped types: crear un tipo recorriendo las claves de otro ───
export interface Product {
  name: string;
  price: number;
  inStock: boolean;
}

// Así están hechos Partial, Readonly…:
export type MyPartial<T> = { [K in keyof T]?: T[K] };
export type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Cambiar el tipo de todos los valores: un formulario donde todo llega como texto
export type FormFields<T> = { [K in keyof T]: string };

// Un error de validación por campo
export type FieldErrors<T> = { [K in keyof T]?: string[] };

// ─── Template literal types: generar nombres de claves ───
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// { getName: () => string; getPrice: () => number; getInStock: () => boolean }

export type EventName<T> = `${string & keyof T}Changed`; // 'nameChanged' | 'priceChanged' | ...

export type CssSize = `${number}${'px' | 'rem' | '%'}`;

// ─── Filtrar claves por el tipo de su valor ───
export type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
export type NumericKeys = KeysOfType<Product, number>; // 'price'

// Implementación real que usa estos tipos
export function createGetters<T extends object>(obj: T): Getters<T> {
  const getters: Record<string, () => unknown> = {};
  for (const key of Object.keys(obj) as Array<keyof T & string>) {
    getters[`get${key[0]!.toUpperCase()}${key.slice(1)}`] = () => obj[key];
  }
  return getters as Getters<T>;
}

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  // @ts-expect-error → '10em' no encaja con `${number}px|rem|%`
  const size: CssSize = '10em';
  // @ts-expect-error → 'stockChanged' no es un EventName<Product>
  const event: EventName<Product> = 'stockChanged';
  return [size, event];
}

// ▶ Demo
export default function demo() {
  const keyboard: Product = { name: 'Teclado', price: 89.9, inStock: true };

  const getters = createGetters(keyboard);
  console.log('getName():', getters.getName(), '| getPrice():', getters.getPrice());

  const form: FormFields<Product> = { name: 'Ratón', price: '39.5', inStock: 'true' };
  const errors: FieldErrors<Product> = { price: ['Debe ser mayor que 40'] };
  console.log('Formulario:', form, '| errores:', errors);

  const event: EventName<Product> = 'priceChanged';
  const width: CssSize = '100%';
  const numericKey: NumericKeys = 'price';
  console.log(event, width, numericKey);
}
