import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'genericos',
  icon: '🧬',
  title: 'Genéricos',
  description:
    'Los genéricos (<T>) son "parámetros de tipo": permiten escribir funciones, interfaces y clases reutilizables que funcionan con cualquier tipo SIN perder la información del tipo concreto.',
  tip: 'Usa "extends" para restringir qué tipos acepta un genérico (T extends { length: number }) y "keyof" para aceptar solo claves que existen.',

  snippets: [
    example('genericos/funciones.ts', 'Funciones genéricas: first, groupBy, uniqueBy, keyof'),
    example(
      'genericos/tiposGenericos.ts',
      'Interfaces y clases genéricas: ApiResponse<T>, Box<T>, Cache<K, V>'
    ),
  ],
} satisfies Topic;
