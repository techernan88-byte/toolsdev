import type { TailwindSection } from '../../types';

export default {
  id: 'landing',
  icon: '🚀',
  title: 'Landing pages',
  description:
    'Bloques típicos de una landing page: navegación, hero, características, testimonios, precios, preguntas frecuentes, llamada a la acción y footer. Copia los que necesites y apílalos.',
  tip: 'Prueba Móvil / Tablet / Escritorio en cada bloque. En tu web real cambia @xl: por md: y @3xl: por lg:.',

  responsivePreview: true,
  wideExamples: true,
  controls: [],

  examples: [
    {
      title: 'Barra de navegación',
      html: `<nav class="flex items-center justify-between rounded-xl bg-zinc-900 px-5 py-3 ring-1 ring-white/10">
  <a href="#" class="flex items-center gap-2 font-bold text-white">
    <span class="grid size-8 place-items-center rounded-lg bg-sky-500">⚡</span> Rayo
  </a>
  <div class="hidden gap-6 text-sm text-zinc-400 @xl:flex">
    <a href="#" class="hover:text-white">Producto</a>
    <a href="#" class="hover:text-white">Precios</a>
    <a href="#" class="hover:text-white">Blog</a>
  </div>
  <a href="#" class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">Empezar</a>
</nav>`,
    },
    {
      title: 'Hero centrado',
      html: `<section class="relative overflow-hidden rounded-2xl bg-zinc-950 px-6 py-20 text-center ring-1 ring-white/10">
  <div class="absolute inset-x-0 -top-24 mx-auto h-56 w-2/3 rounded-full bg-sky-500/30 blur-3xl"></div>
  <div class="relative mx-auto max-w-2xl">
    <span class="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 ring-1 ring-sky-500/30">Nuevo · v2.0 disponible</span>
    <h1 class="mt-6 text-4xl font-black tracking-tight text-white @xl:text-6xl">
      Crea interfaces
      <span class="bg-linear-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-transparent">increíbles</span>
    </h1>
    <p class="mt-4 text-zinc-400 @xl:text-lg">Diseña más rápido con clases utilitarias. Sin salir de tu HTML.</p>
    <div class="mt-8 flex flex-col justify-center gap-3 @xl:flex-row">
      <a href="#" class="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400">Empieza gratis</a>
      <a href="#" class="rounded-lg px-6 py-3 font-semibold text-white ring-1 ring-white/20 hover:bg-white/5">Ver demo →</a>
    </div>
  </div>
</section>`,
    },
    {
      title: 'Hero dividido (texto + imagen)',
      html: `<section class="grid items-center gap-10 rounded-2xl bg-zinc-950 p-8 ring-1 ring-white/10 @3xl:grid-cols-2">
  <div>
    <h1 class="text-4xl font-black text-white @3xl:text-5xl">Lanza tu producto en días, no meses</h1>
    <p class="mt-4 text-zinc-400">Plantillas, componentes y todo lo que necesitas para salir a producción.</p>
    <div class="mt-6 flex gap-3">
      <a href="#" class="rounded-lg bg-fuchsia-500 px-5 py-3 font-semibold text-white hover:bg-fuchsia-400">Comenzar</a>
      <a href="#" class="rounded-lg px-5 py-3 font-semibold text-zinc-300 hover:text-white">Saber más</a>
    </div>
    <div class="mt-8 flex gap-8">
      <div><p class="text-2xl font-bold text-white">10k+</p><p class="text-sm text-zinc-500">usuarios</p></div>
      <div><p class="text-2xl font-bold text-white">4.9★</p><p class="text-sm text-zinc-500">valoración</p></div>
    </div>
  </div>
  <div class="grid aspect-video place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-600 text-6xl shadow-2xl shadow-fuchsia-500/20">🚀</div>
</section>`,
    },
    {
      title: 'Logos de clientes',
      html: `<section class="rounded-2xl bg-zinc-950 px-6 py-8 text-center ring-1 ring-white/10">
  <p class="text-sm text-zinc-500">Confían en nosotros</p>
  <div class="mt-4 grid grid-cols-2 gap-6 text-lg font-bold text-zinc-600 @xl:grid-cols-5">
    <span class="hover:text-zinc-300">ACME</span>
    <span class="hover:text-zinc-300">Globex</span>
    <span class="hover:text-zinc-300">Initech</span>
    <span class="hover:text-zinc-300">Umbrella</span>
    <span class="hover:text-zinc-300">Hooli</span>
  </div>
</section>`,
    },
    {
      title: 'Características (features)',
      html: `<section class="rounded-2xl bg-zinc-950 p-8 ring-1 ring-white/10">
  <div class="mx-auto max-w-xl text-center">
    <p class="font-semibold text-sky-400">Todo incluido</p>
    <h2 class="mt-2 text-3xl font-bold text-white">Lo que necesitas para crecer</h2>
  </div>
  <div class="mt-10 grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
      <div class="grid size-10 place-items-center rounded-lg bg-sky-500/15 text-xl">⚡</div>
      <h3 class="mt-4 font-semibold text-white">Rápido</h3>
      <p class="mt-1 text-sm text-zinc-400">Carga en milisegundos gracias a un CSS mínimo.</p>
    </div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
      <div class="grid size-10 place-items-center rounded-lg bg-emerald-500/15 text-xl">🔒</div>
      <h3 class="mt-4 font-semibold text-white">Seguro</h3>
      <p class="mt-1 text-sm text-zinc-400">Buenas prácticas de seguridad desde el primer día.</p>
    </div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
      <div class="grid size-10 place-items-center rounded-lg bg-fuchsia-500/15 text-xl">🎨</div>
      <h3 class="mt-4 font-semibold text-white">Personalizable</h3>
      <p class="mt-1 text-sm text-zinc-400">Cambia colores y estilos sin tocar CSS.</p>
    </div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
      <div class="grid size-10 place-items-center rounded-lg bg-amber-500/15 text-xl">📱</div>
      <h3 class="mt-4 font-semibold text-white">Responsive</h3>
      <p class="mt-1 text-sm text-zinc-400">Se ve bien en móvil, tablet y escritorio.</p>
    </div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
      <div class="grid size-10 place-items-center rounded-lg bg-rose-500/15 text-xl">🌙</div>
      <h3 class="mt-4 font-semibold text-white">Modo oscuro</h3>
      <p class="mt-1 text-sm text-zinc-400">Tus usuarios (y sus ojos) lo agradecerán.</p>
    </div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
      <div class="grid size-10 place-items-center rounded-lg bg-violet-500/15 text-xl">🧩</div>
      <h3 class="mt-4 font-semibold text-white">Componentes</h3>
      <p class="mt-1 text-sm text-zinc-400">Más de 100 bloques listos para copiar.</p>
    </div>
  </div>
</section>`,
    },
    {
      title: 'Testimonios',
      html: `<section class="grid gap-4 rounded-2xl bg-zinc-950 p-8 ring-1 ring-white/10 @3xl:grid-cols-3">
  <figure class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
    <blockquote class="text-zinc-300">"Redujimos el tiempo de desarrollo a la mitad."</blockquote>
    <figcaption class="mt-4 flex items-center gap-3">
      <div class="size-10 rounded-full bg-sky-500"></div>
      <div><p class="font-semibold text-white">Ana López</p><p class="text-sm text-zinc-500">CEO, Startup</p></div>
    </figcaption>
  </figure>
  <figure class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
    <blockquote class="text-zinc-300">"La documentación es clarísima. Nos encanta."</blockquote>
    <figcaption class="mt-4 flex items-center gap-3">
      <div class="size-10 rounded-full bg-fuchsia-500"></div>
      <div><p class="font-semibold text-white">Diego Ruiz</p><p class="text-sm text-zinc-500">Frontend Dev</p></div>
    </figcaption>
  </figure>
  <figure class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10">
    <blockquote class="text-zinc-300">"Por fin un diseño oscuro que no cansa la vista."</blockquote>
    <figcaption class="mt-4 flex items-center gap-3">
      <div class="size-10 rounded-full bg-emerald-500"></div>
      <div><p class="font-semibold text-white">Sofía Martín</p><p class="text-sm text-zinc-500">Diseñadora UX</p></div>
    </figcaption>
  </figure>
</section>`,
    },
    {
      title: 'Precios',
      description: 'El plan destacado se agranda con scale-105 en escritorio.',
      html: `<section class="grid items-center gap-4 rounded-2xl bg-zinc-950 p-8 ring-1 ring-white/10 @3xl:grid-cols-3">
  <div class="rounded-xl bg-zinc-900 p-6 ring-1 ring-white/10">
    <h3 class="font-semibold text-zinc-400">Básico</h3>
    <p class="mt-2 text-4xl font-black text-white">$0<span class="text-base font-normal text-zinc-500">/mes</span></p>
    <ul class="mt-4 space-y-2 text-sm text-zinc-400"><li>✓ 1 proyecto</li><li>✓ Soporte por email</li></ul>
    <a href="#" class="mt-6 block rounded-lg py-2 text-center text-white ring-1 ring-white/20 hover:bg-white/5">Elegir</a>
  </div>
  <div class="rounded-xl bg-zinc-900 p-6 ring-2 ring-sky-500 @3xl:scale-105">
    <span class="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">Popular</span>
    <h3 class="mt-2 font-semibold text-sky-400">Pro</h3>
    <p class="mt-2 text-4xl font-black text-white">$12<span class="text-base font-normal text-zinc-500">/mes</span></p>
    <ul class="mt-4 space-y-2 text-sm text-zinc-400"><li>✓ Proyectos ilimitados</li><li>✓ Soporte prioritario</li><li>✓ Analíticas</li></ul>
    <a href="#" class="mt-6 block rounded-lg bg-sky-500 py-2 text-center font-semibold text-white hover:bg-sky-400">Elegir</a>
  </div>
  <div class="rounded-xl bg-zinc-900 p-6 ring-1 ring-white/10">
    <h3 class="font-semibold text-zinc-400">Empresa</h3>
    <p class="mt-2 text-4xl font-black text-white">$49<span class="text-base font-normal text-zinc-500">/mes</span></p>
    <ul class="mt-4 space-y-2 text-sm text-zinc-400"><li>✓ Todo lo de Pro</li><li>✓ SSO y auditoría</li></ul>
    <a href="#" class="mt-6 block rounded-lg py-2 text-center text-white ring-1 ring-white/20 hover:bg-white/5">Contactar</a>
  </div>
</section>`,
    },
    {
      title: 'Preguntas frecuentes (FAQ)',
      description: 'Interactivo sin JavaScript: <details> + group-open:',
      html: `<section class="mx-auto max-w-2xl space-y-2 rounded-2xl bg-zinc-950 p-6 ring-1 ring-white/10">
  <h2 class="mb-4 text-2xl font-bold text-white">Preguntas frecuentes</h2>
  <details class="group rounded-lg bg-zinc-900 p-4 ring-1 ring-white/10">
    <summary class="flex cursor-pointer list-none items-center justify-between font-medium text-white">
      ¿Puedo cancelar cuando quiera?<span class="transition group-open:rotate-45">＋</span>
    </summary>
    <p class="mt-3 text-zinc-400">Sí, sin permanencia ni penalizaciones.</p>
  </details>
  <details class="group rounded-lg bg-zinc-900 p-4 ring-1 ring-white/10">
    <summary class="flex cursor-pointer list-none items-center justify-between font-medium text-white">
      ¿Hay prueba gratuita?<span class="transition group-open:rotate-45">＋</span>
    </summary>
    <p class="mt-3 text-zinc-400">14 días gratis, sin tarjeta.</p>
  </details>
</section>`,
    },
    {
      title: 'Llamada a la acción (CTA)',
      html: `<section class="flex flex-col items-center justify-between gap-6 rounded-2xl bg-linear-to-r from-sky-600 to-indigo-700 p-8 text-center @3xl:flex-row @3xl:text-left">
  <div>
    <h2 class="text-3xl font-bold text-white">¿Listo para empezar?</h2>
    <p class="mt-2 text-sky-100">Únete a miles de equipos que ya lo usan.</p>
  </div>
  <form class="flex w-full max-w-md flex-col gap-2 @xl:flex-row">
    <input type="email" placeholder="tu@correo.com" class="flex-1 rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-sky-100/70 ring-1 ring-white/30 outline-none focus:ring-white" />
    <button type="button" class="rounded-lg bg-white px-5 py-3 font-semibold text-indigo-700 hover:bg-sky-50">Suscribirme</button>
  </form>
</section>`,
    },
    {
      title: 'Footer con columnas',
      html: `<footer class="rounded-2xl bg-zinc-950 p-8 text-sm ring-1 ring-white/10">
  <div class="grid grid-cols-2 gap-8 @3xl:grid-cols-5">
    <div class="col-span-2">
      <p class="font-bold text-white">⚡ Rayo</p>
      <p class="mt-2 max-w-xs text-zinc-500">Herramientas para crear productos digitales más rápido.</p>
    </div>
    <div class="space-y-2"><p class="font-semibold text-white">Producto</p><a href="#" class="block text-zinc-400 hover:text-white">Funciones</a><a href="#" class="block text-zinc-400 hover:text-white">Precios</a></div>
    <div class="space-y-2"><p class="font-semibold text-white">Empresa</p><a href="#" class="block text-zinc-400 hover:text-white">Nosotros</a><a href="#" class="block text-zinc-400 hover:text-white">Blog</a></div>
    <div class="space-y-2"><p class="font-semibold text-white">Legal</p><a href="#" class="block text-zinc-400 hover:text-white">Privacidad</a><a href="#" class="block text-zinc-400 hover:text-white">Términos</a></div>
  </div>
  <div class="mt-8 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-zinc-500 @xl:flex-row">
    <p>© 2026 Rayo. Todos los derechos reservados.</p>
    <p>Hecho con Tailwind 💙</p>
  </div>
</footer>`,
    },
    {
      title: '⭐ Landing completa',
      description: 'Todos los bloques juntos: nav sticky, hero, features, CTA y footer.',
      html: `<div class="h-[36rem] overflow-y-auto rounded-2xl bg-zinc-950 text-zinc-300 ring-1 ring-white/10">
  <nav class="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/70 px-6 py-3 backdrop-blur">
    <span class="font-bold text-white">🌙 Noctua</span>
    <div class="hidden gap-6 text-sm @xl:flex"><a href="#" class="hover:text-white">Funciones</a><a href="#" class="hover:text-white">Precios</a></div>
    <a href="#" class="rounded-lg bg-violet-500 px-4 py-1.5 text-sm font-semibold text-white">Entrar</a>
  </nav>

  <section class="relative px-6 py-24 text-center">
    <div class="absolute inset-x-0 top-0 mx-auto h-64 w-1/2 rounded-full bg-violet-600/30 blur-3xl"></div>
    <h1 class="relative text-4xl font-black text-white @xl:text-6xl">Programa de noche,<br />sin cansar la vista</h1>
    <p class="relative mx-auto mt-4 max-w-lg text-zinc-400">El editor oscuro pensado para desarrolladores.</p>
    <a href="#" class="relative mt-8 inline-block rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white hover:bg-violet-400">Descargar gratis</a>
  </section>

  <section class="grid gap-4 px-6 pb-16 @3xl:grid-cols-3">
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10"><p class="text-2xl">⚡</p><h3 class="mt-2 font-semibold text-white">Rápido</h3><p class="text-sm">Abre proyectos enormes al instante.</p></div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10"><p class="text-2xl">🧠</p><h3 class="mt-2 font-semibold text-white">Inteligente</h3><p class="text-sm">Autocompletado que entiende tu código.</p></div>
    <div class="rounded-xl bg-zinc-900 p-5 ring-1 ring-white/10"><p class="text-2xl">🔌</p><h3 class="mt-2 font-semibold text-white">Extensible</h3><p class="text-sm">Miles de plugins de la comunidad.</p></div>
  </section>

  <section class="mx-6 mb-16 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 p-8 text-center">
    <h2 class="text-2xl font-bold text-white">Empieza hoy mismo</h2>
    <a href="#" class="mt-4 inline-block rounded-lg bg-white px-5 py-2 font-semibold text-violet-700">Crear cuenta</a>
  </section>

  <footer class="border-t border-white/10 px-6 py-6 text-center text-sm text-zinc-500">© 2026 Noctua</footer>
</div>`,
    },
  ],
} satisfies TailwindSection;
