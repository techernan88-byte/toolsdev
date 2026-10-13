import type { SearchableSection } from '../../types';

interface SectionPagerProps {
  prev?: SearchableSection;
  next?: SearchableSection;
  onSelect: (id: string) => void;
}

const linkClass =
  'flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-sky-500/50 hover:bg-sky-500/5';

/** Botones "← Anterior" / "Siguiente →" al final de cada sección. */
export default function SectionPager({ prev, next, onSelect }: SectionPagerProps) {
  return (
    <nav className="flex gap-4 border-t border-zinc-800 pt-6">
      {prev ? (
        <button onClick={() => onSelect(prev.id)} className={`${linkClass} text-left`}>
          <span className="text-xs text-zinc-500">← Anterior</span>
          <p className="font-semibold text-zinc-200">
            {prev.icon} {prev.title}
          </p>
        </button>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <button onClick={() => onSelect(next.id)} className={`${linkClass} text-right`}>
          <span className="text-xs text-zinc-500">Siguiente →</span>
          <p className="font-semibold text-zinc-200">
            {next.icon} {next.title}
          </p>
        </button>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
