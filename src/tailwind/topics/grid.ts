import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'grid',
  icon: '▦',
  title: 'Grid',
  description:
    'grid + grid-cols-* crea columnas. Con col-span-* / row-span-* un hijo ocupa varias celdas. Ideal para galerías, dashboards y layouts de página.',
  tip: 'Flex = una dimensión (fila O columna). Grid = dos dimensiones (filas Y columnas).',

  controls: [
    {
      key: 'columnas',
      label: 'Columnas',
      options: [
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-4',
        'grid-cols-6',
        'grid-cols-[120px_1fr]',
        'grid-cols-[repeat(auto-fill,minmax(90px,1fr))]',
      ],
      default: 'grid-cols-4',
    },
    {
      key: 'gap',
      label: 'Separación',
      options: ['gap-0', 'gap-1', 'gap-2', 'gap-4', 'gap-8', 'gap-x-8 gap-y-1'],
      default: 'gap-2',
    },
    {
      key: 'flujo',
      label: 'Flujo',
      hint: 'dense rellena los huecos que dejan los span.',
      options: ['grid-flow-row', 'grid-flow-row-dense', 'grid-flow-col grid-rows-3'],
    },
    {
      key: 'justifyItems',
      label: 'Alinear dentro de la celda',
      options: ['justify-items-stretch', 'justify-items-start', 'justify-items-center', 'justify-items-end'],
    },
    {
      key: 'colSpan',
      label: 'Hijo 1: columnas que ocupa',
      options: ['col-span-1', 'col-span-2', 'col-span-3', 'col-span-full'],
      default: 'col-span-2',
    },
    { key: 'rowSpan', label: 'Hijo 1: filas que ocupa', options: ['row-span-1', 'row-span-2', 'row-span-3'] },
    {
      key: 'inicio',
      label: 'Hijo 4: posición exacta',
      options: ['', 'col-start-2', 'col-start-3', 'col-end-[-1]'],
    },
  ],

  template: (s) => `<div class="${cx('grid', s.columnas, s.gap, s.flujo, s.justifyItems)}">
  <div class="${cx('rounded bg-amber-400 p-4 text-zinc-900', s.colSpan, s.rowSpan)}">1</div>
  <div class="rounded bg-teal-500 p-4 text-white">2</div>
  <div class="rounded bg-teal-500 p-4 text-white">3</div>
  <div class="${cx('rounded bg-fuchsia-500 p-4 text-white', s.inicio)}">4</div>
  <div class="rounded bg-teal-500 p-4 text-white">5</div>
  <div class="rounded bg-teal-500 p-4 text-white">6</div>
  <div class="rounded bg-teal-500 p-4 text-white">7</div>
  <div class="rounded bg-teal-500 p-4 text-white">8</div>
</div>`,

  examples: [
    {
      title: 'Bento grid',
      description: 'Tarjetas de distintos tamaños con col-span y row-span.',
      html: `<div class="grid grid-cols-4 grid-rows-2 gap-2 text-sm text-white">
  <div class="col-span-2 row-span-2 rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 p-4">Destacado</div>
  <div class="col-span-2 rounded-xl bg-zinc-800 p-4">Ancha</div>
  <div class="rounded-xl bg-zinc-800 p-4">A</div>
  <div class="rounded-xl bg-zinc-800 p-4">B</div>
</div>`,
    },
    {
      title: 'Columnas automáticas',
      description: 'auto-fill + minmax: caben tantas columnas como permita el ancho.',
      html: `<div class="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 text-center text-white">
  <div class="rounded bg-violet-500 p-3">1</div>
  <div class="rounded bg-violet-500 p-3">2</div>
  <div class="rounded bg-violet-500 p-3">3</div>
  <div class="rounded bg-violet-500 p-3">4</div>
  <div class="rounded bg-violet-500 p-3">5</div>
  <div class="rounded bg-violet-500 p-3">6</div>
</div>`,
    },
    {
      title: 'Centrar con place-items-center',
      html: `<div class="grid h-28 place-items-center rounded-lg bg-zinc-800 text-zinc-200">
  <span>Centrado con grid</span>
</div>`,
    },
    {
      title: 'Superponer elementos en la misma celda',
      description: 'Ambos hijos en col-start-1 row-start-1.',
      html: `<div class="grid">
  <div class="col-start-1 row-start-1 h-32 rounded-xl bg-linear-to-r from-rose-500 to-orange-400"></div>
  <p class="col-start-1 row-start-1 self-end p-4 text-xl font-bold text-white">Texto encima</p>
</div>`,
    },
  ],
} satisfies TailwindSection;
