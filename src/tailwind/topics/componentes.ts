import type { TailwindSection } from '../../types';

export default {
  id: 'componentes',
  icon: '🧩',
  title: 'Componentes de ejemplo',
  description:
    'Componentes comunes combinando lo aprendido. Abre el código, cópialo y modifícalo en tu proyecto.',

  // Sin controles: esta sección solo muestra ejemplos.
  controls: [],

  examples: [
    {
      title: 'Tarjeta de producto',
      html: `<div class="max-w-xs overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/10">
  <div class="aspect-video bg-linear-to-br from-sky-400 to-indigo-600"></div>
  <div class="space-y-2 p-4">
    <span class="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300">Nuevo</span>
    <h3 class="text-lg font-bold text-white">Auriculares Pro</h3>
    <p class="text-sm text-zinc-400">Sonido envolvente y 30h de batería.</p>
    <div class="flex items-center justify-between pt-2">
      <span class="text-xl font-black text-white">$59</span>
      <button class="rounded-lg bg-sky-500 px-3 py-1.5 text-sm text-white hover:bg-sky-400">Comprar</button>
    </div>
  </div>
</div>`,
    },
    {
      title: 'Formulario',
      html: `<form class="max-w-sm space-y-4 rounded-xl bg-zinc-800 p-6 ring-1 ring-white/10">
  <h3 class="text-xl font-bold text-white">Contacto</h3>
  <label class="block">
    <span class="text-sm text-zinc-400">Nombre</span>
    <input class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none" />
  </label>
  <label class="block">
    <span class="text-sm text-zinc-400">Mensaje</span>
    <textarea rows="3" class="mt-1 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"></textarea>
  </label>
  <label class="flex items-center gap-2 text-sm text-zinc-400">
    <input type="checkbox" class="size-4 accent-sky-500" /> Acepto la política de privacidad
  </label>
  <button type="button" class="w-full rounded-lg bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400 active:scale-95">
    Enviar
  </button>
</form>`,
    },
    {
      title: 'Perfil de usuario',
      html: `<div class="flex items-center gap-4 rounded-xl bg-zinc-800 p-4 ring-1 ring-white/10">
  <div class="grid size-14 place-items-center rounded-full bg-violet-500 text-xl font-bold text-white">AN</div>
  <div class="flex-1">
    <p class="font-semibold text-white">Ana Núñez</p>
    <p class="text-sm text-zinc-400">Desarrolladora Frontend</p>
  </div>
  <button class="rounded-full border border-violet-500 px-4 py-1 text-sm text-violet-300 hover:bg-violet-500 hover:text-white">
    Seguir
  </button>
</div>`,
    },
    {
      title: 'Modal / diálogo',
      html: `<div class="relative grid h-64 place-items-center overflow-hidden rounded-xl bg-zinc-700">
  <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
  <div class="relative w-72 rounded-xl bg-zinc-900 p-5 shadow-2xl ring-1 ring-white/10">
    <h3 class="text-lg font-semibold text-white">¿Eliminar proyecto?</h3>
    <p class="mt-1 text-sm text-zinc-400">Esta acción no se puede deshacer.</p>
    <div class="mt-5 flex justify-end gap-2">
      <button class="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5">Cancelar</button>
      <button class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-500">Eliminar</button>
    </div>
  </div>
</div>`,
    },
    {
      title: 'Notificación (toast)',
      html: `<div class="flex max-w-sm items-start gap-3 rounded-xl bg-zinc-800 p-4 shadow-lg ring-1 ring-white/10">
  <span class="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">✓</span>
  <div class="flex-1">
    <p class="font-medium text-white">Cambios guardados</p>
    <p class="text-sm text-zinc-400">Tu perfil se actualizó correctamente.</p>
  </div>
  <button class="text-zinc-500 hover:text-white">✕</button>
</div>`,
    },
    {
      title: 'Migas de pan y paginación',
      html: `<div class="space-y-4 text-sm">
  <nav class="flex items-center gap-2 text-zinc-500">
    <a href="#" class="hover:text-white">Inicio</a><span>/</span>
    <a href="#" class="hover:text-white">Blog</a><span>/</span>
    <span class="text-zinc-200">Tailwind</span>
  </nav>
  <div class="flex gap-1">
    <a href="#" class="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800">←</a>
    <a href="#" class="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800">1</a>
    <a href="#" class="rounded-md bg-sky-500 px-3 py-1.5 text-white">2</a>
    <a href="#" class="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800">3</a>
    <a href="#" class="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800">→</a>
  </div>
</div>`,
    },
    {
      title: 'Tabla de datos',
      html: `<div class="overflow-x-auto rounded-xl ring-1 ring-white/10">
  <table class="w-full text-left text-sm">
    <thead class="bg-zinc-800 text-zinc-400">
      <tr><th class="px-4 py-2">Nombre</th><th class="px-4 py-2">Rol</th><th class="px-4 py-2">Estado</th></tr>
    </thead>
    <tbody class="divide-y divide-white/5 text-zinc-300">
      <tr class="hover:bg-white/5"><td class="px-4 py-2">Ana</td><td class="px-4 py-2">Admin</td><td class="px-4 py-2 text-emerald-400">Activo</td></tr>
      <tr class="hover:bg-white/5"><td class="px-4 py-2">Luis</td><td class="px-4 py-2">Editor</td><td class="px-4 py-2 text-amber-400">Pendiente</td></tr>
      <tr class="hover:bg-white/5"><td class="px-4 py-2">Eva</td><td class="px-4 py-2">Lector</td><td class="px-4 py-2 text-rose-400">Bloqueado</td></tr>
    </tbody>
  </table>
</div>`,
    },
  ],
} satisfies TailwindSection;
