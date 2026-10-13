// ─── Caché LRU (Least Recently Used) ───
// Guarda como máximo N elementos; al llenarse, expulsa el que lleva MÁS tiempo sin usarse.
// Map recuerda el orden de inserción, así que get y set son O(1).
// Usos: cachés de API, de imágenes, de consultas a la base de datos…

export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  hits = 0;
  misses = 0;

  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      this.misses++;
      return undefined;
    }
    // Volver a insertarlo lo convierte en el "más reciente"
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    this.hits++;
    return value;
  }

  set(key: K, value: V): void {
    this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldest = this.cache.keys().next().value!; // el primero = el menos usado
      this.cache.delete(oldest);
      console.log(`  🗑️  expulsado: ${String(oldest)}`);
    }
  }

  keys(): K[] {
    return [...this.cache.keys()]; // de menos a más reciente
  }
}

/** Envuelve una función lenta con una caché LRU */
export function withLRU<A, R>(fn: (arg: A) => R, capacity: number) {
  const cache = new LRUCache<A, R>(capacity);
  const cached = (arg: A): R => {
    const hit = cache.get(arg);
    if (hit !== undefined) return hit;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
  return Object.assign(cached, { stats: () => ({ hits: cache.hits, misses: cache.misses }) });
}

// ▶ Demo
export default function demo() {
  const cache = new LRUCache<string, string>(3);
  cache.set('a', 'Ana');
  cache.set('b', 'Luis');
  cache.set('c', 'Marta');
  console.log('Contenido:', cache.keys());

  cache.get('a'); // "a" pasa a ser el más reciente
  console.log('Tras leer "a":', cache.keys());

  console.log('Añado "d" (la caché está llena):');
  cache.set('d', 'Carlos'); // expulsa "b", el menos usado
  console.log('Contenido:', cache.keys());

  // Simulación: una "API" lenta con caché
  const slowSquare = (n: number) => {
    let result = 0;
    for (let i = 0; i < 2_000_000; i++) result = n * n;
    return result;
  };
  const fastSquare = withLRU(slowSquare, 2);
  [4, 4, 5, 4, 6, 4].forEach((n) => fastSquare(n));
  console.log('Estadísticas de la caché:', fastSquare.stats());
}
