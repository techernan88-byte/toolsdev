import type { CodeFile } from '../types';

/**
 * Código fuente de los ejemplos como texto.
 * Vite importa todos los archivos de examples/ con ?raw, así el código que se
 * muestra en la página es EXACTAMENTE el mismo que se ejecuta en la demo.
 */
const sources = import.meta.glob<string>('./examples/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** file('estado/Counter.tsx') -> { name: 'Counter.tsx', code: '...', lang: 'tsx' } */
export function file(path: string): CodeFile {
  const code = sources[`./examples/${path}`];
  if (code === undefined) throw new Error(`No existe el ejemplo: ${path}`);
  return { name: path.split('/').pop(), code, lang: path.endsWith('.tsx') ? 'tsx' : 'ts' };
}
