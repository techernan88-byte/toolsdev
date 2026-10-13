import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'estados',
  icon: '👆',
  title: 'Estados (hover, focus…)',
  description:
    'Antepón un estado a cualquier clase: hover:bg-sky-600 solo aplica al pasar el ratón. Otros: focus:, focus-visible:, active:, disabled:, group-hover:, peer-checked:, open:.',
  tip: '¡La vista previa es real! Pasa el ratón, haz clic y usa Tab para ver cada estado.',

  controls: [
    {
      key: 'hover',
      label: 'Al pasar el ratón (hover:)',
      options: [
        '',
        'hover:bg-sky-700',
        'hover:bg-rose-500',
        'hover:bg-white hover:text-zinc-900',
        'hover:scale-110',
        'hover:-translate-y-1',
        'hover:rotate-3',
        'hover:shadow-lg hover:shadow-sky-500/50',
        'hover:ring-4 hover:ring-sky-400/40',
      ],
      default: 'hover:bg-sky-700',
    },
    {
      key: 'focus',
      label: 'Al enfocar (focus:) — usa Tab',
      options: [
        '',
        'focus:ring-4 focus:ring-sky-400/50 focus:outline-none',
        'focus:bg-emerald-500',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400',
      ],
    },
    {
      key: 'active',
      label: 'Al hacer clic (active:)',
      options: ['', 'active:scale-95', 'active:bg-sky-900', 'active:translate-y-0.5'],
    },
    {
      key: 'transicion',
      label: 'Transición',
      options: ['', 'transition', 'transition-all duration-300', 'transition duration-700 ease-out'],
      default: 'transition',
    },
    {
      key: 'cursor',
      label: 'Cursor',
      options: [
        'cursor-pointer',
        'cursor-wait',
        'cursor-not-allowed',
        'cursor-help',
        'cursor-grab',
        'cursor-crosshair',
      ],
    },
    { key: 'seleccion', label: 'Selección de texto', options: ['', 'select-none', 'select-all'] },
  ],

  previewClass: 'grid place-items-center py-14',

  template: (
    s
  ) => `<button class="${cx('rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white', s.hover, s.focus, s.active, s.transicion, s.cursor, s.seleccion)}">
  Pruébame
</button>`,

  examples: [
    {
      title: 'Input con focus',
      html: `<input
  type="text"
  placeholder="Escribe aquí…"
  class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
/>`,
    },
    {
      title: 'Botón deshabilitado',
      html: `<button disabled class="rounded-lg bg-sky-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40">
  No disponible
</button>`,
    },
    {
      title: 'group-hover: el padre controla a los hijos',
      description: 'Pon group en el padre; usa group-hover: en los hijos.',
      html: `<a href="#" class="group block rounded-lg border border-zinc-700 p-4 transition hover:border-sky-500 hover:bg-sky-500/10">
  <h3 class="font-semibold text-white group-hover:text-sky-300">Pasa el ratón</h3>
  <p class="text-zinc-400">El texto cambia con el padre <span class="inline-block transition group-hover:translate-x-2">→</span></p>
</a>`,
    },
    {
      title: 'peer-checked: un hermano controla al otro',
      description: 'Interruptor hecho solo con CSS.',
      html: `<label class="inline-flex cursor-pointer items-center gap-3 text-zinc-300">
  <input type="checkbox" class="peer sr-only" />
  <div class="h-6 w-11 rounded-full bg-zinc-600 p-0.5 transition peer-checked:bg-emerald-500 peer-checked:*:translate-x-5">
    <div class="size-5 rounded-full bg-white transition"></div>
  </div>
  <span class="peer-checked:font-bold peer-checked:text-emerald-400">Activar</span>
</label>`,
    },
    {
      title: 'Validación con invalid:',
      description: 'Escribe un correo mal formado.',
      html: `<input
  type="email"
  value="correo-invalido"
  class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white invalid:border-rose-500 invalid:text-rose-400"
/>`,
    },
    {
      title: 'Acordeón con open:',
      html: `<details class="group rounded-lg bg-zinc-800 p-4 text-zinc-300">
  <summary class="flex cursor-pointer list-none items-center justify-between font-medium text-white">
    ¿Qué es Tailwind?
    <span class="transition group-open:rotate-45">＋</span>
  </summary>
  <p class="mt-3">Un framework CSS de clases utilitarias.</p>
</details>`,
    },
  ],
} satisfies TailwindSection;
