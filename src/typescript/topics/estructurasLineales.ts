import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'estructuras-lineales',
  icon: '📚',
  title: 'Estructuras: pila, cola y lista',
  description:
    'Estructuras de datos lineales implementadas como clases genéricas: Stack<T> (pila, LIFO), Queue<T> (cola, FIFO) y LinkedList<T> (lista enlazada), con casos prácticos como deshacer/rehacer o una cola de tareas.',
  tip: 'En JavaScript un array ya funciona como pila (push/pop). Pero como cola, shift() es O(n): para colas grandes usa una implementación con punteros como la de aquí.',

  snippets: [
    example('estructuras/pila.ts', 'Pila (Stack): paréntesis balanceados y deshacer / rehacer'),
    example('estructuras/cola.ts', 'Cola (Queue): procesar tareas por orden de llegada'),
    example('estructuras/listaEnlazada.ts', 'Lista enlazada: insertar, borrar, invertir e iterar con for…of'),
  ],
} satisfies Topic;
