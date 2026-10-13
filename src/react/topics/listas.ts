import type { Topic } from '../../types';
import { file } from '../source';
import FruitList from '../examples/listas/FruitList';
import ProductTable from '../examples/listas/ProductTable';

export default {
  id: 'listas',
  icon: '📋',
  title: 'Listas y condicionales',
  description:
    'Para mostrar listas se usa array.map() y cada elemento necesita una key única y estable. Para mostrar algo solo a veces: &&, el operador ternario o un return anticipado.',
  tip: 'No uses el índice como key si la lista puede reordenarse, filtrarse o borrar elementos: provoca errores visuales.',

  snippets: [
    {
      title: 'Condicionales: todas las formas',
      code: `export function Conditionals({ user, items, role }: {
  user: { name: string } | null;
  items: string[];
  role: 'admin' | 'editor' | 'viewer';
}) {
  // 1. Return anticipado
  if (!user) return <LoginButton />;

  // 2. Objeto como "switch" para elegir un componente
  const PANELS = { admin: <AdminPanel />, editor: <EditorPanel />, viewer: null };

  return (
    <>
      {/* 3. && — solo si es verdadero */}
      {items.length > 0 && <Badge count={items.length} />}

      {/* 4. Ternario — uno u otro */}
      {role === 'admin' ? <p>Tienes todos los permisos</p> : <p>Acceso limitado</p>}

      {/* 5. Lookup en objeto */}
      {PANELS[role]}

      {/* ❌ Cuidado: {items.length && ...} pinta un "0" si está vacío */}
    </>
  );
}`,
    },
    {
      title: 'Keys: lo que hay que saber',
      code: `// ✅ ID que viene de la base de datos
{users.map((user) => <UserRow key={user.id} user={user} />)}

// ✅ ID generado al CREAR el elemento (no al renderizar)
const newTodo = { id: crypto.randomUUID(), text };

// ⚠️ Índice: solo si la lista es estática (nunca se reordena, filtra ni borra)
{['Lun', 'Mar', 'Mié'].map((day, index) => <span key={index}>{day}</span>)}

// ❌ Nunca generar la key al renderizar: cambia en cada render y React
//    destruye y vuelve a crear todos los elementos (pierden foco y estado)
{items.map((item) => <Row key={Math.random()} item={item} />)}

// 💡 Truco: cambiar la key de un componente lo "reinicia" (estado limpio)
<ChatRoom key={roomId} roomId={roomId} />`,
    },
    {
      title: 'Lista con estados de carga, error y vacío',
      description:
        'El patrón de "returns anticipados": cada caso especial sale antes y el caso normal queda limpio al final.',
      code: `interface Order {
  id: string;
  customer: string;
  total: number;
}

interface OrderListProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function OrderList({ orders, isLoading, error, onRetry }: OrderListProps) {
  if (isLoading) return <p>Cargando pedidos…</p>;

  if (error) {
    return (
      <div role="alert">
        <p>No se pudieron cargar los pedidos: {error.message}</p>
        <button onClick={onRetry}>Reintentar</button>
      </div>
    );
  }

  if (!orders || orders.length === 0) return <p>Todavía no hay pedidos 📭</p>;

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.customer} — \${order.total.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}`,
    },
    {
      title: 'Agrupar una lista por categoría',
      code: `interface Task {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

const COLUMNS: { status: Task['status']; label: string }[] = [
  { status: 'todo', label: '📋 Por hacer' },
  { status: 'doing', label: '⚙️ En curso' },
  { status: 'done', label: '✅ Hecho' },
];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  // Object.groupBy: { todo: Task[], doing: Task[], done: Task[] }
  const byStatus = Object.groupBy(tasks, (task) => task.status);

  return (
    <div className="grid grid-cols-3 gap-4">
      {COLUMNS.map((column) => (
        <section key={column.status}>
          <h3>
            {column.label} ({byStatus[column.status]?.length ?? 0})
          </h3>
          {byStatus[column.status]?.map((task) => (
            <article key={task.id}>{task.title}</article>
          ))}
        </section>
      ))}
    </div>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'Lista filtrable',
      level: 'estudiante',
      description: 'map, filter, key y &&.',
      Component: FruitList,
      files: [file('listas/FruitList.tsx')],
    },
    {
      title: 'Tabla con búsqueda, filtro y orden',
      level: 'industria',
      description: 'keyof para las columnas ordenables, lista derivada del estado y estado vacío.',
      Component: ProductTable,
      files: [file('listas/ProductTable.tsx')],
    },
  ],
} satisfies Topic;
