import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'colores',
  icon: '🎨',
  title: 'Colores y fondos',
  description:
    'Los colores siguen el patrón propiedad-color-tono: bg-sky-500 (fondo), text-white (texto). El tono va de 50 (muy claro) a 950 (muy oscuro).',
  tip: 'Añade /número para transparencia: bg-sky-500/30 es el fondo al 30%. En temas oscuros es ideal para fondos suaves.',

  controls: [
    {
      key: 'fondo',
      label: 'Color de fondo',
      options: [
        'bg-transparent',
        'bg-black',
        'bg-zinc-800',
        'bg-white',
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-400',
        'bg-lime-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-fuchsia-500',
        'bg-rose-500',
        'bg-sky-500/30',
        'bg-rose-500/20',
      ],
      default: 'bg-sky-500',
    },
    {
      key: 'degradado',
      label: 'Degradado',
      hint: 'Se pinta encima del color de fondo.',
      options: [
        '',
        'bg-linear-to-r from-violet-500 to-fuchsia-500',
        'bg-linear-to-br from-cyan-400 to-blue-700',
        'bg-linear-to-t from-amber-300 via-orange-500 to-rose-600',
        'bg-linear-45 from-emerald-400 to-sky-600',
        'bg-radial from-sky-400 to-indigo-900',
        'bg-conic from-pink-500 via-yellow-400 to-pink-500',
      ],
    },
    {
      key: 'texto',
      label: 'Color de texto',
      options: [
        'text-white',
        'text-black',
        'text-zinc-300',
        'text-yellow-300',
        'text-sky-200',
        'text-rose-200',
        'text-emerald-950',
      ],
    },
    {
      key: 'opacidad',
      label: 'Opacidad del elemento',
      options: ['opacity-100', 'opacity-75', 'opacity-50', 'opacity-25'],
    },
    {
      key: 'sombra',
      label: 'Sombra de color',
      options: [
        '',
        'shadow-lg shadow-sky-500/50',
        'shadow-xl shadow-fuchsia-500/50',
        'shadow-xl shadow-amber-400/40',
      ],
    },
  ],

  previewClass: 'py-10',

  template: (
    s
  ) => `<div class="${cx('rounded-xl p-8 text-center text-lg font-semibold', s.fondo, s.degradado, s.texto, s.opacidad, s.sombra)}">
  Hola Tailwind 👋
</div>`,

  examples: [
    {
      title: 'Paleta de tonos',
      description: 'Cada color tiene tonos del 50 al 950.',
      html: `<div class="grid grid-cols-11 overflow-hidden rounded-lg text-center text-[10px]">
  <div class="bg-sky-50 py-6 text-sky-900">50</div>
  <div class="bg-sky-100 py-6 text-sky-900">100</div>
  <div class="bg-sky-200 py-6 text-sky-900">200</div>
  <div class="bg-sky-300 py-6 text-sky-900">300</div>
  <div class="bg-sky-400 py-6 text-sky-900">400</div>
  <div class="bg-sky-500 py-6 text-white">500</div>
  <div class="bg-sky-600 py-6 text-white">600</div>
  <div class="bg-sky-700 py-6 text-white">700</div>
  <div class="bg-sky-800 py-6 text-white">800</div>
  <div class="bg-sky-900 py-6 text-white">900</div>
  <div class="bg-sky-950 py-6 text-white">950</div>
</div>`,
    },
    {
      title: 'Alertas para tema oscuro',
      description: 'Fondo /10 + borde /30 + texto claro (300).',
      html: `<div class="space-y-2">
  <div class="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-sky-300">ℹ️ Información guardada.</div>
  <div class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">✅ Todo salió bien.</div>
  <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-300">⚠️ Revisa los datos.</div>
  <div class="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">⛔ Algo falló.</div>
</div>`,
    },
    {
      title: 'Badges de estado',
      html: `<div class="flex flex-wrap gap-2">
  <span class="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-500/30">Activo</span>
  <span class="rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-300 ring-1 ring-amber-500/30">Pendiente</span>
  <span class="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300 ring-1 ring-rose-500/30">Error</span>
  <span class="rounded-full bg-zinc-700 px-3 py-1 text-sm text-zinc-300">Borrador</span>
</div>`,
    },
    {
      title: 'Texto con degradado',
      description: 'bg-clip-text + text-transparent',
      html: `<h2 class="bg-linear-to-r from-sky-400 via-violet-400 to-fuchsia-400 bg-clip-text text-4xl font-black text-transparent">
  Texto degradado
</h2>`,
    },
  ],
} satisfies TailwindSection;
