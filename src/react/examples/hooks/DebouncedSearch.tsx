import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

export default function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [keystrokes, setKeystrokes] = useState(0);
  const [requests, setRequests] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 600);

  // Este efecto simula la llamada a la API: solo corre con el valor "debounced"
  useEffect(() => {
    if (!debouncedQuery) return;
    setRequests((prev) => [debouncedQuery, ...prev].slice(0, 5));
  }, [debouncedQuery]);

  return (
    <div className="max-w-md space-y-3">
      <input
        value={query}
        onChange={(event) => {
          setKeystrokes((n) => n + 1);
          setQuery(event.target.value);
        }}
        placeholder="Escribe rápido…"
        className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
      />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-zinc-500">Teclas pulsadas</p>
          <p className="text-2xl font-bold text-white">{keystrokes}</p>
        </div>
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-zinc-500">Llamadas a la API</p>
          <p className="text-2xl font-bold text-emerald-400">{requests.length}</p>
        </div>
      </div>
      <ul className="space-y-1 font-mono text-xs text-zinc-400">
        {requests.map((request, index) => (
          <li key={index}>GET /api/search?q={request}</li>
        ))}
      </ul>
    </div>
  );
}
