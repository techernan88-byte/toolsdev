import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'objetos',
  icon: '📦',
  title: 'Objetos: interface y type',
  description:
    'interface y type describen la forma de un objeto: qué propiedades tiene, de qué tipo, cuáles son opcionales (?) o de solo lectura (readonly). Además: enums, "as const" y "satisfies".',
  tip: 'Regla práctica: interface para objetos y clases; type para uniones, tuplas, funciones y tipos calculados. Ambos sirven para objetos.',

  snippets: [
    example('objetos/interfaces.ts', 'interface: opcionales, readonly, extends e index signatures'),
    example('objetos/typeAlias.ts', 'type: alias, intersecciones (&) y type vs interface'),
    example(
      'objetos/asConst.ts',
      'enum, as const y satisfies',
      'as const convierte un objeto o array en constantes con tipos exactos.'
    ),
  ],
} satisfies Topic;
