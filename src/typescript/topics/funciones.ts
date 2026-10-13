import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'funciones',
  icon: '🧮',
  title: 'Funciones tipadas',
  description:
    'Se tipan los parámetros y, opcionalmente, el valor de retorno. Parámetros opcionales, por defecto y rest; tipos de función para callbacks; void y never; sobrecargas y funciones async que devuelven Promise<T>.',
  tip: 'Tipa siempre los parámetros. El tipo de retorno se puede inferir, pero escribirlo en funciones exportadas documenta la intención y evita cambios accidentales.',

  snippets: [
    example('funciones/basicas.ts', 'Parámetros, retorno, opcionales, rest y tipos de función'),
    example('funciones/avanzadas.ts', 'Callbacks, closures, sobrecargas y async'),
  ],
} satisfies Topic;
