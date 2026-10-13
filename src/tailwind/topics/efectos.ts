import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'efectos',
  icon: '🪄',
  title: 'Filtros y efectos',
  description:
    'Los filtros (blur, brightness, grayscale…) modifican el propio elemento. Los backdrop-* afectan a lo que hay DETRÁS del elemento: así se hace el efecto "vidrio" (glassmorphism).',
  tip: 'Para el vidrio combina un fondo semitransparente (bg-white/10) con backdrop-blur-md.',

  controls: [
    {
      key: 'filtro',
      label: 'Filtro del fondo de colores',
      options: [
        '',
        'blur-xs',
        'blur-sm',
        'blur-md',
        'brightness-50',
        'brightness-150',
        'contrast-200',
        'grayscale',
        'sepia',
        'invert',
        'saturate-200',
        'hue-rotate-90',
      ],
    },
    {
      key: 'vidrio',
      label: 'Fondo de la tarjeta',
      options: ['bg-white/0', 'bg-white/10', 'bg-white/30', 'bg-black/40'],
      default: 'bg-white/10',
    },
    {
      key: 'backdrop',
      label: 'Backdrop de la tarjeta',
      options: [
        '',
        'backdrop-blur-sm',
        'backdrop-blur-md',
        'backdrop-blur-xl',
        'backdrop-grayscale',
        'backdrop-invert',
      ],
      default: 'backdrop-blur-md',
    },
    {
      key: 'dropShadow',
      label: 'Sombra de los emojis (drop-shadow)',
      options: ['', 'drop-shadow-lg', 'drop-shadow-xl drop-shadow-sky-400/80'],
    },
    {
      key: 'mezcla',
      label: 'Mezcla del texto (mix-blend)',
      options: ['', 'mix-blend-overlay', 'mix-blend-difference', 'mix-blend-soft-light'],
    },
  ],

  template: (s) => `<div class="relative grid h-72 place-items-center overflow-hidden rounded-xl">
  <div class="${cx('absolute inset-0 bg-linear-to-br from-fuchsia-500 via-sky-500 to-emerald-400', s.filtro)}"></div>
  <div class="${cx('absolute top-8 left-10 text-7xl', s.dropShadow)}">🌈</div>
  <div class="${cx('absolute right-12 bottom-8 text-6xl', s.dropShadow)}">🐳</div>
  <div class="${cx('relative rounded-2xl px-10 py-8 text-center ring-1 ring-white/20', s.vidrio, s.backdrop)}">
    <p class="${cx('text-3xl font-black text-white', s.mezcla)}">Glassmorphism</p>
  </div>
</div>`,

  examples: [
    {
      title: 'Imagen en escala de grises que se colorea al pasar el ratón',
      html: `<div class="grid h-32 w-48 cursor-pointer place-items-center rounded-xl bg-linear-to-br from-orange-400 to-rose-600 text-5xl grayscale transition duration-500 hover:grayscale-0">
  🌅
</div>`,
    },
    {
      title: 'Brillo de fondo (blob difuminado)',
      html: `<div class="relative grid h-40 place-items-center overflow-hidden rounded-xl bg-zinc-950">
  <div class="absolute size-40 rounded-full bg-sky-500/50 blur-3xl"></div>
  <p class="relative text-2xl font-bold text-white">Brillo suave</p>
</div>`,
    },
  ],
} satisfies TailwindSection;
