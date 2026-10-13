// ─── Pila (Stack): el último en entrar es el primero en salir (LIFO) ───
// Usos: deshacer/rehacer, historial del navegador, comprobar paréntesis, recursión.

export class Stack<T> {
  private items: T[] = [];

  /** Añade arriba. O(1) */
  push(item: T): void {
    this.items.push(item);
  }

  /** Saca el de arriba. O(1) */
  pop(): T | undefined {
    return this.items.pop();
  }

  /** Mira el de arriba sin sacarlo. O(1) */
  peek(): T | undefined {
    return this.items.at(-1);
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

/** ¿Están bien cerrados los paréntesis, corchetes y llaves? */
export function isBalanced(code: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack = new Stack<string>();

  for (const char of code) {
    if ('([{'.includes(char)) stack.push(char);
    else if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.isEmpty();
}

/** Editor con deshacer / rehacer usando dos pilas */
export class TextEditor {
  private undoStack = new Stack<string>();
  private redoStack = new Stack<string>();
  text = '';

  write(newText: string): void {
    this.undoStack.push(this.text);
    this.text += newText;
    this.redoStack = new Stack(); // escribir borra el "rehacer"
  }

  undo(): void {
    const previous = this.undoStack.pop();
    if (previous === undefined) return;
    this.redoStack.push(this.text);
    this.text = previous;
  }

  redo(): void {
    const next = this.redoStack.pop();
    if (next === undefined) return;
    this.undoStack.push(this.text);
    this.text = next;
  }
}

// ▶ Demo
export default function demo() {
  const stack = new Stack<number>();
  [1, 2, 3].forEach((n) => stack.push(n));
  console.log('Pila:', stack.toArray(), '| arriba:', stack.peek());
  console.log('pop →', stack.pop(), '| queda:', stack.toArray());

  for (const code of ['{ [ (a + b) ] }', '( [ ) ]', 'if (x) { y[0] }', '((']) {
    console.log(isBalanced(code) ? '✅' : '❌', code);
  }

  const editor = new TextEditor();
  editor.write('Hola');
  editor.write(' mundo');
  editor.write('!!!');
  console.log('Texto:', editor.text);
  editor.undo();
  console.log('Deshacer:', editor.text);
  editor.undo();
  console.log('Deshacer:', editor.text);
  editor.redo();
  console.log('Rehacer:', editor.text);
}
