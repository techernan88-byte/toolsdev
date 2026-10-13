import type { Difficulty } from '../types';

export const DIFFICULTIES: Record<Difficulty, { label: string; className: string }> = {
  basico: { label: '🟢 Básico', className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
  intermedio: { label: '🟡 Intermedio', className: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
  avanzado: { label: '🔴 Avanzado', className: 'bg-rose-500/15 text-rose-300 ring-rose-500/30' },
};

/**
 * Convierte { basico: [...], intermedio: [...], avanzado: [...] } en una lista
 * ordenada de lo más fácil a lo más complejo, marcando cada sección con su nivel.
 */
export function byDifficulty<T>(groups: Record<Difficulty, T[]>): Array<T & { difficulty: Difficulty }> {
  const order = Object.keys(DIFFICULTIES) as Difficulty[];
  return order.flatMap((difficulty) => groups[difficulty].map((section) => ({ ...section, difficulty })));
}
