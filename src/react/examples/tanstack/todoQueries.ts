import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi, type Todo } from '../shared/fakeApi';

// Organización habitual en proyectos reales: un archivo por recurso con
// 1. Query key factory: todas las claves en un solo sitio (sin strings sueltos).
// 2. queryOptions: la consulta tipada y reutilizable (useQuery, prefetch, loaders...).
// 3. Custom hooks para las mutaciones.

export const todoKeys = {
  all: ['todos'] as const,
  list: () => [...todoKeys.all, 'list'] as const,
};

export const todosQueryOptions = queryOptions({
  queryKey: todoKeys.list(),
  queryFn: todosApi.list,
});

/** Crear tarea → al terminar, invalidar la lista para que se vuelva a pedir. */
export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, fail }: { title: string; fail: boolean }) => todosApi.create(title, { fail }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

/** Marcar tarea con ACTUALIZACIÓN OPTIMISTA: la UI cambia antes de que responda el servidor. */
export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todosApi.toggle(id),

    // 1. Antes de la petición: actualizar la caché a mano y guardar una copia
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.list() });
      const previous = queryClient.getQueryData<Todo[]>(todoKeys.list());
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (old = []) =>
        old.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
      );
      return { previous }; // llega como tercer argumento a onError
    },

    // 2. Si falla: restaurar la copia
    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(todoKeys.list(), context.previous);
    },

    // 3. Siempre: sincronizar con el servidor
    onSettled: () => queryClient.invalidateQueries({ queryKey: todoKeys.list() }),
  });
}
