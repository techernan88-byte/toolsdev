import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../shared/fakeApi';
import { QueryProvider } from './QueryProvider';

const ROLES = ['Todos', 'Frontend', 'Backend', 'Diseño'] as const;
type Role = (typeof ROLES)[number];

function Users() {
  const [role, setRole] = useState<Role>('Todos');

  // queryKey: identifica los datos en la caché. Si cambia "role", es otra consulta.
  // queryFn: la función que trae los datos (devuelve una promesa).
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['users', role],
    queryFn: async () => {
      const users = await searchUsers('');
      return role === 'Todos' ? users : users.filter((user) => user.role === role);
    },
  });

  return (
    <div className="max-w-md space-y-3">
      <div className="flex flex-wrap gap-1">
        {ROLES.map((item) => (
          <button
            key={item}
            onClick={() => setRole(item)}
            className={`rounded-full px-3 py-1 text-sm ${item === role ? 'bg-sky-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{isFetching ? '🔄 Pidiendo al servidor…' : '✅ Datos en caché'}</span>
        <button onClick={() => refetch()} className="text-sky-400 hover:underline">
          Recargar
        </button>
      </div>

      {/* isPending: aún no hay datos. isError: falló. Después, data está tipado como User[] */}
      {isPending ? (
        <p className="animate-pulse text-zinc-400">Cargando usuarios…</p>
      ) : isError ? (
        <p className="text-rose-400">{error.message}</p>
      ) : (
        <ul className="divide-y divide-white/5 rounded-lg bg-zinc-800/50">
          {data.map((user) => (
            <li key={user.id} className="flex justify-between px-3 py-2">
              <span className="text-zinc-200">{user.name}</span>
              <span className="text-sm text-zinc-500">{user.role}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-zinc-500">
        Cambia de rol y vuelve: la segunda vez es instantáneo (viene de la caché).
      </p>
    </div>
  );
}

export default function UsersQuery() {
  return (
    <QueryProvider>
      <Users />
    </QueryProvider>
  );
}
