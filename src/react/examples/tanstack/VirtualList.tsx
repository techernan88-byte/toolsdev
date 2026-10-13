import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// Virtualización: con 10.000 filas, solo se crean en el DOM las que se VEN
// (+ unas pocas extra). El resto es un espacio vacío con la altura correcta.

const ROWS = Array.from({ length: 10_000 }, (_, index) => `Fila número ${(index + 1).toLocaleString('es')}`);

export default function VirtualList() {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: ROWS.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // alto aproximado de cada fila en px
    overscan: 5, // filas extra arriba/abajo para que el scroll sea suave
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="max-w-md space-y-2">
      <div ref={parentRef} className="h-72 overflow-auto rounded-lg bg-zinc-800/50 ring-1 ring-white/10">
        {/* Contenedor con la altura TOTAL para que la barra de scroll sea real */}
        <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
          {virtualItems.map((item) => (
            <div
              key={item.key}
              className={`absolute top-0 left-0 flex w-full items-center px-3 text-sm ${item.index % 2 ? 'text-zinc-300' : 'bg-white/5 text-zinc-200'}`}
              style={{ height: item.size, transform: `translateY(${item.start}px)` }}
            >
              {ROWS[item.index]}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        {ROWS.length.toLocaleString('es')} filas · solo{' '}
        <b className="text-emerald-400">{virtualItems.length}</b> en el DOM ahora mismo
      </p>
    </div>
  );
}
