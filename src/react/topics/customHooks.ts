import type { Topic } from '../../types';
import { file } from '../source';
import NotesDemo from '../examples/hooks/NotesDemo';
import DebouncedSearch from '../examples/hooks/DebouncedSearch';
import Dropdown from '../examples/hooks/Dropdown';

export default {
  id: 'custom-hooks',
  icon: '🪝',
  title: 'Custom hooks',
  description:
    'Un custom hook es una función que empieza por "use" y combina otros hooks. Sirve para reutilizar LÓGICA (no interfaz) entre componentes y dejar los componentes limpios.',
  tip: 'Reglas de los hooks: llámalos siempre en el nivel superior (nunca dentro de if, bucles o funciones anidadas).',

  snippets: [
    {
      title: 'useMediaQuery y useOnline',
      code: `import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export function useOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return isOnline;
}

// Uso
export function Layout() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isOnline = useOnline();

  return (
    <>
      {!isOnline && <div className="banner">Sin conexión 📡</div>}
      {isMobile ? <MobileMenu /> : <DesktopMenu />}
    </>
  );
}`,
    },
    {
      title: 'useCopyToClipboard y useInterval',
      code: `import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetAfter);
    },
    [resetAfter]
  );

  return { copied, copy };
}

// setInterval "a prueba de React": siempre llama a la última versión del callback
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;            // null = pausado
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Uso
const { copied, copy } = useCopyToClipboard();
<button onClick={() => copy(apiKey)}>{copied ? '✓ Copiado' : 'Copiar'}</button>;

useInterval(() => setSeconds((s) => s + 1), isRunning ? 1000 : null);`,
    },
    {
      title: 'useFetch genérico',
      description: 'Para proyectos pequeños. En proyectos medianos o grandes, usa TanStack Query.',
      code: `import { useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ data: null, error: null, isLoading: true });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json() as Promise<T>;
      })
      .then((data) => setState({ data, error: null, isLoading: false }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, isLoading: false });
      });

    return () => controller.abort();
  }, [url, reloadKey]);

  return { ...state, reload: () => setReloadKey((key) => key + 1) };
}

// Uso: data está tipado como User[] | null
const { data: users, isLoading, error, reload } = useFetch<User[]>('/api/users');`,
    },
  ],

  examples: [
    {
      title: 'useLocalStorage + useToggle',
      level: 'estudiante',
      description: 'Hook genérico <T> y tupla "as const". La nota se guarda al recargar la página.',
      Component: NotesDemo,
      files: [file('hooks/NotesDemo.tsx'), file('hooks/useLocalStorage.ts'), file('hooks/useToggle.ts')],
    },
    {
      title: 'useDebounce en un buscador',
      level: 'industria',
      description: 'Compara las teclas pulsadas con las llamadas a la API.',
      Component: DebouncedSearch,
      files: [file('hooks/DebouncedSearch.tsx'), file('hooks/useDebounce.ts')],
    },
    {
      title: 'useOnClickOutside en un menú',
      level: 'industria',
      description: 'RefObject tipado, cerrar al hacer clic fuera o con Escape y atributos de accesibilidad.',
      Component: Dropdown,
      files: [file('hooks/Dropdown.tsx'), file('hooks/useOnClickOutside.ts')],
    },
  ],
} satisfies Topic;
