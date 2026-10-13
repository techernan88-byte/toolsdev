import type { Topic } from '../../types';
import { file } from '../source';
import VirtualList from '../examples/tanstack/VirtualList';

export default {
  id: 'tanstack-ecosistema',
  icon: '🧰',
  title: 'TanStack Router, Form y Virtual',
  description:
    'El resto del ecosistema TanStack: Router (rutas 100% tipadas con loaders y search params validados), Form (formularios tipados con validación) y Virtual (listas enormes sin perder rendimiento).',
  tip: 'TanStack Router + TanStack Query encajan muy bien: el loader de la ruta hace prefetch con queryOptions y el componente lee la caché con useSuspenseQuery.',

  snippets: [
    {
      title: 'TanStack Virtual: instalación y uso mínimo',
      code: `// npm install @tanstack/react-virtual
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function BigList({ rows }: { rows: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{ position: 'absolute', top: 0, width: '100%', height: item.size, transform: \`translateY(\${item.start}px)\` }}
          >
            {rows[item.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    },
    {
      title: 'TanStack Form: formulario tipado con validación',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: 'npm install @tanstack/react-form',
        },
        {
          name: 'ProfileForm.tsx',
          code: `import { useForm } from '@tanstack/react-form';

export function ProfileForm() {
  const form = useForm({
    defaultValues: { username: '', age: 18 },   // los tipos se infieren de aquí
    onSubmit: async ({ value }) => {
      await fetch('/api/profile', { method: 'POST', body: JSON.stringify(value) });
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) => (value.length < 3 ? 'Mínimo 3 caracteres' : undefined),
        }}
      >
        {(field) => (
          <label>
            Usuario
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && <em>{field.state.meta.errors.join(', ')}</em>}
          </label>
        )}
      </form.Field>

      <form.Field
        name="age"
        validators={{ onChange: ({ value }) => (value < 18 ? 'Debes ser mayor de edad' : undefined) }}
      >
        {(field) => (
          <input type="number" value={field.state.value} onChange={(e) => field.handleChange(Number(e.target.value))} />
        )}
      </form.Field>

      {/* Subscribe: re-renderiza SOLO este botón cuando cambian esos valores */}
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button disabled={!canSubmit}>{isSubmitting ? 'Guardando…' : 'Guardar'}</button>
        )}
      </form.Subscribe>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: 'TanStack Router: rutas por archivos con loader',
      description: 'El plugin de Vite genera el árbol de rutas a partir de la carpeta src/routes.',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm install @tanstack/react-router
npm install -D @tanstack/router-plugin @tanstack/react-router-devtools`,
        },
        {
          name: 'vite.config.ts',
          lang: 'ts',
          code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  // El plugin del router va ANTES que el de React
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
});`,
        },
        {
          name: 'main.tsx',
          code: `import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'; // generado automáticamente

const router = createRouter({ routeTree });

// Registra el router para que useNavigate, Link... estén tipados
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);`,
        },
        {
          name: 'routes/__root.tsx',
          code: `import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
        <Link to="/" activeProps={{ className: 'font-bold' }}>Inicio</Link>
        <Link to="/posts">Posts</Link>
      </nav>
      <Outlet />
    </>
  ),
  notFoundComponent: () => <p>404 · Página no encontrada</p>,
});`,
        },
        {
          name: 'routes/posts.$postId.tsx',
          code: `import { createFileRoute } from '@tanstack/react-router';

// Ruta /posts/:postId — el parámetro $postId está tipado
export const Route = createFileRoute('/posts/$postId')({
  // El loader se ejecuta ANTES de mostrar la ruta (sin "loading" en el componente)
  loader: async ({ params }) => {
    const response = await fetch(\`/api/posts/\${params.postId}\`);
    if (!response.ok) throw new Error('Post no encontrado');
    return (await response.json()) as { title: string; body: string };
  },
  pendingComponent: () => <p>Cargando post…</p>,
  errorComponent: ({ error }) => <p>Error: {error.message}</p>,
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();       // tipado: { title, body }
  const { postId } = Route.useParams();     // tipado: string
  return (
    <article>
      <small>Post #{postId}</small>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}`,
        },
      ],
    },
    {
      title: 'TanStack Router: search params validados (filtros en la URL)',
      code: `import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

// /products?page=2&sort=price&category=ofertas  → validado y tipado
const productSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  sort: z.enum(['name', 'price']).catch('name'),
  category: z.string().optional(),
});

export const Route = createFileRoute('/products')({
  validateSearch: productSearchSchema,
  component: ProductsPage,
});

function ProductsPage() {
  const { page, sort, category } = Route.useSearch();   // { page: number; sort: 'name' | 'price'; ... }
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <>
      <p>Página {page} · orden: {sort} · {category ?? 'todas'}</p>
      <button onClick={() => navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })}>
        Siguiente página
      </button>
    </>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'Lista virtualizada de 10.000 filas',
      level: 'industria',
      description: 'Haz scroll: solo existen en el DOM las filas visibles.',
      Component: VirtualList,
      files: [file('tanstack/VirtualList.tsx')],
    },
  ],
} satisfies Topic;
