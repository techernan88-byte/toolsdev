import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects } from '../shared/fakeApi';
import { QueryProvider } from './QueryProvider';

function Projects() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
    // Mientras carga la página nueva, sigue mostrando la anterior (sin parpadeo)
    placeholderData: keepPreviousData,
  });

  // Prefetch: pide la página siguiente en segundo plano → al pulsar "Siguiente" es instantáneo
  useEffect(() => {
    if (data && page < data.totalPages) {
      queryClient.prefetchQuery({ queryKey: ['projects', page + 1], queryFn: () => fetchProjects(page + 1) });
    }
  }, [data, page, queryClient]);

  // Con placeholderData, "data" solo es undefined en la primera carga
  if (!data) return <p className="animate-pulse text-zinc-400">Cargando proyectos…</p>;

  return (
    <div className="max-w-md space-y-3">
      <ul
        className={`divide-y divide-white/5 rounded-lg bg-zinc-800/50 transition ${isPlaceholderData ? 'opacity-50' : ''}`}
      >
        {data.items.map((project) => (
          <li key={project.id} className="flex justify-between px-3 py-2 font-mono text-sm">
            <span className="text-zinc-200">{project.name}</span>
            <span className="text-amber-400">★ {project.stars}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-white disabled:opacity-40"
        >
          ← Anterior
        </button>
        <span className="text-zinc-400">
          Página {page} de {data.totalPages} {isFetching && '🔄'}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isPlaceholderData || page === data.totalPages}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-white disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default function PaginatedProjects() {
  return (
    <QueryProvider>
      <Projects />
    </QueryProvider>
  );
}
