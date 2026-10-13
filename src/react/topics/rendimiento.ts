import type { Topic } from '../../types';
import { file } from '../source';
import ExpensiveCalc from '../examples/rendimiento/ExpensiveCalc';
import MemoCallback from '../examples/rendimiento/MemoCallback';

export default {
  id: 'rendimiento',
  icon: '🚀',
  title: 'Rendimiento (memo)',
  description:
    'useMemo guarda el RESULTADO de un cálculo, useCallback guarda una FUNCIÓN y memo evita re-renderizar un componente si sus props no cambian. Úsalos cuando midas un problema real.',
  tip: 'Con el React Compiler gran parte de esta memoización se hace automáticamente. Mide primero con React DevTools → Profiler.',

  snippets: [
    {
      title: 'Checklist de rendimiento',
      lang: 'text',
      code: `1. Mide antes de optimizar → React DevTools > Profiler ("Highlight updates")
2. Baja el estado: ponlo en el componente más profundo que lo necesite
3. Pasa componentes como children para que no se re-rendericen con el padre
4. Listas de miles de elementos → virtualización (TanStack Virtual)
5. Componentes pesados o rutas → lazy() + Suspense (code splitting)
6. Datos del servidor → TanStack Query (caché, sin peticiones duplicadas)
7. Activa el React Compiler (babel-plugin-react-compiler) → memoización automática
8. Imágenes: loading="lazy", tamaños correctos y formatos modernos (webp/avif)`,
    },
    {
      title: 'Lista grande con memo + useCallback + useMemo',
      code: `import { memo, useCallback, useMemo, useState } from 'react';

interface Contact {
  id: number;
  name: string;
  favorite: boolean;
}

// memo: la fila solo se vuelve a pintar si SU contacto o el handler cambian
const ContactRow = memo(function ContactRow({ contact, onToggle }: {
  contact: Contact;
  onToggle: (id: number) => void;
}) {
  return (
    <li>
      {contact.name}
      <button onClick={() => onToggle(contact.id)}>{contact.favorite ? '★' : '☆'}</button>
    </li>
  );
});

export function ContactList({ initial }: { initial: Contact[] }) {
  const [contacts, setContacts] = useState(initial);
  const [query, setQuery] = useState('');

  // useCallback: misma función entre renders → memo puede saltarse las filas
  const toggleFavorite = useCallback((id: number) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)));
  }, []);

  // useMemo: solo vuelve a filtrar/ordenar si cambian contacts o query
  const visible = useMemo(
    () =>
      contacts
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        .toSorted((a, b) => Number(b.favorite) - Number(a.favorite)),
    [contacts, query]
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {visible.map((contact) => (
          <ContactRow key={contact.id} contact={contact} onToggle={toggleFavorite} />
        ))}
      </ul>
    </>
  );
}`,
    },
    {
      title: 'useDeferredValue y useTransition: mantener la UI fluida',
      code: `import { useDeferredValue, useState, useTransition } from 'react';

// useDeferredValue: el input responde al instante; la lista pesada se actualiza "después"
export function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <HugeResultsList query={deferredQuery} />
      </div>
    </>
  );
}

// useTransition: marca una actualización como "no urgente"
export function TabsWithTransition() {
  const [tab, setTab] = useState<'inicio' | 'informes'>('inicio');
  const [isPending, startTransition] = useTransition();

  const selectTab = (next: typeof tab) => {
    startTransition(() => setTab(next));   // la UI no se congela mientras renderiza "informes"
  };

  return (
    <>
      <button onClick={() => selectTab('inicio')}>Inicio</button>
      <button onClick={() => selectTab('informes')}>Informes {isPending && '⏳'}</button>
      {tab === 'inicio' ? <Home /> : <SlowReports />}
    </>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'useMemo para cálculos pesados',
      level: 'estudiante',
      description: 'Activa y desactiva useMemo y cambia el tema para ver la diferencia.',
      Component: ExpensiveCalc,
      files: [file('rendimiento/ExpensiveCalc.tsx')],
    },
    {
      title: 'memo + useCallback',
      level: 'industria',
      description: 'Los hijos parpadean al re-renderizarse. Solo uno se libra.',
      Component: MemoCallback,
      files: [file('rendimiento/MemoCallback.tsx')],
    },
  ],
} satisfies Topic;
