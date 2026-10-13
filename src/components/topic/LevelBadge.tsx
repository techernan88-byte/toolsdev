import type { Level } from '../../types';
import { cx } from '../../utils/cx';

export const LEVELS: Record<Level, { label: string; className: string }> = {
  estudiante: { label: '🎓 Estudiante', className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
  industria: { label: '🏢 Industria', className: 'bg-violet-500/15 text-violet-300 ring-violet-500/30' },
};

/** Etiqueta del nivel de un ejemplo. */
export default function LevelBadge({ level }: { level: Level }) {
  const { label, className } = LEVELS[level];
  return (
    <span className={cx('rounded-full px-2 py-0.5 text-xs font-medium ring-1', className)}>{label}</span>
  );
}
