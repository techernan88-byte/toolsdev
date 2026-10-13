// ─── Árbol binario de búsqueda (BST) ───
// Cada nodo: los menores a la izquierda, los mayores a la derecha.
// Buscar, insertar y borrar son O(log n) si el árbol está equilibrado.

class TreeNode<T> {
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(public value: T) {}
}

export class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;
  private count = 0;

  constructor(private compare: (a: T, b: T) => number) {}

  insert(value: T): this {
    const node = new TreeNode(value);
    this.count++;
    if (!this.root) {
      this.root = node;
      return this;
    }
    let current = this.root;
    while (true) {
      const side = this.compare(value, current.value) < 0 ? 'left' : 'right';
      const next = current[side];
      if (!next) {
        current[side] = node;
        return this;
      }
      current = next;
    }
  }

  has(value: T): boolean {
    let current = this.root;
    while (current) {
      const comparison = this.compare(value, current.value);
      if (comparison === 0) return true;
      current = comparison < 0 ? current.left : current.right;
    }
    return false;
  }

  min(): T | undefined {
    let current = this.root;
    while (current?.left) current = current.left;
    return current?.value;
  }

  max(): T | undefined {
    let current = this.root;
    while (current?.right) current = current.right;
    return current?.value;
  }

  /** Recorrido in-order (izquierda, nodo, derecha) → valores ORDENADOS */
  *inOrder(node: TreeNode<T> | null = this.root): Generator<T> {
    if (!node) return;
    yield* this.inOrder(node.left);
    yield node.value;
    yield* this.inOrder(node.right);
  }

  height(node: TreeNode<T> | null = this.root): number {
    return node ? 1 + Math.max(this.height(node.left), this.height(node.right)) : 0;
  }

  get size(): number {
    return this.count;
  }

  /** Dibujo del árbol en texto */
  print(node: TreeNode<T> | null = this.root, prefix = '', isLeft = false): string[] {
    if (!node) return [];
    return [
      ...this.print(node.right, prefix + (isLeft ? '│   ' : '    '), false),
      prefix + (isLeft ? '└── ' : '┌── ') + String(node.value),
      ...this.print(node.left, prefix + (isLeft ? '    ' : '│   '), true),
    ];
  }
}

// ▶ Demo
export default function demo() {
  const tree = new BinarySearchTree<number>((a, b) => a - b);
  [50, 30, 70, 20, 40, 60, 80, 35].forEach((n) => tree.insert(n));

  console.log(tree.print().join('\n'));
  console.log('\nOrdenado (in-order):', [...tree.inOrder()]);
  console.log('min:', tree.min(), '| max:', tree.max(), '| altura:', tree.height(), '| tamaño:', tree.size);
  console.log('¿tiene 60?', tree.has(60), '| ¿tiene 65?', tree.has(65));

  // Funciona con cualquier tipo gracias al comparador
  const words = new BinarySearchTree<string>((a, b) => a.localeCompare(b));
  ['mango', 'kiwi', 'uva', 'fresa', 'pera'].forEach((word) => words.insert(word));
  console.log('Palabras ordenadas:', [...words.inOrder()]);
}
