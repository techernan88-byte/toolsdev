import type { Topic } from '../../types';
import { file } from '../source';
import Clock from '../examples/efectos/Clock';
import WindowSize from '../examples/efectos/WindowSize';
import UserSearch from '../examples/efectos/UserSearch';

export default {
  id: 'use-effect',
  icon: '⚡',
  title: 'useEffect',
  description:
    'useEffect sincroniza tu componente con algo EXTERNO a React: temporizadores, eventos del navegador, peticiones a una API, librerías de terceros… Se ejecuta después de pintar.',
  tip: 'Si puedes calcular algo durante el render, no necesitas un efecto. useEffect es para hablar con el mundo exterior.',

  snippets: [
    {
      title: 'Anatomía de un efecto',
      code: `import { useEffect, useState } from 'react';

export function OnlineStatus({ userId }: { userId: string }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // 1. CONFIGURAR: se ejecuta después de pintar
    const connection = createConnection(userId);
    connection.on('status', setIsOnline);
    connection.connect();

    // 2. LIMPIAR: antes del siguiente efecto y al desmontar
    return () => connection.disconnect();
  }, [userId]); // 3. DEPENDENCIAS: se repite cuando cambia userId

  return <span>{isOnline ? '🟢 En línea' : '⚪ Desconectado'}</span>;
}

// useEffect(fn)          → después de CADA render
// useEffect(fn, [])      → solo al montar (y limpia al desmontar)
// useEffect(fn, [a, b])  → al montar y cuando cambian a o b`,
    },
    {
      title: 'Eventos globales: teclado, scroll y título de la página',
      code: `import { useEffect, useState } from 'react';

export function ShortcutsAndScroll({ unread }: { unread: number }) {
  const [scrolled, setScrolled] = useState(false);

  // Atajo de teclado global
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('#search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Scroll (passive mejora el rendimiento)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sincronizar el título de la pestaña
  useEffect(() => {
    document.title = unread > 0 ? \`(\${unread}) Bandeja\` : 'Bandeja';
  }, [unread]);

  return <header className={scrolled ? 'shadow-lg' : ''}>…</header>;
}`,
    },
    {
      title: '❌ Efectos que NO necesitas',
      code: `// ❌ 1. Calcular datos derivados
const [fullName, setFullName] = useState('');
useEffect(() => setFullName(first + ' ' + last), [first, last]);
// ✅
const fullName = first + ' ' + last;

// ❌ 2. Reaccionar a un evento del usuario
useEffect(() => {
  if (submitted) sendAnalytics('form_sent');
}, [submitted]);
// ✅ hazlo directamente en el handler
const handleSubmit = () => { sendForm(); sendAnalytics('form_sent'); };

// ❌ 3. Reiniciar el estado cuando cambia una prop
useEffect(() => setComment(''), [userId]);
// ✅ cambia la key desde el padre: <Profile key={userId} userId={userId} />

// ❌ 4. Pedir datos con useEffect en una app grande
// ✅ usa TanStack Query (caché, reintentos, deduplicación…) → ver sección TanStack`,
    },
    {
      title: 'Fetch tipado con loading, error y cancelación',
      code: `import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

type State =
  | { status: 'loading' }
  | { status: 'success'; post: Post }
  | { status: 'error'; message: string };

export function PostDetail({ postId }: { postId: number }) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    async function load() {
      try {
        const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${postId}\`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const post: Post = await response.json();
        setState({ status: 'success', post });
      } catch (error) {
        if (controller.signal.aborted) return;           // cancelada: ignorar
        setState({ status: 'error', message: (error as Error).message });
      }
    }

    load();
    return () => controller.abort(); // si postId cambia, cancela la petición anterior
  }, [postId]);

  if (state.status === 'loading') return <p>Cargando…</p>;
  if (state.status === 'error') return <p>Error: {state.message}</p>;
  return (
    <article>
      <h2>{state.post.title}</h2>
      <p>{state.post.body}</p>
    </article>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'Reloj',
      level: 'estudiante',
      description: 'setInterval con su limpieza.',
      Component: Clock,
      files: [file('efectos/Clock.tsx')],
    },
    {
      title: 'Tamaño de ventana',
      level: 'estudiante',
      description: 'Suscribirse a eventos del navegador.',
      Component: WindowSize,
      files: [file('efectos/WindowSize.tsx')],
    },
    {
      title: 'Búsqueda con fetch',
      level: 'industria',
      description: 'Unión discriminada para el estado, AbortController contra race conditions y reintento.',
      Component: UserSearch,
      files: [file('efectos/UserSearch.tsx'), file('shared/fakeApi.ts')],
    },
  ],
} satisfies Topic;
