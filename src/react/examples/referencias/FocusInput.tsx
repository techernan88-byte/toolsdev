import { useRef } from 'react';

// useRef da acceso directo a un elemento del DOM.
// El genérico <HTMLInputElement> le dice a TypeScript qué elemento es.
export default function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex max-w-sm gap-2">
      <input
        ref={inputRef}
        placeholder="Haz clic en el botón →"
        className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
      />
      {/* ?. porque current es null hasta que el input se monta */}
      <button
        onClick={() => inputRef.current?.focus()}
        className="rounded-lg bg-sky-500 px-4 text-white hover:bg-sky-400"
      >
        Enfocar
      </button>
    </div>
  );
}
