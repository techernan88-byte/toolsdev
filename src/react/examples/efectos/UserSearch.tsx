import { useEffect, useState } from 'react';
import { searchUsers, type User } from '../shared/fakeApi';

// Fetch de datos "de verdad":
// - Estado como UNIÓN DISCRIMINADA: TypeScript sabe que "users" solo existe
//   cuando status es 'success' y "error" solo cuando es 'error'.
// - AbortController: cancela la petición anterior si el usuario sigue escribiendo
//   (evita race conditions: que una respuesta vieja pise a una nueva).
// - Botón de reintentar: cambiar retryCount vuelve a ejecutar el efecto.

type RequestState =
  { status: 'loading' } | { status: 'success'; users: User[] } | { status: 'error'; error: Error };

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [simulateErrors, setSimulateErrors] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [request, setRequest] = useState<RequestState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setRequest({ status: 'loading' });

    searchUsers(query, { signal: controller.signal, failRate: simulateErrors ? 0.5 : 0 })
      .then((users) => setRequest({ status: 'success', users }))
      .catch((error: Error) => {
        if (error.name === 'AbortError') return; // cancelada a propósito: ignorar
        setRequest({ status: 'error', error });
      });

    return () => controller.abort();
  }, [query, simulateErrors, retryCount]);

  return (
    <div className="max-w-md space-y-3">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar usuario…"
        className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
      />
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={simulateErrors}
          onChange={(e) => setSimulateErrors(e.target.checked)}
          className="accent-rose-500"
        />
        Simular errores del servidor (50%)
      </label>

      {request.status === 'loading' && <p className="animate-pulse text-zinc-400">Cargando…</p>}

      {request.status === 'error' && (
        <div className="flex items-center justify-between rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
          {request.error.message}
          <button onClick={() => setRetryCount((n) => n + 1)} className="font-semibold hover:underline">
            Reintentar
          </button>
        </div>
      )}

      {request.status === 'success' && (
        <ul className="divide-y divide-white/5 rounded-lg bg-zinc-800/50">
          {request.users.map((user) => (
            <li key={user.id} className="flex justify-between px-3 py-2">
              <span className="text-zinc-200">{user.name}</span>
              <span className="text-sm text-zinc-500">{user.role}</span>
            </li>
          ))}
          {request.users.length === 0 && (
            <li className="px-3 py-4 text-center text-zinc-500">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
