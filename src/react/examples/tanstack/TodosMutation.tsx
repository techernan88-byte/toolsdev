import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryProvider } from './QueryProvider';
import { todosQueryOptions, useCreateTodo, useToggleTodo } from './todoQueries';

function Todos() {
  const [title, setTitle] = useState('');
  const [shouldFail, setShouldFail] = useState(false);

  const { data: todos = [], isPending, isFetching } = useQuery(todosQueryOptions);
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    createTodo.mutate({ title: title.trim(), fail: shouldFail }, { onSuccess: () => setTitle('') });
  };

  return (
    <div className="max-w-md space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Nueva tarea…"
          className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          disabled={createTodo.isPending}
          className="rounded-lg bg-sky-500 px-4 font-semibold text-white disabled:opacity-50"
        >
          {createTodo.isPending ? 'Guardando…' : 'Añadir'}
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(e) => setShouldFail(e.target.checked)}
          className="accent-rose-500"
        />
        Simular fallo al crear
      </label>
      {createTodo.isError && <p className="text-sm text-rose-400">⚠️ {createTodo.error.message}</p>}

      {isPending ? (
        <p className="animate-pulse text-zinc-400">Cargando…</p>
      ) : (
        <ul className="divide-y divide-white/5 rounded-lg bg-zinc-800/50">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 px-3 py-2">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo.mutate(todo.id)}
                className="size-4 accent-sky-500"
              />
              <span className={todo.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}>{todo.title}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-zinc-500">
        {isFetching ? '🔄 Sincronizando con el servidor…' : '✅ Sincronizado'} · Marca una tarea: cambia al
        instante (optimista).
      </p>
    </div>
  );
}

export default function TodosMutation() {
  return (
    <QueryProvider>
      <Todos />
    </QueryProvider>
  );
}
