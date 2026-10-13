import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'flexbox',
  icon: '↔️',
  title: 'Flexbox',
  description:
    'Pon flex en el padre y controla a los hijos: dirección (flex-row / flex-col), salto de línea (flex-wrap), eje principal (justify-*), eje cruzado (items-*) y separación (gap-*).',
  tip: 'justify-* reparte en la dirección del flex; items-* alinea en la dirección perpendicular. Si cambias a flex-col, se intercambian.',

  controls: [
    {
      key: 'direccion',
      label: 'Dirección',
      options: ['flex-row', 'flex-col', 'flex-row-reverse', 'flex-col-reverse'],
    },
    { key: 'wrap', label: 'Salto de línea', options: ['flex-nowrap', 'flex-wrap', 'flex-wrap-reverse'] },
    {
      key: 'justify',
      label: 'justify (eje principal)',
      options: [
        'justify-start',
        'justify-center',
        'justify-end',
        'justify-between',
        'justify-around',
        'justify-evenly',
      ],
    },
    {
      key: 'items',
      label: 'items (eje cruzado)',
      options: ['items-stretch', 'items-start', 'items-center', 'items-end', 'items-baseline'],
      default: 'items-center',
    },
    {
      key: 'content',
      label: 'content (varias líneas con wrap)',
      options: ['', 'content-start', 'content-center', 'content-between'],
    },
    {
      key: 'gap',
      label: 'Separación',
      options: ['gap-0', 'gap-1', 'gap-2', 'gap-4', 'gap-8', 'gap-x-8 gap-y-2'],
      default: 'gap-2',
    },
    {
      key: 'hijo',
      label: 'Clases del hijo 2 (amarillo)',
      options: [
        '',
        'grow',
        'shrink-0',
        'basis-1/2',
        'order-first',
        'order-last',
        'self-start',
        'self-end',
        'self-stretch',
      ],
    },
  ],

  template: (
    s
  ) => `<div class="${cx('flex h-64 rounded-lg bg-zinc-800 p-3', s.direccion, s.wrap, s.justify, s.items, s.content, s.gap)}">
  <div class="min-h-10 min-w-14 rounded bg-sky-400 p-2 text-white">1</div>
  <div class="${cx('min-h-16 min-w-14 rounded bg-amber-400 p-2 text-zinc-900', s.hijo)}">2</div>
  <div class="min-h-12 min-w-14 rounded bg-sky-500 p-2 text-white">3</div>
  <div class="min-h-14 min-w-14 rounded bg-sky-600 p-2 text-white">4</div>
  <div class="min-h-10 min-w-14 rounded bg-sky-700 p-2 text-white">5</div>
</div>`,

  examples: [
    {
      title: 'Barra de navegación',
      html: `<nav class="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-3 text-white">
  <span class="font-bold">Logo</span>
  <div class="flex gap-4 text-sm text-zinc-300">
    <a href="#" class="hover:text-sky-300">Inicio</a>
    <a href="#" class="hover:text-sky-300">Blog</a>
    <a href="#" class="hover:text-sky-300">Contacto</a>
  </div>
</nav>`,
    },
    {
      title: 'Centrar perfectamente',
      html: `<div class="flex h-32 items-center justify-center rounded-lg bg-zinc-800">
  <span class="rounded bg-rose-500 px-3 py-1 text-white">¡Centrado!</span>
</div>`,
    },
    {
      title: 'Columnas que crecen con flex-1',
      html: `<div class="flex gap-2 text-zinc-900">
  <div class="w-20 rounded bg-amber-300 p-2">fijo</div>
  <div class="flex-1 rounded bg-amber-400 p-2">flex-1 (ocupa el resto)</div>
</div>`,
    },
    {
      title: 'Empujar al final con ml-auto',
      html: `<div class="flex items-center gap-2 rounded-lg bg-zinc-800 p-3 text-zinc-300">
  <span>📁 Proyecto</span>
  <span>📄 Archivos</span>
  <button class="ml-auto rounded bg-sky-500 px-3 py-1 text-white">Guardar</button>
</div>`,
    },
    {
      title: 'Envolver etiquetas con flex-wrap',
      html: `<div class="flex flex-wrap gap-2 text-sm text-zinc-300">
  <span class="rounded-full bg-zinc-800 px-3 py-1">react</span>
  <span class="rounded-full bg-zinc-800 px-3 py-1">tailwind</span>
  <span class="rounded-full bg-zinc-800 px-3 py-1">javascript</span>
  <span class="rounded-full bg-zinc-800 px-3 py-1">css</span>
  <span class="rounded-full bg-zinc-800 px-3 py-1">html</span>
  <span class="rounded-full bg-zinc-800 px-3 py-1">vite</span>
</div>`,
    },
  ],
} satisfies TailwindSection;
