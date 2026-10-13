import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { SearchableSection } from '../../types';
import { cx } from '../../utils/cx';
import { sectionMatches } from '../../utils/sectionMatches';
import { DIFFICULTIES } from '../../utils/byDifficulty';

interface SidebarProps {
  sections: SearchableSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

/** Menú de secciones con buscador (Ctrl+K): horizontal en móvil, vertical en escritorio. */
export default function Sidebar({ sections, activeId, onSelect }: SidebarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const visibleSections = sections.filter((section) => sectionMatches(section, query));

  // Ctrl+K (o Cmd+K) enfoca el buscador
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && visibleSections[0]) onSelect(visibleSections[0].id);
    if (event.key === 'Escape') setQuery('');
  };

  return (
    <nav className="shrink-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:w-56 lg:self-start lg:overflow-y-auto">
      <div className="relative mb-3">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Buscar tema o código…"
          className="w-full rounded-lg bg-zinc-900 py-2 pr-14 pl-3 text-sm text-zinc-200 ring-1 ring-zinc-800 outline-none placeholder:text-zinc-500 focus:ring-sky-500"
        />
        <kbd className="absolute top-1/2 right-2 -translate-y-1/2 rounded border border-zinc-700 px-1.5 font-mono text-[10px] text-zinc-500">
          Ctrl K
        </kbd>
      </div>

      {visibleSections.length === 0 && <p className="px-3 text-sm text-zinc-500">Sin resultados 🤷</p>}

      <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {visibleSections.map((section, index) => (
          <li key={section.id} className="shrink-0">
            {/* Encabezado del nivel cuando empieza un grupo nuevo */}
            {section.difficulty && section.difficulty !== visibleSections[index - 1]?.difficulty && (
              <p className="hidden px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase first:pt-0 lg:block">
                {DIFFICULTIES[section.difficulty].label}
              </p>
            )}
            <button
              onClick={() => onSelect(section.id)}
              className={cx(
                'w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                section.id === activeId
                  ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              )}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
