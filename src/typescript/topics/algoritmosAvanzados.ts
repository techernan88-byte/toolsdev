import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'algoritmos-avanzados',
  icon: '⚡',
  title: 'Algoritmos eficientes',
  description:
    'Ordenaciones O(n log n) (merge sort y quick sort) con una comparación de tiempos real, y las técnicas que más se usan en entrevistas y en el trabajo: memoización, hash maps, dos punteros, ventana deslizante y recursión.',
  tip: 'Antes de escribir dos bucles anidados (O(n²)), pregúntate si un Map o un Set te permite hacerlo en una sola pasada (O(n)).',

  snippets: [
    example(
      'algoritmos/ordenacion.ts',
      'Merge sort y quick sort (con medición de tiempos)',
      'Pulsa ▶ Ejecutar y compara burbuja O(n²) con los algoritmos O(n log n).'
    ),
    example('algoritmos/tecnicas.ts', 'Técnicas: memoización, hash map, dos punteros, ventana deslizante'),
  ],
} satisfies Topic;
