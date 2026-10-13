// API falsa para los ejemplos: simula latencia, errores y cancelación.
// En un proyecto real estas funciones harían fetch() a tu backend.

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface Todo {
  id: string;
  title: string;
  done: boolean;
}

export interface Project {
  id: number;
  name: string;
  stars: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
}

export interface Post {
  id: number;
  title: string;
}

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomLatency = () => 300 + Math.random() * 700;

/* ───────── Usuarios ───────── */

const USERS: User[] = [
  { id: 1, name: 'Ana García', role: 'Frontend' },
  { id: 2, name: 'Luis Pérez', role: 'Backend' },
  { id: 3, name: 'Marta Ruiz', role: 'Diseño' },
  { id: 4, name: 'Carlos Díaz', role: 'DevOps' },
  { id: 5, name: 'Lucía Torres', role: 'Frontend' },
  { id: 6, name: 'Andrés Gil', role: 'QA' },
  { id: 7, name: 'Elena Mora', role: 'Producto' },
  { id: 8, name: 'Javier Ramos', role: 'Backend' },
];

interface SearchOptions {
  signal?: AbortSignal;
  failRate?: number;
}

export function searchUsers(query: string, { signal, failRate = 0 }: SearchOptions = {}): Promise<User[]> {
  return new Promise((resolve, reject) => {
    // Latencia aleatoria: las respuestas pueden llegar desordenadas (race condition)
    const timer = setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('Error 500: el servidor no respondió'));
      } else {
        resolve(USERS.filter((user) => user.name.toLowerCase().includes(query.toLowerCase())));
      }
    }, randomLatency());

    // Si la petición se cancela, no resolvemos nada
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Petición cancelada', 'AbortError'));
    });
  });
}

/* ───────── Tareas (CRUD en memoria) ───────── */

let todos: Todo[] = [
  { id: 't1', title: 'Instalar TanStack Query', done: true },
  { id: 't2', title: 'Crear el QueryClient', done: true },
  { id: 't3', title: 'Usar useMutation', done: false },
];

export const todosApi = {
  async list(): Promise<Todo[]> {
    await delay(randomLatency());
    return structuredClone(todos);
  },
  async create(title: string, { fail = false } = {}): Promise<Todo> {
    await delay(800);
    if (fail) throw new Error('No se pudo guardar la tarea');
    const todo: Todo = { id: crypto.randomUUID(), title, done: false };
    todos = [...todos, todo];
    return todo;
  },
  async toggle(id: string): Promise<Todo> {
    await delay(500);
    todos = todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
    return todos.find((todo) => todo.id === id)!;
  },
};

/* ───────── Proyectos paginados ───────── */

const PROJECTS: Project[] = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  name: `proyecto-${String(index + 1).padStart(2, '0')}`,
  stars: Math.round(5000 / (index + 1)),
}));

export async function fetchProjects(page: number, pageSize = 5): Promise<Page<Project>> {
  await delay(randomLatency());
  const start = (page - 1) * pageSize;
  return {
    items: PROJECTS.slice(start, start + pageSize),
    page,
    totalPages: Math.ceil(PROJECTS.length / pageSize),
  };
}

/* ───────── Feed infinito (paginación por cursor) ───────── */

export async function fetchPosts(cursor: number): Promise<{ posts: Post[]; nextCursor: number | null }> {
  await delay(randomLatency());
  const posts = Array.from({ length: 5 }, (_, index) => ({
    id: cursor + index,
    title: `Publicación #${cursor + index + 1}`,
  }));
  const nextCursor = cursor + 5 < 25 ? cursor + 5 : null; // 25 publicaciones en total
  return { posts, nextCursor };
}
