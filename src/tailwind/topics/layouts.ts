import { cx } from '../../utils/cx';
import type { TailwindSection } from '../../types';

// Columnas del cuerpo que tienen barra izquierda / derecha
const WITH_LEFT = ['grid-cols-[180px_1fr]', 'grid-cols-[150px_1fr_150px]'];
const WITH_RIGHT = ['grid-cols-[1fr_180px]', 'grid-cols-[150px_1fr_150px]'];

const CARD = '      <div class="h-20 rounded-lg bg-zinc-700/60"></div>';

export default {
  id: 'layouts',
  icon: '🧱',
  title: 'Layouts de página',
  description:
    'Cómo se acomodan los bloques (header, barras laterales, contenido, footer) en una página completa. Normalmente: flex-col para apilar header/cuerpo/footer y grid para las columnas del cuerpo.',
  tip: 'Usa los botones Móvil / Tablet / Escritorio. Los ejemplos usan container queries (@xl:, @3xl:) para reaccionar al ancho de la vista previa; en tu web real usa md: y lg:.',

  responsivePreview: true,
  wideExamples: true,

  controls: [
    {
      key: 'cabecera',
      label: 'Cabecera',
      hint: 'Haz scroll en la vista previa para ver sticky.',
      options: [
        'bg-sky-600',
        'sticky top-0 z-10 bg-sky-600',
        'sticky top-0 z-10 bg-sky-600/60 backdrop-blur',
      ],
      default: 'sticky top-0 z-10 bg-sky-600',
    },
    {
      key: 'cuerpo',
      label: 'Columnas del cuerpo',
      options: [
        'grid-cols-1',
        'grid-cols-[180px_1fr]',
        'grid-cols-[1fr_180px]',
        'grid-cols-[150px_1fr_150px]',
      ],
      default: 'grid-cols-[180px_1fr]',
    },
    {
      key: 'contenido',
      label: 'Columnas del contenido',
      options: ['grid-cols-1', 'grid-cols-2', 'grid-cols-3'],
      default: 'grid-cols-2',
    },
    { key: 'ancho', label: 'Ancho de la página', options: ['', 'mx-auto max-w-2xl', 'mx-auto max-w-md'] },
    { key: 'gap', label: 'Separación', options: ['gap-0', 'gap-2', 'gap-4'], default: 'gap-2' },
    { key: 'padding', label: 'Padding del cuerpo', options: ['p-0', 'p-2', 'p-4'], default: 'p-2' },
  ],

  previewClass: 'h-[30rem] p-3',

  template: (s) =>
    [
      `<div class="${cx('flex min-h-full flex-col bg-zinc-950 text-sm text-white', s.ancho)}">`,
      `  <header class="${cx('flex items-center justify-between px-4 py-3', s.cabecera)}">`,
      `    <span class="font-bold">Logo</span>`,
      `    <nav class="flex gap-3 text-white/80"><a href="#">Inicio</a><a href="#">Blog</a></nav>`,
      `  </header>`,
      `  <div class="${cx('grid flex-1', s.cuerpo, s.gap, s.padding)}">`,
      WITH_LEFT.includes(s.cuerpo) &&
        `    <aside class="rounded-lg bg-violet-600 p-3">Barra izquierda</aside>`,
      `    <main class="${cx('grid content-start rounded-lg bg-zinc-800 p-3', s.contenido, s.gap)}">`,
      CARD,
      CARD,
      CARD,
      CARD,
      CARD,
      CARD,
      `    </main>`,
      WITH_RIGHT.includes(s.cuerpo) &&
        `    <aside class="rounded-lg bg-emerald-600 p-3">Barra derecha</aside>`,
      `  </div>`,
      `  <footer class="bg-zinc-700 px-4 py-3 text-zinc-300">© 2026 Mi sitio</footer>`,
      `</div>`,
    ]
      .filter(Boolean)
      .join('\n'),

  examples: [
    {
      title: 'Holy Grail (clásico)',
      description:
        'grid-rows-[auto_1fr_auto]: header y footer se ajustan, el centro crece. Las 3 columnas aparecen en escritorio.',
      html: `<div class="grid min-h-80 grid-rows-[auto_1fr_auto] overflow-hidden rounded-xl text-sm text-white">
  <header class="bg-sky-600 p-3">Header</header>
  <div class="grid gap-2 bg-zinc-950 p-2 @3xl:grid-cols-[160px_1fr_160px]">
    <nav class="rounded bg-violet-600 p-3">Navegación</nav>
    <main class="min-h-40 rounded bg-zinc-800 p-3">Contenido principal</main>
    <aside class="rounded bg-emerald-600 p-3">Anuncios</aside>
  </div>
  <footer class="bg-zinc-700 p-3">Footer</footer>
</div>`,
    },
    {
      title: 'Dashboard',
      description: 'Barra lateral fija (oculta en móvil) + barra superior + tarjetas de estadísticas.',
      html: `<div class="flex min-h-96 overflow-hidden rounded-xl bg-zinc-950 text-sm text-zinc-300 ring-1 ring-white/10">
  <aside class="hidden w-48 shrink-0 flex-col gap-1 border-r border-white/10 p-3 @3xl:flex">
    <p class="mb-3 px-2 font-bold text-white">⚡ Panel</p>
    <a href="#" class="rounded-md bg-sky-500/15 px-2 py-1.5 text-sky-300">📊 Resumen</a>
    <a href="#" class="rounded-md px-2 py-1.5 hover:bg-white/5">👥 Clientes</a>
    <a href="#" class="rounded-md px-2 py-1.5 hover:bg-white/5">📦 Pedidos</a>
    <a href="#" class="rounded-md px-2 py-1.5 hover:bg-white/5">⚙️ Ajustes</a>
  </aside>
  <div class="flex min-w-0 flex-1 flex-col">
    <header class="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
      <input placeholder="Buscar…" class="w-full max-w-64 rounded-md bg-zinc-800 px-3 py-1.5 outline-none focus:ring-2 focus:ring-sky-500/50" />
      <div class="size-8 shrink-0 rounded-full bg-violet-500"></div>
    </header>
    <main class="space-y-3 p-4">
      <div class="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        <div class="rounded-lg bg-zinc-900 p-3 ring-1 ring-white/10"><p class="text-xs text-zinc-500">Ventas</p><p class="text-xl font-bold text-white">$12.4k</p><p class="text-xs text-emerald-400">+12%</p></div>
        <div class="rounded-lg bg-zinc-900 p-3 ring-1 ring-white/10"><p class="text-xs text-zinc-500">Pedidos</p><p class="text-xl font-bold text-white">320</p><p class="text-xs text-emerald-400">+4%</p></div>
        <div class="rounded-lg bg-zinc-900 p-3 ring-1 ring-white/10"><p class="text-xs text-zinc-500">Clientes</p><p class="text-xl font-bold text-white">1.204</p><p class="text-xs text-rose-400">-2%</p></div>
        <div class="rounded-lg bg-zinc-900 p-3 ring-1 ring-white/10"><p class="text-xs text-zinc-500">Visitas</p><p class="text-xl font-bold text-white">8.9k</p><p class="text-xs text-emerald-400">+20%</p></div>
      </div>
      <div class="grid gap-3 @3xl:grid-cols-3">
        <div class="rounded-lg bg-zinc-900 p-3 ring-1 ring-white/10 @3xl:col-span-2">
          <p class="mb-2 text-white">Ventas por mes</p>
          <div class="flex h-28 items-end gap-2">
            <div class="h-1/3 flex-1 rounded-t bg-sky-500/60"></div>
            <div class="h-1/2 flex-1 rounded-t bg-sky-500/60"></div>
            <div class="h-2/3 flex-1 rounded-t bg-sky-500/60"></div>
            <div class="h-2/5 flex-1 rounded-t bg-sky-500/60"></div>
            <div class="h-4/5 flex-1 rounded-t bg-sky-500/60"></div>
            <div class="h-full flex-1 rounded-t bg-sky-400"></div>
          </div>
        </div>
        <ul class="space-y-2 rounded-lg bg-zinc-900 p-3 ring-1 ring-white/10">
          <li class="text-white">Actividad</li>
          <li>🟢 Nuevo pedido #204</li>
          <li>🔵 Cliente registrado</li>
          <li>🟠 Pago pendiente</li>
        </ul>
      </div>
    </main>
  </div>
</div>`,
    },
    {
      title: 'Blog con barra lateral',
      description: 'Artículo + aside; en móvil el aside pasa debajo.',
      html: `<div class="overflow-hidden rounded-xl bg-zinc-950 text-zinc-300 ring-1 ring-white/10">
  <header class="border-b border-white/10 px-6 py-4 font-bold text-white">📝 Mi Blog</header>
  <div class="mx-auto grid max-w-5xl gap-8 p-6 @3xl:grid-cols-[1fr_240px]">
    <article class="space-y-4">
      <p class="text-sm text-sky-400">Tutorial · 12 oct 2026</p>
      <h1 class="text-3xl font-black text-white">Cómo maquetar con Grid</h1>
      <div class="aspect-video rounded-lg bg-linear-to-br from-sky-600 to-violet-700"></div>
      <p class="leading-relaxed">Grid es perfecto para estructurar páginas completas: defines las columnas en el padre y cada bloque se coloca solo.</p>
      <p class="leading-relaxed">Combínalo con flex para alinear elementos dentro de cada bloque.</p>
    </article>
    <aside class="space-y-4">
      <div class="rounded-lg bg-zinc-900 p-4 ring-1 ring-white/10">
        <p class="font-semibold text-white">Sobre mí</p>
        <p class="text-sm text-zinc-400">Desarrollador frontend que escribe sobre CSS.</p>
      </div>
      <div class="rounded-lg bg-zinc-900 p-4 ring-1 ring-white/10">
        <p class="mb-2 font-semibold text-white">Etiquetas</p>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="rounded bg-zinc-800 px-2 py-1">css</span>
          <span class="rounded bg-zinc-800 px-2 py-1">grid</span>
          <span class="rounded bg-zinc-800 px-2 py-1">tailwind</span>
        </div>
      </div>
    </aside>
  </div>
</div>`,
    },
    {
      title: 'Pantalla dividida (login)',
      description: 'Dos mitades en escritorio; en móvil solo el formulario.',
      html: `<div class="grid min-h-96 overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-white/10 @3xl:grid-cols-2">
  <div class="hidden flex-col justify-end bg-linear-to-br from-indigo-600 to-fuchsia-700 p-8 @3xl:flex">
    <p class="text-2xl font-bold text-white">"La mejor herramienta que he usado."</p>
    <p class="mt-2 text-white/70">— Laura, CTO</p>
  </div>
  <div class="grid place-items-center p-8">
    <form class="w-full max-w-xs space-y-4">
      <h2 class="text-2xl font-bold text-white">Bienvenido 👋</h2>
      <input placeholder="Correo" class="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500" />
      <input type="password" placeholder="Contraseña" class="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500" />
      <button type="button" class="w-full rounded-lg bg-sky-500 py-2 font-semibold text-white hover:bg-sky-400">Entrar</button>
    </form>
  </div>
</div>`,
    },
    {
      title: 'Galería tipo Pinterest (masonry)',
      description: 'columns-* reparte los hijos en columnas como un periódico.',
      html: `<div class="columns-2 gap-3 *:mb-3 *:break-inside-avoid @xl:columns-3 @3xl:columns-4">
  <div class="h-32 rounded-lg bg-linear-to-br from-rose-500 to-orange-400"></div>
  <div class="h-48 rounded-lg bg-linear-to-br from-sky-500 to-indigo-600"></div>
  <div class="h-24 rounded-lg bg-linear-to-br from-emerald-400 to-teal-600"></div>
  <div class="h-40 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600"></div>
  <div class="h-28 rounded-lg bg-linear-to-br from-amber-400 to-rose-500"></div>
  <div class="h-52 rounded-lg bg-linear-to-br from-cyan-400 to-sky-700"></div>
  <div class="h-36 rounded-lg bg-linear-to-br from-lime-400 to-emerald-600"></div>
  <div class="h-24 rounded-lg bg-linear-to-br from-pink-500 to-violet-600"></div>
</div>`,
    },
  ],
} satisfies TailwindSection;
