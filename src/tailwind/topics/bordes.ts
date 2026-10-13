import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'bordes',
  icon: '🔲',
  title: 'Bordes y sombras',
  description:
    'border-* define grosor, estilo y color del borde; rounded-* redondea esquinas; shadow-* añade sombra; ring-* dibuja un anillo exterior (muy usado en focus) y outline-* un contorno.',
  tip: 'En fondos oscuros las sombras negras casi no se ven: usa sombras de color (shadow-sky-500/40) o ring-1 ring-white/10 para separar elementos.',

  controls: [
    {
      key: 'grosor',
      label: 'Grosor del borde',
      options: [
        'border-0',
        'border',
        'border-2',
        'border-4',
        'border-8',
        'border-b-4',
        'border-l-8',
        'border-x-4',
      ],
      default: 'border-2',
    },
    {
      key: 'estilo',
      label: 'Estilo del borde',
      options: ['border-solid', 'border-dashed', 'border-dotted', 'border-double'],
    },
    {
      key: 'color',
      label: 'Color del borde',
      options: [
        'border-zinc-600',
        'border-sky-500',
        'border-rose-500',
        'border-emerald-400',
        'border-amber-400',
      ],
      default: 'border-sky-500',
    },
    {
      key: 'radio',
      label: 'Esquinas',
      options: [
        'rounded-none',
        'rounded-sm',
        'rounded-md',
        'rounded-lg',
        'rounded-xl',
        'rounded-2xl',
        'rounded-3xl',
        'rounded-full',
        'rounded-t-3xl',
        'rounded-tl-3xl rounded-br-3xl',
      ],
      default: 'rounded-xl',
    },
    {
      key: 'sombra',
      label: 'Sombra',
      options: [
        'shadow-none',
        'shadow-sm',
        'shadow-md',
        'shadow-lg',
        'shadow-2xl',
        'shadow-xl shadow-sky-500/40',
        'shadow-2xl shadow-fuchsia-500/50',
        'inset-shadow-sm inset-shadow-black/60',
      ],
      default: 'shadow-xl shadow-sky-500/40',
    },
    {
      key: 'anillo',
      label: 'Anillo (ring)',
      options: [
        '',
        'ring-1 ring-white/20',
        'ring-2 ring-sky-400',
        'ring-4 ring-rose-400 ring-offset-4 ring-offset-zinc-900',
      ],
    },
    {
      key: 'contorno',
      label: 'Contorno (outline)',
      options: ['', 'outline-2 outline-offset-4 outline-dashed outline-amber-400'],
    },
  ],

  previewClass: 'grid place-items-center py-14',

  template: (
    s
  ) => `<div class="${cx('w-48 bg-zinc-800 p-6 text-center text-white', s.grosor, s.estilo, s.color, s.radio, s.sombra, s.anillo, s.contorno)}">
  Tarjeta
</div>`,

  examples: [
    {
      title: 'Tarjeta simple (oscura)',
      html: `<div class="max-w-sm rounded-xl bg-zinc-800 p-5 ring-1 ring-white/10">
  <h3 class="font-bold text-white">Título de la tarjeta</h3>
  <p class="text-zinc-400">ring-1 ring-white/10 separa la tarjeta del fondo.</p>
</div>`,
    },
    {
      title: 'Borde solo en un lado',
      html: `<div class="border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-emerald-300">
  border-l-4 = borde izquierdo de 4px
</div>`,
    },
    {
      title: 'Divisores entre elementos',
      description: 'divide-y pone un borde entre cada hijo.',
      html: `<ul class="divide-y divide-zinc-700 rounded-lg border border-zinc-700 text-zinc-300">
  <li class="p-3">Inicio</li>
  <li class="p-3">Perfil</li>
  <li class="p-3">Ajustes</li>
</ul>`,
    },
    {
      title: 'Borde con degradado',
      description: 'Truco: un padre con degradado y p-0.5, y el hijo con el fondo oscuro.',
      html: `<div class="rounded-xl bg-linear-to-r from-sky-500 to-fuchsia-500 p-0.5">
  <div class="rounded-[10px] bg-zinc-900 p-4 text-white">Borde degradado ✨</div>
</div>`,
    },
  ],
} satisfies TailwindSection;
