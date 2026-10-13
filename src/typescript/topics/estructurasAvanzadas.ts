import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'estructuras-avanzadas',
  icon: '🌳',
  title: 'Estructuras: árboles, heaps y grafos',
  description:
    'Estructuras no lineales: árbol binario de búsqueda, montículo (cola de prioridad), caché LRU y grafo con los algoritmos BFS, DFS y Dijkstra para calcular rutas.',
  tip: '¿Cuál uso? Buscar por clave → Map. Elementos únicos → Set. Siempre el "más prioritario" → heap. Datos ordenados con inserciones frecuentes → árbol. Relaciones entre elementos → grafo.',

  snippets: [
    example(
      'estructuras/arbolBinario.ts',
      'Árbol binario de búsqueda (BST)',
      'Insertar, buscar, recorrer en orden y dibujar el árbol.'
    ),
    example(
      'estructuras/heap.ts',
      'Montículo / cola de prioridad',
      'Urgencias de un hospital y "top K" de una lista enorme.'
    ),
    example('estructuras/lru.ts', 'Caché LRU con Map'),
    example(
      'estructuras/grafo.ts',
      'Grafo: BFS, DFS y Dijkstra',
      'Rutas entre ciudades: menos escalas vs. menos kilómetros.'
    ),
  ],
} satisfies Topic;
