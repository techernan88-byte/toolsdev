import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'responsive',
  icon: '📱',
  title: 'Responsive',
  description:
    'Tailwind es mobile-first: las clases sin prefijo aplican siempre, y sm: md: lg: xl: aplican desde ese ancho de pantalla hacia arriba.',
  tip: 'Cambia el tamaño de la ventana y mira la etiqueta "pantalla" arriba a la derecha. Los breakpoints dependen de la ventana, no de la caja.',

  controls: [
    { key: 'base', label: 'Móvil (sin prefijo)', options: ['grid-cols-1', 'grid-cols-2'] },
    {
      key: 'sm',
      label: 'Desde sm: (≥640px)',
      options: ['', 'sm:grid-cols-2', 'sm:grid-cols-3'],
      default: 'sm:grid-cols-2',
    },
    {
      key: 'md',
      label: 'Desde md: (≥768px)',
      options: ['', 'md:grid-cols-3', 'md:grid-cols-4'],
      default: 'md:grid-cols-3',
    },
    {
      key: 'lg',
      label: 'Desde lg: (≥1024px)',
      options: ['', 'lg:grid-cols-4', 'lg:grid-cols-6'],
      default: 'lg:grid-cols-6',
    },
    {
      key: 'texto',
      label: 'Tamaño de texto',
      options: ['text-sm', 'text-sm md:text-lg lg:text-2xl'],
      default: 'text-sm md:text-lg lg:text-2xl',
    },
    { key: 'padding', label: 'Padding', options: ['p-4', 'p-2 md:p-4 lg:p-8'] },
    { key: 'visible', label: 'Visibilidad de la caja F', options: ['', 'hidden lg:block', 'lg:hidden'] },
  ],

  template: (s) => `<div class="${cx('grid gap-3', s.base, s.sm, s.md, s.lg)}">
  <div class="${cx('rounded bg-orange-500 text-white', s.padding, s.texto)}">A</div>
  <div class="${cx('rounded bg-orange-500 text-white', s.padding, s.texto)}">B</div>
  <div class="${cx('rounded bg-orange-500 text-white', s.padding, s.texto)}">C</div>
  <div class="${cx('rounded bg-orange-500 text-white', s.padding, s.texto)}">D</div>
  <div class="${cx('rounded bg-orange-500 text-white', s.padding, s.texto)}">E</div>
  <div class="${cx('rounded bg-rose-500 text-white', s.padding, s.texto, s.visible)}">F</div>
</div>`,

  examples: [
    {
      title: 'Ocultar / mostrar según pantalla',
      html: `<div class="text-zinc-200">
  <p class="block rounded bg-rose-500/20 p-2 md:hidden">📱 Solo visible en móvil</p>
  <p class="hidden rounded bg-emerald-500/20 p-2 md:block">🖥️ Solo visible desde md</p>
</div>`,
    },
    {
      title: 'De columna a fila',
      description: 'flex-col en móvil, flex-row desde md.',
      html: `<div class="flex flex-col gap-2 text-zinc-900 md:flex-row">
  <div class="flex-1 rounded bg-indigo-300 p-3">Imagen</div>
  <div class="flex-1 rounded bg-indigo-200 p-3">Texto</div>
</div>`,
    },
    {
      title: 'Container queries (@container)',
      description: 'Responden al ancho del PADRE, no de la ventana. Muy útil para componentes.',
      html: `<div class="@container rounded-lg bg-zinc-800 p-3">
  <div class="flex flex-col gap-2 @md:flex-row">
    <div class="rounded bg-sky-500 p-3 text-white @md:w-1/3">Lateral</div>
    <div class="flex-1 rounded bg-sky-700 p-3 text-white">Se pone en fila cuando el padre mide ≥ 28rem</div>
  </div>
</div>`,
    },
  ],
} satisfies TailwindSection;
