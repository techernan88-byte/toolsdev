import type { Difficulty } from '../../types';
import { DIFFICULTIES } from '../../utils/byDifficulty';
import { cx } from '../../utils/cx';

interface SectionHeaderProps {
  section: { icon: string; title: string; description: string; tip?: string; difficulty?: Difficulty };
}

/** Título, nivel, descripción y consejo de cualquier sección. */
export default function SectionHeader({ section }: SectionHeaderProps) {
  const level = section.difficulty && DIFFICULTIES[section.difficulty];

  return (
    <header>
      {level && (
        <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-medium ring-1', level.className)}>
          {level.label}
        </span>
      )}
      <h2 className="mt-2 text-3xl font-bold text-white">
        {section.icon} {section.title}
      </h2>
      <p className="mt-2 max-w-3xl text-zinc-400">{section.description}</p>
      {section.tip && (
        <p className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
          💡 {section.tip}
        </p>
      )}
    </header>
  );
}
