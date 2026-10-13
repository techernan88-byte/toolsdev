import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../shared/fakeApi';
import { QueryProvider } from './QueryProvider';

function Feed() {
  // useInfiniteQuery: para "Cargar más" o scroll infinito (paginación por cursor)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    // Devuelve el cursor de la siguiente página, o null si no hay más
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isPending) return <p className="animate-pulse text-zinc-400">Cargando…</p>;

  // data.pages es un array con cada página cargada
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="max-w-md space-y-3">
      <ul className="max-h-64 space-y-2 overflow-y-auto">
        {posts.map((post) => (
          <li key={post.id} className="rounded-lg bg-zinc-800 px-3 py-2 text-zinc-200">
            {post.title}
          </li>
        ))}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className="w-full rounded-lg bg-sky-500 py-2 font-semibold text-white disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {isFetchingNextPage ? 'Cargando…' : hasNextPage ? 'Cargar más' : 'No hay más publicaciones'}
      </button>
      <p className="text-xs text-zinc-500">
        {posts.length} publicaciones · {data?.pages.length} páginas en caché
      </p>
    </div>
  );
}

export default function InfiniteFeed() {
  return (
    <QueryProvider>
      <Feed />
    </QueryProvider>
  );
}
