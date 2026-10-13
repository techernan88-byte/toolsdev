import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'tamano',
  icon: '📐',
  title: 'Tamaño',
  description:
    'w-* = ancho, h-* = alto, size-* = ambos a la vez. Usa números (w-32), fracciones (w-1/2), palabras clave (w-full, w-fit, h-screen) o valores exactos entre corchetes (w-[150px]).',
  tip: 'Usa max-w-* (max-w-md, max-w-3xl) para que tarjetas y textos no se estiren demasiado.',

  controls: [
    {
      key: 'ancho',
      label: 'Ancho',
      options: [
        'w-8',
        'w-16',
        'w-32',
        'w-48',
        'w-64',
        'w-1/4',
        'w-1/2',
        'w-3/4',
        'w-full',
        'w-fit',
        'w-[150px]',
      ],
      default: 'w-32',
    },
    {
      key: 'alto',
      label: 'Alto',
      hint: 'Para aspect-* elige "ninguno".',
      options: ['', 'h-8', 'h-16', 'h-24', 'h-32', 'h-48', 'h-[90px]'],
      default: 'h-16',
    },
    { key: 'limite', label: 'Mínimo / máximo', options: ['', 'max-w-24', 'min-w-64', 'max-h-10'] },
    {
      key: 'aspecto',
      label: 'Relación de aspecto',
      options: ['', 'aspect-square', 'aspect-video', 'aspect-[3/4]'],
    },
  ],

  previewClass: 'min-h-64',

  template: (
    s
  ) => `<div class="${cx('grid place-items-center overflow-hidden rounded-md bg-violet-500 px-2 text-sm text-white', s.ancho, s.alto, s.limite, s.aspecto)}">
  Caja
</div>`,

  examples: [
    {
      title: 'Avatares con size-*',
      html: `<div class="flex items-end gap-3">
  <div class="size-8 rounded-full bg-sky-400"></div>
  <div class="size-12 rounded-full bg-sky-500"></div>
  <div class="size-16 rounded-full bg-sky-600"></div>
  <div class="size-20 rounded-full bg-sky-700"></div>
</div>`,
    },
    {
      title: 'Relación de aspecto',
      description: 'aspect-video (16:9) o aspect-square (1:1).',
      html: `<div class="grid grid-cols-2 gap-3 text-zinc-300">
  <div class="grid aspect-video place-items-center rounded-lg bg-zinc-800">16:9</div>
  <div class="grid aspect-square place-items-center rounded-lg bg-zinc-800">1:1</div>
</div>`,
    },
    {
      title: 'Ancho máximo',
      html: `<p class="max-w-xs rounded-lg bg-emerald-500/10 p-3 text-emerald-300">
  Este párrafo nunca será más ancho que max-w-xs (20rem), aunque el contenedor sea grande.
</p>`,
    },
    {
      title: 'Barra de progreso con fracciones',
      html: `<div class="space-y-2">
  <div class="h-2 rounded-full bg-zinc-800"><div class="h-2 w-1/4 rounded-full bg-rose-500"></div></div>
  <div class="h-2 rounded-full bg-zinc-800"><div class="h-2 w-1/2 rounded-full bg-amber-400"></div></div>
  <div class="h-2 rounded-full bg-zinc-800"><div class="h-2 w-3/4 rounded-full bg-emerald-500"></div></div>
</div>`,
    },
  ],
} satisfies TailwindSection;
