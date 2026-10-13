import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'animaciones',
  icon: '✨',
  title: 'Transiciones y animaciones',
  description:
    'animate-* trae animaciones listas (spin, ping, pulse, bounce). Para cambios suaves usa transition + duration-* + ease-* + una transformación (scale, rotate, translate, skew).',
  tip: 'Sin transition el cambio es instantáneo. Pasa el ratón por el cuadro con y sin ella para notarlo.',

  controls: [
    {
      key: 'animacion',
      label: 'Animación',
      options: ['animate-none', 'animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce'],
    },
    {
      key: 'transformacion',
      label: 'Transformación en hover',
      options: [
        '',
        'hover:scale-75',
        'hover:scale-125',
        'hover:scale-150',
        'hover:rotate-45',
        'hover:rotate-180',
        'hover:-rotate-12',
        'hover:translate-x-8',
        'hover:-translate-y-4',
        'hover:skew-x-12',
        'hover:scale-125 hover:rotate-12',
      ],
      default: 'hover:scale-125',
    },
    {
      key: 'duracion',
      label: 'Duración',
      options: [
        '',
        'transition duration-75',
        'transition duration-150',
        'transition duration-300',
        'transition duration-700',
        'transition duration-1000',
      ],
      default: 'transition duration-300',
    },
    {
      key: 'curva',
      label: 'Curva (easing)',
      options: ['ease-linear', 'ease-in', 'ease-out', 'ease-in-out'],
      default: 'ease-out',
    },
    { key: 'retraso', label: 'Retraso', options: ['', 'delay-150', 'delay-500'] },
    {
      key: 'origen',
      label: 'Punto de origen',
      hint: 'Desde dónde se escala / rota.',
      options: ['origin-center', 'origin-top-left', 'origin-bottom-right'],
    },
  ],

  previewClass: 'grid place-items-center py-16',

  template: (s) =>
    `<div class="${cx('size-20 rounded-xl bg-fuchsia-500 shadow-lg shadow-fuchsia-500/40', s.animacion, s.transformacion, s.duracion, s.curva, s.retraso, s.origen)}"></div>`,

  examples: [
    {
      title: 'Spinner de carga',
      html: `<div class="size-8 animate-spin rounded-full border-4 border-zinc-700 border-t-sky-500"></div>`,
    },
    {
      title: 'Esqueleto de carga',
      html: `<div class="flex animate-pulse gap-3">
  <div class="size-12 rounded-full bg-zinc-700"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="h-3 w-3/4 rounded bg-zinc-700"></div>
    <div class="h-3 w-1/2 rounded bg-zinc-700"></div>
  </div>
</div>`,
    },
    {
      title: 'Punto de notificación',
      html: `<span class="relative inline-flex">
  <span class="text-2xl">🔔</span>
  <span class="absolute top-0 right-0 size-3 animate-ping rounded-full bg-rose-400"></span>
  <span class="absolute top-0 right-0 size-3 rounded-full bg-rose-500"></span>
</span>`,
    },
    {
      title: 'Tarjeta que se eleva',
      html: `<div class="w-56 cursor-pointer rounded-xl bg-zinc-800 p-4 text-zinc-300 ring-1 ring-white/10 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/20 hover:ring-sky-500/50">
  Pasa el ratón 🚀
</div>`,
    },
    {
      title: 'Indicador "desliza abajo"',
      html: `<div class="animate-bounce text-center text-3xl text-zinc-400">⌄</div>`,
    },
  ],
} satisfies TailwindSection;
