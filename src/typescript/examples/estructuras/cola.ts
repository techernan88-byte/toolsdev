// ─── Cola (Queue): el primero en entrar es el primero en salir (FIFO) ───
// Usos: tareas pendientes, impresoras, colas de mensajes, recorrido BFS de grafos.

export class Queue<T> {
  // Objeto + punteros: enqueue y dequeue son O(1)
  // (array.shift() sería O(n) porque mueve todos los elementos)
  private items: Record<number, T> = {};
  private head = 0;
  private tail = 0;

  /** Añade al final. O(1) */
  enqueue(item: T): void {
    this.items[this.tail++] = item;
  }

  /** Saca el primero. O(1) */
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head];
    delete this.items[this.head++];
    return item;
  }

  peek(): T | undefined {
    return this.items[this.head];
  }

  get size(): number {
    return this.tail - this.head;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}

// ─── Caso práctico: procesar tareas por orden de llegada ───
export interface Job {
  id: number;
  type: 'email' | 'pdf' | 'thumbnail';
  durationMs: number;
}

export function processJobs(jobs: Job[]): void {
  const queue = new Queue<Job>();
  jobs.forEach((job) => queue.enqueue(job));
  console.log(`📥 ${queue.size} tareas en cola`);

  let clock = 0;
  while (!queue.isEmpty()) {
    const job = queue.dequeue()!;
    clock += job.durationMs;
    console.log(
      `⚙️  t=${String(clock).padStart(4)}ms  tarea #${job.id} (${job.type}) · quedan ${queue.size}`
    );
  }
}

// ▶ Demo
export default function demo() {
  const queue = new Queue<string>();
  queue.enqueue('Ana');
  queue.enqueue('Luis');
  queue.enqueue('Marta');
  console.log('Primero en la fila:', queue.peek(), '| tamaño:', queue.size);
  console.log('Atendido:', queue.dequeue(), '| siguiente:', queue.peek());

  processJobs([
    { id: 1, type: 'email', durationMs: 120 },
    { id: 2, type: 'pdf', durationMs: 900 },
    { id: 3, type: 'thumbnail', durationMs: 300 },
    { id: 4, type: 'email', durationMs: 110 },
  ]);
}
