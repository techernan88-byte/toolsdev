import type { Topic } from '../../types';

export default {
  id: 'typescript',
  icon: '🔷',
  title: 'TypeScript con React',
  description:
    'Guía rápida de los tipos que usarás a diario: props, children, eventos, hooks, refs, componentes genéricos y tipos utilitarios. TypeScript detecta errores antes de ejecutar y el editor autocompleta todo.',
  tip: 'Deja que TypeScript infiera siempre que pueda (useState(0) ya es number). Tipa explícitamente props, valores iniciales vacíos (null, []) y lo que viene de una API.',

  snippets: [
    {
      title: 'Props: interface, opcionales, children y unión de valores',
      code: `import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  subtitle?: string;                       // opcional → string | undefined
  variant: 'primary' | 'secondary';        // solo esos dos valores
  tags: string[];
  author: { name: string; avatarUrl: string };
  children: ReactNode;                     // cualquier cosa renderizable
  footer?: ReactNode;
  onClose?: () => void;                    // función sin argumentos ni retorno
  onSelect: (id: number) => void;          // función con argumento
}

export function Card({ title, subtitle, variant, children, onClose }: CardProps) {
  return (
    <section className={variant}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
      {onClose && <button onClick={onClose}>✕</button>}
    </section>
  );
}`,
    },
    {
      title: 'Eventos tipados',
      code: `import type { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent } from 'react';

export function Eventos() {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);           // string
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    console.log(data);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') console.log('Enter!');
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log(event.clientX, event.clientY);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="q" onChange={handleChange} onKeyDown={handleKeyDown} />
      <select onChange={handleSelect}><option>A</option></select>
      <button onClick={handleClick}>Enviar</button>
    </form>
  );
}

// 💡 Truco: si escribes el handler en línea, TS infiere el tipo solo:
<input onChange={(e) => console.log(e.target.value)} />`,
    },
    {
      title: 'Hooks tipados',
      code: `import { useReducer, useRef, useState } from 'react';

interface User {
  id: number;
  name: string;
}

export function HooksTipados() {
  // Inferido: number / string / boolean
  const [count, setCount] = useState(0);

  // Valor inicial "vacío" → tipa con el genérico
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Uniones de strings para estados finitos
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  // Ref a un elemento del DOM: empieza en null
  const inputRef = useRef<HTMLInputElement>(null);
  inputRef.current?.focus();

  // Ref para un valor mutable (id de un temporizador)
  const timerRef = useRef<number | undefined>(undefined);

  // useReducer infiere todo desde el reducer
  type Action = { type: 'inc' } | { type: 'add'; amount: number };
  const reducer = (state: number, action: Action) =>
    action.type === 'inc' ? state + 1 : state + action.amount;
  const [total, dispatch] = useReducer(reducer, 0);

  // user puede ser null: TS te obliga a comprobarlo
  return <p>{user ? user.name : 'Sin usuario'} · {count} · {users.length} · {status} · {total}</p>;
}`,
    },
    {
      title: 'Extender las props de un elemento HTML',
      description:
        'Tu componente acepta TODOS los atributos nativos (type, disabled, aria-*, onClick...) con su tipo correcto.',
      code: `import type { ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={!!error} {...props} />
      {error && <small role="alert">{error}</small>}
    </div>
  );
}

// Uso: placeholder, type, onChange... vienen de ComponentProps<'input'>
<Input id="email" label="Correo" type="email" placeholder="tu@correo.com" error="Obligatorio" />

// Omit: quitar props que no quieres que pasen desde fuera
type SafeInputProps = Omit<ComponentProps<'input'>, 'type' | 'style'>;`,
    },
    {
      title: 'Tipos utilitarios y uniones discriminadas',
      code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser   = Omit<User, 'password'>;            // sin password
type UserPreview  = Pick<User, 'id' | 'name'>;         // solo id y name
type UserUpdate   = Partial<Omit<User, 'id'>>;         // todo opcional menos id
type UsersById    = Record<number, PublicUser>;        // { [id]: usuario }
type Role         = 'admin' | 'editor' | 'viewer';

// Tipo a partir de un valor (no repites la información)
const THEMES = ['light', 'dark', 'system'] as const;
type Theme = (typeof THEMES)[number];                  // 'light' | 'dark' | 'system'

// Unión discriminada: cada estado tiene SOLO sus datos
type Request<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function render(request: Request<PublicUser[]>) {
  switch (request.status) {
    case 'loading': return 'Cargando…';
    case 'success': return request.data.length + ' usuarios';   // data existe aquí
    case 'error':   return 'Error: ' + request.error;           // error existe aquí
  }
}`,
    },
    {
      title: 'Componente genérico: una lista que sirve para cualquier tipo',
      code: `import type { ReactNode } from 'react';

interface ListProps<T> {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  emptyText?: string;
}

export function List<T>({ items, getKey, renderItem, emptyText = 'Sin elementos' }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyText}</p>;
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Uso: T se deduce como Product → product.price está autocompletado
interface Product { id: number; name: string; price: number }
const products: Product[] = [{ id: 1, name: 'Teclado', price: 89 }];

<List
  items={products}
  getKey={(product) => product.id}
  renderItem={(product) => <span>{product.name} — \${product.price}</span>}
/>`,
    },
  ],
} satisfies Topic;
