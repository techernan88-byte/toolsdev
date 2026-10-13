import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'posicion',
  icon: '📍',
  title: 'Posición y capas',
  description:
    'absolute saca al elemento del flujo y lo coloca con top-*, right-*, bottom-*, left-* (o inset-*) respecto al padre con relative más cercano. z-* decide qué capa queda encima.',
  tip: 'Quita relative del padre: el badge se "escapa" y se coloca respecto a la caja de vista previa.',

  controls: [
    { key: 'padre', label: 'Padre', options: ['relative', ''] },
    {
      key: 'posicion',
      label: 'Posición del badge',
      options: [
        'static',
        'absolute top-0 right-0',
        'absolute top-2 left-2',
        'absolute bottom-2 right-2',
        'absolute -top-3 -right-3',
        'absolute inset-x-0 bottom-0 text-center',
        'absolute inset-0 m-auto size-fit',
      ],
      default: 'absolute -top-3 -right-3',
    },
    {
      key: 'z',
      label: 'z-index del badge',
      hint: 'La capa violeta tiene z-10.',
      options: ['z-0', 'z-20'],
      default: 'z-20',
    },
  ],

  previewClass: 'py-10',

  template: (s) => `<div class="${cx('h-56 rounded-xl bg-zinc-800 p-4 text-zinc-300', s.padre)}">
  Padre ${s.padre ? '(relative)' : '(sin relative)'}
  <div class="absolute top-0 right-0 z-10 grid size-28 place-items-center rounded-tr-xl rounded-bl-3xl bg-violet-500/90 text-white">
    Capa z-10
  </div>
  <span class="${cx('rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white', s.posicion, s.z)}">NUEVO</span>
</div>`,

  examples: [
    {
      title: 'Notificación sobre un icono',
      html: `<button class="relative rounded-lg bg-zinc-800 p-3 text-2xl">
  📬
  <span class="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-rose-500 text-xs text-white">3</span>
</button>`,
    },
    {
      title: 'Cabeceras sticky en una lista',
      description: 'Haz scroll: sticky top-0 se queda pegado arriba del contenedor.',
      html: `<div class="h-48 overflow-y-auto rounded-lg bg-zinc-800 text-zinc-300">
  <h4 class="sticky top-0 bg-sky-600 px-3 py-1 font-semibold text-white">A</h4>
  <p class="px-3 py-2">Ana</p><p class="px-3 py-2">Alberto</p><p class="px-3 py-2">Andrea</p>
  <h4 class="sticky top-0 bg-sky-600 px-3 py-1 font-semibold text-white">B</h4>
  <p class="px-3 py-2">Beatriz</p><p class="px-3 py-2">Bruno</p><p class="px-3 py-2">Berta</p>
  <h4 class="sticky top-0 bg-sky-600 px-3 py-1 font-semibold text-white">C</h4>
  <p class="px-3 py-2">Carlos</p><p class="px-3 py-2">Carmen</p><p class="px-3 py-2">César</p>
</div>`,
    },
    {
      title: 'Texto sobre imagen',
      html: `<div class="relative h-40 overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 to-sky-700">
  <div class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
  <div class="absolute bottom-0 p-4">
    <h4 class="text-lg font-bold text-white">Montañas de colores</h4>
    <p class="text-sm text-zinc-300">El degradado negro hace legible el texto.</p>
  </div>
</div>`,
    },
  ],
} satisfies TailwindSection;
