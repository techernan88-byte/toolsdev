/**
 * Carga (solo una vez y bajo demanda) el compilador de Tailwind para el navegador.
 * Así, al editar el código a mano, cualquier clase nueva genera su CSS al instante.
 * Sin esto solo existirían las clases que Vite encontró al compilar el proyecto.
 */
let runtimePromise: Promise<unknown> | undefined;

export const loadTailwindRuntime = () => {
  runtimePromise ??= import('@tailwindcss/browser');
  return runtimePromise;
};
