import type { Snippet } from '../types';

/**
 * Los ejemplos de TypeScript son archivos .ts REALES del proyecto:
 * - se comprueban con tsc al compilar (si un ejemplo tiene un error de tipos, el build falla),
 * - su función "export default" es la que ejecuta el botón ▶ Ejecutar,
 * - y su código fuente se muestra tal cual (import ?raw).
 */
const sources = import.meta.glob<string>('./examples/**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const demos = import.meta.glob<() => void | Promise<void>>('./examples/**/*.ts', {
  import: 'default',
  eager: true,
});

/** example('basicos/primitivos.ts', 'Título', 'Descripción') → snippet ejecutable */
export function example(path: string, title: string, description?: string): Snippet {
  const key = `./examples/${path}`;
  const code = sources[key];
  const run = demos[key];
  if (code === undefined || run === undefined) throw new Error(`No existe el ejemplo: ${path}`);
  return { title, description, files: [{ name: path.split('/').pop(), code, lang: 'ts' }], run };
}
