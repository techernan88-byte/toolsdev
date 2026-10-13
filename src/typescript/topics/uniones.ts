import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'uniones',
  icon: '🔀',
  title: 'Uniones y narrowing',
  description:
    'Una unión (A | B) dice que un valor puede ser de varios tipos. Para usarlo, se "estrecha" (narrowing) con typeof, in, instanceof o un type guard propio. Las uniones discriminadas son el patrón más útil de TypeScript.',
  tip: 'Usa una propiedad común (kind, status, type) para distinguir los casos y un "never" en el default del switch: si añades un caso nuevo y olvidas tratarlo, no compila.',

  snippets: [
    example('uniones/narrowing.ts', 'typeof, in, instanceof y type guards (value is T)'),
    example(
      'uniones/discriminadas.ts',
      'Uniones discriminadas y comprobación exhaustiva',
      'Formas geométricas, estados de una petición y un tipo Result sin excepciones.'
    ),
  ],
} satisfies Topic;
