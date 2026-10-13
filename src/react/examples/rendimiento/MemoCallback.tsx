import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Cada vez que el componente se renderiza, parpadea en amarillo.
function useRenderFlash<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.animate([{ backgroundColor: 'rgb(250 204 21 / 0.4)' }, { backgroundColor: 'transparent' }], {
      duration: 700,
    });
  }); // sin array: después de CADA render
  return ref;
}

interface ChildProps {
  label: string;
  onClick: () => void;
}

// memo: el hijo solo se vuelve a renderizar si sus props CAMBIAN
const Child = memo(function Child({ label, onClick }: ChildProps) {
  const ref = useRenderFlash<HTMLDivElement>();
  return (
    <div ref={ref} className="rounded-lg p-3 ring-1 ring-white/10">
      <p className="text-sm text-zinc-300">{label}</p>
      <button onClick={onClick} className="mt-2 rounded bg-zinc-700 px-2 py-1 text-xs text-white">
        Saludar
      </button>
    </div>
  );
});

export default function MemoCallback() {
  const [count, setCount] = useState(0);

  // ❌ Función nueva en cada render → para memo es una prop "distinta"
  const handleClickInline = () => console.log('hola');

  // ✅ useCallback devuelve la MISMA función mientras no cambien sus dependencias
  const handleClickStable = useCallback(() => console.log('hola'), []);

  return (
    <div className="space-y-4">
      <button onClick={() => setCount((n) => n + 1)} className="rounded-lg bg-sky-500 px-4 py-2 text-white">
        Re-renderizar al padre ({count})
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <Child label="❌ memo + función normal (parpadea)" onClick={handleClickInline} />
        <Child label="✅ memo + useCallback (no parpadea)" onClick={handleClickStable} />
      </div>
      <p className="text-xs text-zinc-500">
        Nota: solo optimiza cuando haya un problema real medido. memo/useCallback también tienen un coste.
      </p>
    </div>
  );
}
