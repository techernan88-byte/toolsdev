import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// El QueryClient guarda la caché de todas las peticiones.
// En tu app se crea UNA vez y envuelve a toda la aplicación (main.tsx).
// Aquí cada demo tiene el suyo para que sean independientes.
export function QueryProvider({ children }: { children: ReactNode }) {
  // useState(() => ...) garantiza que el cliente se crea una sola vez
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // durante 30 s los datos se consideran "frescos": no se vuelven a pedir
            retry: 1, // reintenta una vez si falla
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
