import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from './useOnClickOutside';

const OPTIONS = ['✏️ Editar', '📄 Duplicar', '📦 Archivar', '🗑️ Eliminar'] as const;
type Option = (typeof OPTIONS)[number];

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<Option | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  useOnClickOutside(menuRef, close);

  // Accesibilidad: Escape también cierra
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  return (
    <div className="flex min-h-56 flex-col items-start gap-3">
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
        >
          Acciones ▾
        </button>
        {isOpen && (
          <ul
            role="menu"
            className="absolute left-0 z-10 mt-2 w-44 overflow-hidden rounded-lg bg-zinc-800 shadow-xl ring-1 ring-white/10"
          >
            {OPTIONS.map((option) => (
              <li key={option}>
                <button
                  role="menuitem"
                  onClick={() => {
                    setLastAction(option);
                    close();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-sm text-zinc-500">
        {lastAction ? `Elegiste: ${lastAction}` : 'Abre el menú y haz clic fuera o pulsa Escape.'}
      </p>
    </div>
  );
}
