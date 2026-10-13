import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'tipos-avanzados',
  icon: '🧠',
  title: 'Tipos avanzados',
  description:
    'Tipos que se calculan a partir de otros: mapped types, template literal types, tipos condicionales con infer, tipos recursivos (DeepPartial, rutas de un objeto) y branded types para no confundir IDs.',
  tip: 'Son las herramientas con las que se escriben librerías como Zod, Prisma o TanStack. En una app normal úsalos con moderación: un tipo que nadie entiende es peor que uno simple.',

  snippets: [
    example(
      'avanzados/mapped.ts',
      'Mapped types y template literal types',
      'Así están construidos Partial y Readonly; además, getters generados con nombres tipados.'
    ),
    example(
      'avanzados/condicionales.ts',
      'Tipos condicionales, infer y tipos recursivos',
      'DeepPartial para mezclar configuraciones y rutas tipo "theme.colors.primary".'
    ),
    example(
      'avanzados/branded.ts',
      'Branded types y assertion functions',
      'UserId y OrderId son strings, pero TypeScript impide intercambiarlos.'
    ),
  ],
} satisfies Topic;
