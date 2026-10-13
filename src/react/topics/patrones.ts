import type { Topic } from '../../types';
import { file } from '../source';
import TabsDemo from '../examples/patrones/Tabs';
import ModalDemo from '../examples/patrones/Modal';
import ErrorBoundaryDemo from '../examples/patrones/ErrorBoundary';
import LazyDemo from '../examples/patrones/LazyDemo';

export default {
  id: 'patrones',
  icon: '🏗️',
  title: 'Patrones de la industria',
  description:
    'Patrones que verás en proyectos profesionales y librerías populares: estructura por features, capa de API, rutas protegidas, compound components, portales, error boundaries y carga diferida.',
  tip: 'Organiza por funcionalidad: features/carrito/{components, hooks, api}. Escala mejor que agrupar por tipo de archivo.',

  snippets: [
    {
      title: 'Estructura de carpetas por features',
      lang: 'text',
      code: `src/
├── app/
│   ├── App.tsx              # rutas
│   ├── providers.tsx        # QueryClient, Auth, Theme...
│   └── main.tsx
├── components/ui/           # Button, Input, Modal... (sin lógica de negocio)
├── features/
│   ├── auth/
│   │   ├── api.ts           # llamadas HTTP de la feature
│   │   ├── hooks.ts         # useLogin, useCurrentUser (TanStack Query)
│   │   ├── components/      # LoginForm, ProtectedRoute
│   │   └── types.ts
│   └── orders/
│       ├── api.ts
│       ├── queries.ts       # query keys + queryOptions
│       ├── components/      # OrdersTable, OrderDetail
│       └── types.ts
├── hooks/                   # hooks genéricos (useDebounce, useMediaQuery)
├── lib/
│   ├── http.ts              # cliente fetch con baseURL, token y errores
│   └── utils.ts
└── types/                   # tipos compartidos`,
    },
    {
      title: 'Rutas protegidas con React Router',
      code: `import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { useAuth } from './features/auth/AuthContext';

function ProtectedRoute({ role }: { role?: 'admin' | 'user' }) {
  const { user } = useAuth();
  const location = useLocation();

  // No logueado → al login, recordando a dónde quería ir
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  // Sin permisos
  if (role && user.role !== role) return <Navigate to="/403" replace />;
  // OK → renderiza las rutas hijas
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    },
    {
      title: 'Cliente HTTP tipado (lib/http.ts)',
      description: 'Un único sitio para la URL base, el token, los headers y el manejo de errores.',
      files: [
        {
          name: 'lib/http.ts',
          lang: 'ts',
          code: `const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(\`\${BASE_URL}\${path}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: \`Bearer \${token}\` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new HttpError(response.status, body.message ?? response.statusText, body.details);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};`,
        },
        {
          name: 'features/orders/api.ts',
          lang: 'ts',
          code: `import { http } from '@/lib/http';
import type { CreateOrderInput, Order } from './types';

export const ordersApi = {
  list: () => http.get<Order[]>('/orders'),
  get: (id: string) => http.get<Order>(\`/orders/\${id}\`),
  create: (input: CreateOrderInput) => http.post<Order>('/orders', input),
  remove: (id: string) => http.delete(\`/orders/\${id}\`),
};`,
        },
      ],
    },
    {
      title: 'Ecosistema habitual en 2026',
      lang: 'text',
      code: `Frameworks       Next.js · React Router (modo framework) · TanStack Start · Astro
Datos servidor   TanStack Query · SWR
Estado global    Zustand · Redux Toolkit · Jotai
Formularios      React Hook Form + Zod · TanStack Form
Tablas / listas  TanStack Table · TanStack Virtual
Rutas            React Router · TanStack Router
Estilos          Tailwind CSS · CSS Modules
Componentes      shadcn/ui · Radix UI · React Aria
Tests            Vitest + Testing Library · Playwright (E2E) · MSW (mock de API)
Calidad          TypeScript estricto · ESLint · Prettier · React Compiler`,
    },
  ],

  examples: [
    {
      title: 'Compound components: Tabs',
      level: 'industria',
      description:
        'Componentes que comparten estado por contexto (como Radix UI) con hook que valida el contexto.',
      Component: TabsDemo,
      files: [file('patrones/Tabs.tsx')],
    },
    {
      title: 'Modal con createPortal',
      level: 'industria',
      description: 'Escape, clic fuera, bloqueo del scroll y atributos ARIA.',
      Component: ModalDemo,
      files: [file('patrones/Modal.tsx')],
    },
    {
      title: 'Error Boundary',
      level: 'industria',
      description: 'Componente de clase tipado con Component<Props, State>.',
      Component: ErrorBoundaryDemo,
      files: [file('patrones/ErrorBoundary.tsx')],
    },
    {
      title: 'lazy + Suspense',
      level: 'industria',
      description: 'Code splitting: cargar componentes solo cuando se necesitan.',
      Component: LazyDemo,
      files: [file('patrones/LazyDemo.tsx'), file('patrones/HeavyChart.tsx')],
    },
  ],
} satisfies Topic;
