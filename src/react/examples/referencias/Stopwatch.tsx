import { useEffect, useRef, useState } from 'react';

// useRef también guarda valores que NO deben provocar un re-render:
// aquí el id del intervalo y el momento de inicio.
// - Estado (useState): lo que se ve en pantalla.
// - Ref (useRef): datos internos "de trabajo".

const formatTime = (ms: number) => {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const hundredths = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${minutes}:${seconds}.${hundredths}`;
};

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const intervalRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(0);

  const start = () => {
    startTimeRef.current = Date.now() - elapsed; // continúa desde donde iba
    intervalRef.current = window.setInterval(() => setElapsed(Date.now() - startTimeRef.current), 10);
    setIsRunning(true);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    stop();
    setElapsed(0);
    setLaps([]);
  };

  // Limpieza por si el componente se desmonta con el cronómetro en marcha
  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="mx-auto max-w-xs space-y-4 text-center">
      <p className="font-mono text-5xl font-bold text-white tabular-nums">{formatTime(elapsed)}</p>
      <div className="flex justify-center gap-2">
        {isRunning ? (
          <button onClick={stop} className="rounded-lg bg-rose-600 px-4 py-2 text-white">
            Parar
          </button>
        ) : (
          <button onClick={start} className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
            Iniciar
          </button>
        )}
        <button
          onClick={() => setLaps((prev) => [elapsed, ...prev])}
          disabled={!isRunning}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-white disabled:opacity-40"
        >
          Vuelta
        </button>
        <button onClick={reset} className="rounded-lg px-4 py-2 text-zinc-400 hover:text-white">
          Reset
        </button>
      </div>
      <ol className="max-h-32 space-y-1 overflow-y-auto font-mono text-sm text-zinc-400">
        {laps.map((lap, index) => (
          <li key={laps.length - index}>
            Vuelta {laps.length - index}: {formatTime(lap)}
          </li>
        ))}
      </ol>
    </div>
  );
}
