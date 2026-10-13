import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'espaciado',
  icon: '📏',
  title: 'Espaciado',
  description:
    'p-* = padding (espacio interior), m-* = margin (espacio exterior). Añade x / y / t / r / b / l para un lado: px-4, mt-2. Cada unidad = 0.25rem (4px).',
  tip: 'La caja amarilla punteada es el contenedor: así ves el margin. El azul es el padding dentro de la caja. La caja gris "Vecino" muestra la separación vertical.',

  controls: [
    {
      key: 'padding',
      label: 'Padding (todos los lados)',
      options: ['p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8', 'p-12'],
      default: 'p-4',
    },
    {
      key: 'paddingLado',
      label: 'Padding por lado',
      options: ['', 'px-8', 'py-6', 'pt-10', 'pl-16', 'pr-16'],
    },
    {
      key: 'margin',
      label: 'Margin (todos los lados)',
      options: ['m-0', 'm-2', 'm-4', 'm-8'],
      default: 'm-4',
    },
    {
      key: 'marginLado',
      label: 'Margin por lado',
      options: ['', 'mt-8', 'mb-10', 'ml-16', 'mr-16', 'mx-auto w-40', '-mt-6'],
    },
  ],

  template: (s) => `<div class="rounded-lg border-2 border-dashed border-amber-400/60 bg-amber-400/10">
  <div class="${cx('rounded-md bg-sky-500 text-white', s.padding, s.paddingLado, s.margin, s.marginLado)}">
    Caja
  </div>
  <div class="rounded-md bg-zinc-700 p-2 text-zinc-300">Vecino</div>
</div>`,

  examples: [
    {
      title: 'Separar hijos con space-y',
      description: 'Agrega margin vertical entre cada hijo, sin tocarlos uno por uno.',
      html: `<div class="space-y-3">
  <div class="rounded bg-zinc-800 p-3 text-zinc-300">Elemento 1</div>
  <div class="rounded bg-zinc-800 p-3 text-zinc-300">Elemento 2</div>
  <div class="rounded bg-zinc-800 p-3 text-zinc-300">Elemento 3</div>
</div>`,
    },
    {
      title: 'Separar con gap (flex/grid)',
      html: `<div class="flex gap-6">
  <div class="rounded bg-sky-500 px-4 py-2 text-white">A</div>
  <div class="rounded bg-sky-500 px-4 py-2 text-white">B</div>
  <div class="rounded bg-sky-500 px-4 py-2 text-white">C</div>
</div>`,
    },
    {
      title: 'Centrar un bloque con mx-auto',
      html: `<div class="mx-auto max-w-xs rounded-lg bg-indigo-500 p-4 text-center text-white">
  Centrado horizontalmente
</div>`,
    },
    {
      title: 'Margin negativo: avatares superpuestos',
      description: 'Con un guion delante: -ml-4 mueve el elemento hacia la izquierda.',
      html: `<div class="flex">
  <div class="size-12 rounded-full border-2 border-zinc-900 bg-rose-400"></div>
  <div class="-ml-4 size-12 rounded-full border-2 border-zinc-900 bg-amber-400"></div>
  <div class="-ml-4 size-12 rounded-full border-2 border-zinc-900 bg-emerald-400"></div>
  <div class="-ml-4 grid size-12 place-items-center rounded-full border-2 border-zinc-900 bg-zinc-700 text-xs text-white">+5</div>
</div>`,
    },
  ],
} satisfies TailwindSection;
