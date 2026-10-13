// ─── Interfaces y tipos genéricos: "plantillas" de tipos ───
export interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
}

// Genérico con valor por defecto
export type Dictionary<V = string> = Record<string, V>;

// ─── Clase genérica: una caja que guarda cualquier tipo ───
export class Box<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  map<U>(transform: (value: T) => U): Box<U> {
    return new Box(transform(this.value));
  }
}

// ─── Caché genérica con expiración ───
export class Cache<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>();

  constructor(private ttlMs: number) {}

  set(key: K, value: V): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }
}

interface User {
  id: number;
  name: string;
}

export function wrap<T>(data: T, status = 200): ApiResponse<T> {
  return { data, status, timestamp: new Date().toISOString() };
}

// ▶ Demo
export default function demo() {
  const response = wrap<User[]>([{ id: 1, name: 'Ana' }]);
  console.log('ApiResponse<User[]>:', response.data, response.status);

  const page: Paginated<string> = { items: ['a', 'b'], page: 1, totalPages: 3 };
  console.log('Paginated<string>:', page);

  const labels: Dictionary = { save: 'Guardar' };
  const counts: Dictionary<number> = { visits: 120 };
  console.log(labels, counts);

  const box = new Box(21).map((n) => n * 2).map((n) => `El resultado es ${n}`);
  console.log(box.get());

  const cache = new Cache<number, User>(60_000);
  cache.set(1, { id: 1, name: 'Ana' });
  console.log('Caché:', cache.get(1), cache.get(2));
}
