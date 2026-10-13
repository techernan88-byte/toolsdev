import type { Topic } from '../../types';
import { file } from '../source';
import UsersQuery from '../examples/tanstack/UsersQuery';
import TodosMutation from '../examples/tanstack/TodosMutation';
import PaginatedProjects from '../examples/tanstack/PaginatedProjects';
import InfiniteFeed from '../examples/tanstack/InfiniteFeed';

export default {
  id: 'tanstack-query',
  icon: '🌴',
  title: 'TanStack Query',
  description:
    'La librería estándar para datos del SERVIDOR. Gestiona caché, estados de carga y error, reintentos, peticiones duplicadas, refresco en segundo plano, paginación y mutaciones. Sustituye a casi todos los useEffect + fetch.',
  tip: 'Piensa en queryKey como la "dirección" de los datos en la caché: ["users"], ["users", id], ["users", { page, search }]. Si la key cambia, es otra consulta.',

  snippets: [
    {
      title: 'Instalación y configuración',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools @tanstack/eslint-plugin-query`,
        },
        {
          name: 'main.tsx',
          code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // 1 min "fresco": no se vuelve a pedir al montar
      gcTime: 5 * 60_000,         // 5 min en caché tras dejar de usarse
      retry: 2,                   // reintentos si falla
      refetchOnWindowFocus: true, // refresca al volver a la pestaña
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);`,
        },
      ],
    },
    {
      title: 'Mutaciones: crear, editar y borrar',
      code: `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from './queries';
import type { Post } from './api';

type NewPost = Omit<Post, 'id'>;

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: NewPost): Promise<Post> => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) throw new Error('No se pudo crear');
      return response.json();
    },
    onSuccess: (createdPost) => {
      // Guarda el detalle en caché y marca las listas como desactualizadas
      queryClient.setQueryData(postKeys.detail(createdPost.id), createdPost);
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// En el componente
export function NewPostForm() {
  const createPost = useCreatePost();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        createPost.mutate(
          { title: String(data.get('title')), body: String(data.get('body')), userId: 1 },
          { onSuccess: () => event.currentTarget.reset() }
        );
      }}
    >
      <input name="title" />
      <textarea name="body" />
      <button disabled={createPost.isPending}>{createPost.isPending ? 'Publicando…' : 'Publicar'}</button>
      {createPost.isError && <p>{createPost.error.message}</p>}
    </form>
  );
}`,
    },
    {
      title: 'Consultas dependientes, paralelas y con Suspense',
      code: `import { useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

// Dependiente: la segunda espera a que exista user
function UserProjects({ email }: { email: string }) {
  const { data: user } = useQuery({ queryKey: ['user', email], queryFn: () => getUserByEmail(email) });

  const { data: projects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => getProjects(user!.id),
    enabled: !!user?.id,          // no se ejecuta hasta tener el id
  });

  return <p>{projects?.length ?? 0} proyectos</p>;
}

// Paralelas con una lista dinámica
function UsersByIds({ ids }: { ids: number[] }) {
  const results = useQueries({
    queries: ids.map((id) => ({ queryKey: ['user', id], queryFn: () => getUser(id) })),
  });
  const isLoading = results.some((result) => result.isPending);
  return isLoading ? <p>Cargando…</p> : <p>{results.map((r) => r.data?.name).join(', ')}</p>;
}

// Con Suspense: data NUNCA es undefined (el loading lo pinta el <Suspense> padre)
function Profile({ id }: { id: number }) {
  const { data: user } = useSuspenseQuery({ queryKey: ['user', id], queryFn: () => getUser(id) });
  return <h1>{user.name}</h1>;
}`,
    },
    {
      title: 'Organización profesional: api + queries + componente',
      description:
        'Query key factory + queryOptions = claves y tipos en un solo sitio, reutilizables en useQuery, prefetch y loaders.',
      files: [
        {
          name: 'features/posts/api.ts',
          lang: 'ts',
          code: `export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostFilters {
  userId?: number;
  search?: string;
}

const API = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts(filters: PostFilters): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters.userId) params.set('userId', String(filters.userId));
  const response = await fetch(\`\${API}/posts?\${params}\`);
  if (!response.ok) throw new Error('No se pudieron cargar los posts');
  const posts: Post[] = await response.json();
  return filters.search ? posts.filter((p) => p.title.includes(filters.search!)) : posts;
}

export async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(\`\${API}/posts/\${id}\`);
  if (!response.ok) throw new Error('Post no encontrado');
  return response.json();
}`,
        },
        {
          name: 'features/posts/queries.ts',
          lang: 'ts',
          code: `import { queryOptions } from '@tanstack/react-query';
import { fetchPost, fetchPosts, type PostFilters } from './api';

// Todas las claves de "posts" en un solo objeto
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

export const postsQuery = (filters: PostFilters) =>
  queryOptions({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
  });

export const postQuery = (id: number) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPost(id),
    staleTime: 5 * 60_000,
  });`,
        },
        {
          name: 'features/posts/PostList.tsx',
          code: `import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { postQuery, postsQuery } from './queries';

export function PostList() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { data: posts, isPending, isError, error, isFetching } = useQuery(postsQuery({ search }));

  if (isPending) return <p>Cargando…</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {isFetching && <span>Actualizando…</span>}
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            // Prefetch al pasar el ratón: el detalle se abre al instante
            onMouseEnter={() => queryClient.prefetchQuery(postQuery(post.id))}
          >
            <a href={\`/posts/\${post.id}\`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}`,
        },
      ],
    },
  ],

  examples: [
    {
      title: 'useQuery: caché por clave',
      level: 'estudiante',
      description: 'isPending / isError / isFetching, refetch y caché instantánea al volver a un filtro.',
      Component: UsersQuery,
      files: [file('tanstack/UsersQuery.tsx'), file('tanstack/QueryProvider.tsx')],
    },
    {
      title: 'Mutaciones con actualización optimista',
      level: 'industria',
      description: 'Query key factory, queryOptions, invalidateQueries y onMutate/onError/onSettled.',
      Component: TodosMutation,
      files: [file('tanstack/TodosMutation.tsx'), file('tanstack/todoQueries.ts'), file('shared/fakeApi.ts')],
    },
    {
      title: 'Paginación con prefetch',
      level: 'industria',
      description: 'placeholderData: keepPreviousData para no parpadear y prefetch de la página siguiente.',
      Component: PaginatedProjects,
      files: [file('tanstack/PaginatedProjects.tsx')],
    },
    {
      title: 'useInfiniteQuery: "Cargar más"',
      level: 'industria',
      description: 'Paginación por cursor con getNextPageParam, hasNextPage y fetchNextPage.',
      Component: InfiniteFeed,
      files: [file('tanstack/InfiniteFeed.tsx')],
    },
  ],
} satisfies Topic;
