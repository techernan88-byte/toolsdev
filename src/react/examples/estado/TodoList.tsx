import { useState, type FormEvent } from 'react';

// Patrones de la industria con arrays en el estado:
// - Tipar la forma de los datos con una interface.
// - Nunca mutar: crear arrays nuevos con [...], map y filter.
// - IDs estables con crypto.randomUUID() (no usar el índice como key).
// - Estado derivado: "pendientes" se CALCULA, no se guarda en otro useState.

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: crypto.randomUUID(), text: 'Aprender useState', done: true },
    { id: crypto.randomUUID(), text: 'Practicar con un proyecto', done: false },
  ]);
  const [text, setText] = useState('');

  const pendingCount = todos.filter((todo) => !todo.done).length; // derivado

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
    setText('');
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((todo) => todo.id !== id));

  return (
    <div className="max-w-md space-y-3">
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Nueva tarea…"
          className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button className="rounded-lg bg-sky-500 px-4 font-semibold text-white hover:bg-sky-400">
          Añadir
        </button>
      </form>

      <ul className="divide-y divide-white/5 rounded-lg bg-zinc-800/50">
        {todos.map((todo) => (
          <li key={todo.id} className="group flex items-center gap-3 px-3 py-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="size-4 accent-sky-500"
            />
            <span className={`flex-1 ${todo.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label="Eliminar"
              className="text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-rose-400"
            >
              🗑️
            </button>
          </li>
        ))}
        {todos.length === 0 && <li className="px-3 py-6 text-center text-zinc-500">No hay tareas 🎉</li>}
      </ul>

      <p className="text-sm text-zinc-500">
        {pendingCount} pendiente(s) de {todos.length}
      </p>
    </div>
  );
}
