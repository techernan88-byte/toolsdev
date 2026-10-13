import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'clases',
  icon: '🏛️',
  title: 'Clases y POO',
  description:
    'Clases con modificadores de acceso (public, private, protected, readonly), propiedades en el constructor, getters, miembros estáticos, clases abstractas, herencia e interfaces que las clases implementan.',
  tip: 'private de TypeScript solo existe al compilar. Si necesitas privacidad real en tiempo de ejecución, usa los campos nativos de JavaScript con #: #balance.',

  snippets: [
    example('clases/clases.ts', 'Cuentas bancarias: abstract, protected, getters, static y polimorfismo'),
  ],
} satisfies Topic;
