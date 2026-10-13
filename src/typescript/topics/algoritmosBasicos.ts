import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'algoritmos-basicos',
  icon: '🧩',
  title: 'Algoritmos básicos',
  description:
    'Ejercicios clásicos para practicar lógica y tipos: FizzBuzz, palíndromos, primos, factorial… y los primeros algoritmos de búsqueda y ordenación, escritos de forma genérica para que sirvan con cualquier tipo de dato.',
  tip: 'La notación Big O mide cómo crece el tiempo según el tamaño de la entrada (n). Para 1.000.000 de elementos: O(log n) ≈ 20 pasos, O(n) = 1 millón, O(n²) = 1 billón.',

  snippets: [
    {
      title: 'Resumen rápido de complejidad (Big O)',
      lang: 'text',
      code: `O(1)        constante     acceder a array[i], Map.get, Set.has, push/pop
O(log n)    logarítmica   búsqueda binaria, operaciones en árboles equilibrados y heaps
O(n)        lineal        recorrer un array, buscar sin orden, contar elementos
O(n log n)  lineal-log    buenos algoritmos de ordenación: merge sort, quick sort, Array.sort
O(n²)       cuadrática    dos bucles anidados: burbuja, comparar todos con todos
O(2ⁿ)       exponencial   probar todas las combinaciones, Fibonacci recursivo sin memo

Truco: un bucle → O(n) · un bucle dentro de otro → O(n²) · partir a la mitad en cada paso → O(log n)`,
    },
    example('algoritmos/basicos.ts', 'Clásicos: FizzBuzz, palíndromo, primos, factorial, chunk…'),
    example(
      'algoritmos/busqueda.ts',
      'Búsqueda lineal y binaria, ordenación burbuja e inserción',
      'Genéricos con un comparador: ordenan números, textos u objetos.'
    ),
  ],
} satisfies Topic;
