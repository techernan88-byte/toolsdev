import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'utilitarios',
  icon: '🧰',
  title: 'Tipos utilitarios',
  description:
    'TypeScript trae tipos que transforman otros tipos: Partial, Required, Readonly, Pick, Omit, Record para objetos; Exclude, Extract, NonNullable para uniones; ReturnType, Parameters, Awaited para funciones.',
  tip: 'Deriva los tipos en lugar de repetirlos: si cambias User, Omit<User, "password"> se actualiza solo.',

  snippets: [
    example('utilitarios/objetos.ts', 'Partial, Required, Readonly, Pick, Omit y Record'),
    example(
      'utilitarios/unionesFunciones.ts',
      'Exclude, Extract, NonNullable, ReturnType, Parameters y Awaited'
    ),
  ],
} satisfies Topic;
