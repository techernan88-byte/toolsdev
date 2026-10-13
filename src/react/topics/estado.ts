import type { Topic } from '../../types';
import { file } from '../source';
import Counter from '../examples/estado/Counter';
import PasswordToggle from '../examples/estado/PasswordToggle';
import TodoList from '../examples/estado/TodoList';

export default {
  id: 'use-state',
  icon: '🔁',
  title: 'useState',
  description:
    'El estado es la "memoria" de un componente. Cuando cambia con su función set, React vuelve a renderizar el componente con el nuevo valor.',
  tip: 'Nunca mutes el estado (array.push, obj.x = 1). Crea siempre un valor nuevo: [...array], { ...obj }.',

  snippets: [
    {
      title: 'Estado con objetos: formulario de perfil',
      code: `import { useState } from 'react';

interface Profile {
  name: string;
  bio: string;
  address: { city: string; country: string };
}

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({
    name: 'Ana',
    bio: '',
    address: { city: 'Madrid', country: 'España' },
  });

  // Cambiar una propiedad: copiar el resto con ...
  const updateName = (name: string) => setProfile((prev) => ({ ...prev, name }));

  // Objeto anidado: copiar en cada nivel
  const updateCity = (city: string) =>
    setProfile((prev) => ({ ...prev, address: { ...prev.address, city } }));

  return (
    <form>
      <input value={profile.name} onChange={(e) => updateName(e.target.value)} />
      <input value={profile.address.city} onChange={(e) => updateCity(e.target.value)} />
      <p>{profile.name} vive en {profile.address.city}</p>
    </form>
  );
}`,
    },
    {
      title: 'Estado con arrays: todas las operaciones',
      code: `import { useState } from 'react';

interface Item {
  id: string;
  name: string;
  qty: number;
}

export function useItems(initial: Item[] = []) {
  const [items, setItems] = useState<Item[]>(initial);

  // Añadir al final / al principio
  const add = (name: string) =>
    setItems((prev) => [...prev, { id: crypto.randomUUID(), name, qty: 1 }]);
  const addFirst = (item: Item) => setItems((prev) => [item, ...prev]);

  // Eliminar
  const remove = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  // Actualizar uno
  const increment = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));

  // Ordenar (toSorted devuelve un array NUEVO; sort() muta el original)
  const sortByName = () => setItems((prev) => prev.toSorted((a, b) => a.name.localeCompare(b.name)));

  // Insertar en una posición
  const insertAt = (index: number, item: Item) =>
    setItems((prev) => [...prev.slice(0, index), item, ...prev.slice(index)]);

  // Vaciar
  const clear = () => setItems([]);

  return { items, add, addFirst, remove, increment, sortByName, insertAt, clear };
}`,
    },
    {
      title: '❌ Estado redundante vs ✅ estado derivado',
      code: `import { useState } from 'react';

interface Product { id: number; name: string; price: number; inStock: boolean }

// ❌ Tres estados que hay que mantener sincronizados a mano
function BadCart({ products }: { products: Product[] }) {
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);         // se puede calcular
  const [count, setCount] = useState(0);         // se puede calcular
  // ...y si olvidas actualizar uno, la UI muestra datos incorrectos
}

// ✅ Un solo estado; el resto se CALCULA en cada render
function GoodCart() {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const count = items.length;
  const visible = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const hasOutOfStock = items.some((item) => !item.inStock);

  return <p>{count} productos · \${total} · {visible.length} visibles {hasOutOfStock && '⚠️'}</p>;
}`,
    },
    {
      title: 'Estados finitos en vez de varios booleanos',
      code: `import { useState } from 'react';

// ❌ Combinaciones imposibles: ¿isLoading y isError a la vez?
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);

// ✅ Un único estado con los valores posibles
type Status = 'idle' | 'loading' | 'success' | 'error';

export function UploadButton() {
  const [status, setStatus] = useState<Status>('idle');

  const upload = async () => {
    setStatus('loading');
    try {
      await fetch('/api/upload', { method: 'POST' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <button onClick={upload} disabled={status === 'loading'}>
      {{ idle: 'Subir', loading: 'Subiendo…', success: '✅ Subido', error: '❌ Reintentar' }[status]}
    </button>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'Contador',
      level: 'estudiante',
      description: 'Actualizaciones funcionales y por qué +3 funciona.',
      Component: Counter,
      files: [file('estado/Counter.tsx')],
    },
    {
      title: 'Mostrar / ocultar contraseña',
      level: 'estudiante',
      description: 'Estado booleano con toggle.',
      Component: PasswordToggle,
      files: [file('estado/PasswordToggle.tsx')],
    },
    {
      title: 'Lista de tareas',
      level: 'industria',
      description: 'useState<Todo[]>, actualizaciones inmutables, IDs estables y estado derivado.',
      Component: TodoList,
      files: [file('estado/TodoList.tsx')],
    },
  ],
} satisfies Topic;
