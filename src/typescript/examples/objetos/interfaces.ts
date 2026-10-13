// ─── interface: describe la forma de un objeto ───
export interface User {
  readonly id: number; // no se puede cambiar después de crearlo
  name: string;
  email: string;
  age?: number; // opcional → number | undefined
  address: {
    city: string;
    zip: string;
  };
}

// ─── Extender una interface ───
export interface Admin extends User {
  permissions: string[];
}

// ─── Index signature: claves dinámicas ───
export interface Translations {
  [key: string]: string;
}

// ─── Métodos dentro de una interface ───
export interface Counter {
  value: number;
  increment(step?: number): void;
}

export const ana: User = {
  id: 1,
  name: 'Ana',
  email: 'ana@mail.com',
  address: { city: 'Madrid', zip: '28013' },
};

export const boss: Admin = { ...ana, id: 2, name: 'Marta', permissions: ['users:write', 'billing:read'] };

export const es: Translations = { hello: 'hola', bye: 'adiós' };

export const counter: Counter = {
  value: 0,
  increment(step = 1) {
    this.value += step;
  },
};

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  // @ts-expect-error → Cannot assign to 'id' because it is a read-only property
  ana.id = 99;

  // @ts-expect-error → Property 'email' is missing (falta una propiedad obligatoria)
  const incomplete: User = { id: 3, name: 'Luis', address: { city: 'Lima', zip: '15001' } };
  return incomplete;
}

// ▶ Demo
export default function demo() {
  console.log(ana);
  console.log('Edad:', ana.age ?? 'no indicada', '| ciudad:', ana.address.city);
  console.log('Admin:', boss.name, boss.permissions);
  console.log('Traducción:', es['hello'], es.bye);
  counter.increment();
  counter.increment(5);
  console.log('Contador:', counter.value);
}
