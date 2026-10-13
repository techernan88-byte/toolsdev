import { useMemo, useState } from 'react';

interface PrimeResult {
  count: number;
  ms: string;
}

// Cálculo pesado: contar números primos hasta "limit"
function countPrimes(limit: number): PrimeResult {
  const start = performance.now();
  let count = 0;
  for (let n = 2; n <= limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return { count, ms: (performance.now() - start).toFixed(1) };
}

export default function ExpensiveCalc() {
  const [limit, setLimit] = useState(300_000);
  const [isDark, setIsDark] = useState(true);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  // useMemo: solo recalcula cuando cambia "limit"
  const memoized = useMemo(() => countPrimes(limit), [limit]);
  // Sin useMemo: se recalcula en CADA render (aunque solo cambie el tema)
  const result = useMemoEnabled ? memoized : countPrimes(limit);

  return (
    <div
      className={`space-y-4 rounded-xl p-5 transition ${isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'}`}
    >
      <label className="block text-sm">
        Primos hasta <b>{limit.toLocaleString('es')}</b>
        <input
          type="range"
          min={10_000}
          max={1_000_000}
          step={10_000}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="mt-2 w-full accent-sky-500"
        />
      </label>

      <p className="text-2xl font-bold">{result.count.toLocaleString('es')} primos</p>
      <p className="text-sm opacity-70">⏱️ Último cálculo: {result.ms} ms</p>

      <div className="flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="rounded-lg bg-sky-500 px-3 py-1.5 text-white"
        >
          Cambiar tema (re-render)
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useMemoEnabled}
            onChange={(e) => setUseMemoEnabled(e.target.checked)}
            className="accent-sky-500"
          />
          Usar useMemo
        </label>
      </div>
      <p className="text-xs opacity-60">
        Con useMemo, cambiar el tema es instantáneo y los ms no cambian (usa el resultado guardado).
      </p>
    </div>
  );
}
