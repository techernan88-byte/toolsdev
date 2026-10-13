import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

export default {
  id: 'tipografia',
  icon: '🔤',
  title: 'Tipografía',
  description:
    'Controla tamaño (text-*), peso (font-*), familia, alineación, decoración, espaciado entre letras (tracking-*) y altura de línea (leading-*).',
  tip: 'text-* sirve para tamaño Y color: text-xl es tamaño, text-red-500 es color.',

  controls: [
    {
      key: 'tamano',
      label: 'Tamaño',
      options: [
        'text-xs',
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-6xl',
      ],
      default: 'text-2xl',
    },
    {
      key: 'peso',
      label: 'Peso',
      options: [
        'font-thin',
        'font-light',
        'font-normal',
        'font-medium',
        'font-semibold',
        'font-bold',
        'font-extrabold',
        'font-black',
      ],
      default: 'font-bold',
    },
    { key: 'familia', label: 'Familia', options: ['font-sans', 'font-serif', 'font-mono'] },
    {
      key: 'color',
      label: 'Color',
      options: ['text-zinc-100', 'text-zinc-400', 'text-sky-400', 'text-amber-300', 'text-rose-400'],
    },
    {
      key: 'alineacion',
      label: 'Alineación',
      options: ['text-left', 'text-center', 'text-right', 'text-justify'],
    },
    {
      key: 'transformacion',
      label: 'Mayúsculas / minúsculas',
      options: ['', 'uppercase', 'lowercase', 'capitalize'],
    },
    {
      key: 'decoracion',
      label: 'Decoración',
      options: [
        '',
        'italic',
        'underline',
        'overline',
        'line-through',
        'underline decoration-wavy decoration-pink-500',
        'underline decoration-sky-400 decoration-4 underline-offset-8',
      ],
    },
    {
      key: 'tracking',
      label: 'Espaciado de letras',
      options: ['tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-widest'],
      default: 'tracking-normal',
    },
    {
      key: 'leading',
      label: 'Altura de línea',
      options: ['leading-none', 'leading-tight', 'leading-normal', 'leading-loose'],
      default: 'leading-normal',
    },
    {
      key: 'sombra',
      label: 'Sombra de texto',
      options: [
        '',
        'text-shadow-sm',
        'text-shadow-lg text-shadow-sky-500/60',
        'text-shadow-lg text-shadow-fuchsia-500/60',
      ],
    },
  ],

  template: (
    s
  ) => `<p class="${cx(s.tamano, s.peso, s.familia, s.color, s.alineacion, s.transformacion, s.decoracion, s.tracking, s.leading, s.sombra)}">
  Tailwind te permite dar estilo sin salir del HTML. Prueba cada opción y mira cómo cambia este párrafo.
</p>`,

  examples: [
    {
      title: 'Título con subtítulo',
      html: `<div>
  <p class="text-sm font-semibold tracking-wide text-sky-400 uppercase">Blog</p>
  <h2 class="text-3xl font-extrabold text-white">Mi primer artículo</h2>
  <p class="mt-2 text-zinc-400">Publicado hace 2 días · 5 min de lectura</p>
</div>`,
    },
    {
      title: 'Cita',
      html: `<blockquote class="border-l-4 border-sky-500 pl-4 text-lg text-zinc-300 italic">
  "El mejor código es el que se entiende a la primera."
  <footer class="mt-2 text-sm text-zinc-500 not-italic">— Alguien sabio</footer>
</blockquote>`,
    },
    {
      title: 'Cortar texto largo',
      description: 'truncate = una línea con "…"; line-clamp-2 = máximo 2 líneas.',
      html: `<div class="w-64 space-y-3 text-zinc-300">
  <p class="truncate">Este texto es demasiado largo para caber en una sola línea.</p>
  <p class="line-clamp-2">Este párrafo es largo y solo muestra dos líneas como máximo, el resto queda oculto con puntos suspensivos al final.</p>
</div>`,
    },
    {
      title: 'Listas',
      description: 'list-disc / list-decimal + marker: para colorear la viñeta.',
      html: `<div class="grid grid-cols-2 gap-4 text-zinc-300">
  <ul class="list-inside list-disc marker:text-sky-400">
    <li>HTML</li>
    <li>CSS</li>
    <li>Tailwind</li>
  </ul>
  <ol class="list-inside list-decimal marker:font-bold marker:text-amber-400">
    <li>Instalar</li>
    <li>Configurar</li>
    <li>Programar</li>
  </ol>
</div>`,
    },
    {
      title: 'Atajos de teclado y código',
      html: `<p class="text-zinc-300">
  Pulsa <kbd class="rounded border border-zinc-600 bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">Ctrl</kbd> +
  <kbd class="rounded border border-zinc-600 bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">K</kbd>
  o ejecuta <code class="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-pink-400">npm run dev</code>
</p>`,
    },
  ],
} satisfies TailwindSection;
