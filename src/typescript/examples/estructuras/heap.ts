// ─── Montículo (heap) / Cola de prioridad ───
// Siempre sabe cuál es el elemento más prioritario. Insertar y sacar: O(log n).
// Se guarda en un array: los hijos del índice i están en 2i+1 y 2i+2.

export class PriorityQueue<T> {
  private heap: T[] = [];

  /** compare(a, b) < 0 significa que "a" tiene MÁS prioridad que "b" */
  constructor(private compare: (a: T, b: T) => number) {}

  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  /** Saca el más prioritario */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index]!, this.heap[parent]!) >= 0) break;
      this.swap(index, parent);
      index = parent;
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let best = index;
      if (left < length && this.compare(this.heap[left]!, this.heap[best]!) < 0) best = left;
      if (right < length && this.compare(this.heap[right]!, this.heap[best]!) < 0) best = right;
      if (best === index) return;
      this.swap(index, best);
      index = best;
    }
  }

  private swap(a: number, b: number): void {
    [this.heap[a], this.heap[b]] = [this.heap[b]!, this.heap[a]!];
  }
}

// ─── Caso práctico: urgencias de un hospital ───
interface Patient {
  name: string;
  severity: 1 | 2 | 3 | 4 | 5; // 5 = más grave
  arrival: number;
}

/** Los k números más grandes de una lista enorme sin ordenarla entera. O(n log k) */
export function topK(numbers: number[], k: number): number[] {
  const minHeap = new PriorityQueue<number>((a, b) => a - b);
  for (const n of numbers) {
    minHeap.push(n);
    if (minHeap.size > k) minHeap.pop(); // descarta el menor
  }
  const result: number[] = [];
  while (minHeap.size) result.unshift(minHeap.pop()!);
  return result;
}

// ▶ Demo
export default function demo() {
  // Más grave primero; si empatan, el que llegó antes
  const er = new PriorityQueue<Patient>((a, b) => b.severity - a.severity || a.arrival - b.arrival);
  er.push({ name: 'Ana', severity: 2, arrival: 1 });
  er.push({ name: 'Luis', severity: 5, arrival: 2 });
  er.push({ name: 'Marta', severity: 3, arrival: 3 });
  er.push({ name: 'Carlos', severity: 5, arrival: 4 });
  er.push({ name: 'Lucía', severity: 1, arrival: 5 });

  console.log('🏥 Orden de atención:');
  while (er.size) {
    const patient = er.pop()!;
    console.log(`  ${'🔴'.repeat(patient.severity).padEnd(10)} ${patient.name} (llegó ${patient.arrival}º)`);
  }

  const scores = Array.from({ length: 10_000 }, () => Math.floor(Math.random() * 1_000_000));
  console.log('Top 5 de 10.000 puntuaciones:', topK(scores, 5));
}
