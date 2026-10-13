import type { Topic } from '../../types';
import { file } from '../source';
import PropDrilling from '../examples/contexto/PropDrilling';
import ToastDemo from '../examples/contexto/ToastDemo';

export default {
  id: 'context',
  icon: '🌐',
  title: 'Context',
  description:
    'Context comparte datos con todo un árbol de componentes sin pasarlos prop por prop. Ideal para datos "globales": usuario, tema, idioma, notificaciones.',
  tip: 'No todo va en Context. Si cambia muy seguido (ej. lo que escribes en un input), re-renderiza a todos los consumidores.',

  snippets: [
    {
      title: 'Tema claro / oscuro persistente',
      code: `import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme | null) ?? 'dark'
  );

  // Sincroniza con el <html> (Tailwind: dark:...) y con localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return context;
}

// Uso
export function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>;
}`,
    },
    {
      title: 'Autenticación: AuthProvider + useAuth',
      description:
        'El patrón más usado en apps reales. Tres archivos: el contexto, su uso en main.tsx y un componente consumidor.',
      files: [
        {
          name: 'AuthContext.tsx',
          code: `import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    setUser(await response.json());
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}`,
        },
        {
          name: 'main.tsx',
          code: `import { createRoot } from 'react-dom/client';
import { AuthProvider } from './AuthContext';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);`,
        },
        {
          name: 'Navbar.tsx',
          code: `import { useAuth } from './AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hola, {user?.name}</span>
          {user?.role === 'admin' && <a href="/admin">Panel</a>}
          <button onClick={logout}>Salir</button>
        </>
      ) : (
        <a href="/login">Entrar</a>
      )}
    </nav>
  );
}`,
        },
      ],
    },
    {
      title: '¿Context, Zustand o TanStack Query?',
      code: `// Context        → datos que cambian POCO: usuario, tema, idioma, permisos
// TanStack Query → datos del SERVIDOR (listas, detalles…): caché y sincronización
// Zustand        → estado global del CLIENTE que cambia a menudo (carrito, filtros, UI)
// Redux Toolkit  → apps muy grandes con mucha lógica compartida y devtools

// Ejemplo de Zustand: sin Provider, y cada componente solo se re-renderiza
// si cambia la parte del estado que lee
import { create } from 'zustand';

interface CartStore {
  items: string[];
  add: (item: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  add: (item) => set((state) => ({ items: [...state.items, item] })),
  clear: () => set({ items: [] }),
}));

// En cualquier componente:
const count = useCartStore((state) => state.items.length);
const add = useCartStore((state) => state.add);`,
    },
  ],

  examples: [
    {
      title: 'Adiós al prop drilling',
      level: 'estudiante',
      description: 'createContext<User> y un dato que llega 3 niveles abajo sin props.',
      Component: PropDrilling,
      files: [file('contexto/PropDrilling.tsx')],
    },
    {
      title: 'Sistema de notificaciones (toasts)',
      level: 'industria',
      description:
        'Contexto que empieza en null + hook useToast que garantiza el tipo y avisa si falta el Provider.',
      Component: ToastDemo,
      files: [file('contexto/ToastDemo.tsx'), file('contexto/ToastContext.tsx')],
    },
  ],
} satisfies Topic;
