// ─── Lista enlazada: cada nodo guarda un valor y una referencia al siguiente ───
// Ventaja: insertar/borrar al principio es O(1). Desventaja: acceder por índice es O(n).

class ListNode<T> {
  constructor(
    public value: T,
    public next: ListNode<T> | null = null
  ) {}
}

export class LinkedList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private length = 0;

  /** Añadir al principio. O(1) */
  prepend(value: T): this {
    this.head = new ListNode(value, this.head);
    this.tail ??= this.head;
    this.length++;
    return this;
  }

  /** Añadir al final. O(1) gracias al puntero tail */
  append(value: T): this {
    const node = new ListNode(value);
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.length++;
    return this;
  }

  /** Buscar el primero que cumpla una condición. O(n) */
  find(predicate: (value: T) => boolean): T | undefined {
    for (const value of this) if (predicate(value)) return value;
    return undefined;
  }

  /** Borrar el primero que cumpla una condición. O(n) */
  remove(predicate: (value: T) => boolean): boolean {
    let previous: ListNode<T> | null = null;
    let current = this.head;

    while (current) {
      if (predicate(current.value)) {
        if (previous) previous.next = current.next;
        else this.head = current.next;
        if (current === this.tail) this.tail = previous;
        this.length--;
        return true;
      }
      previous = current;
      current = current.next;
    }
    return false;
  }

  /** Invertir la lista "en el sitio" (pregunta clásica de entrevista). O(n) */
  reverse(): this {
    let previous: ListNode<T> | null = null;
    let current = this.head;
    this.tail = this.head;
    while (current) {
      const next: ListNode<T> | null = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }
    this.head = previous;
    return this;
  }

  get size(): number {
    return this.length;
  }

  /** Iterable: permite usar for…of y el spread [...lista] */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  toString(): string {
    return [...this].join(' → ') + ' → null';
  }
}

// ▶ Demo
export default function demo() {
  const list = new LinkedList<number>().append(2).append(3).append(4).prepend(1);
  console.log('Lista:', list.toString(), '| tamaño:', list.size);

  const firstGreaterThanTwo = list.find((n) => n > 2);
  console.log('Primer valor > 2:', firstGreaterThanTwo);

  list.remove((n) => n === 3);
  console.log('Tras borrar el 3:', list.toString());

  list.reverse();
  console.log('Invertida:', list.toString());
  console.log('Como array:', [...list]);
}
