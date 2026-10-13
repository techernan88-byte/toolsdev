import { lazy, Suspense, useState } from 'react';

// lazy(): el código de HeavyChart se descarga solo cuando se necesita
// (code splitting). Suspense muestra un "fallback" mientras tanto.
// El retraso artificial es solo para que veas la carga.
const HeavyChart = lazy(() =>
  new Promise((resolve) => setTimeout(resolve, 1500)).then(() => import('./HeavyChart'))
);

export default function LazyDemo() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowChart((prev) => !prev)}
        className="rounded-lg bg-sky-500 px-4 py-2 text-white"
      >
        {showChart ? 'Ocultar gráfico' : 'Cargar gráfico'}
      </button>
      {showChart && (
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-zinc-800" />}>
          <HeavyChart />
        </Suspense>
      )}
      <p className="text-xs text-zinc-500">La segunda vez es instantáneo: el módulo ya está en caché.</p>
    </div>
  );
}
