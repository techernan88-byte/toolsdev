/**
 * Clases de Tailwind que se repiten en varios componentes.
 * Cambiarlas aquí cambia todos los sitios donde se usan.
 */

/** Botón pequeño de las barras de herramientas (Copiar, Editar, Restaurar…) */
export const toolbarButton =
  'shrink-0 rounded-md px-2 py-1 text-xs text-zinc-300 ring-1 ring-zinc-700 hover:bg-zinc-800';

/** Pestaña de una barra (HTML / CSS, nombres de archivo…), activa o no */
export const tabButton = (isActive: boolean) =>
  `rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-200'
  }`;

/** Contenedor de un bloque de código y su barra superior */
export const codeFrame = 'overflow-hidden rounded-xl border border-zinc-800 bg-black';
export const codeToolbar =
  'flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/60 px-2 py-1.5';
