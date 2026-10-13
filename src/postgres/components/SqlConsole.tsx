import { useEffect, useRef, useState } from 'react';
import type { PGlite } from '@electric-sql/pglite';
import SqlResults from './SqlResults';
import { createDatabase, execute, type SqlOutcome } from '../db/database';

// Consultas rápidas para explorar la base de datos
const SHORTCUTS = [
  {
    label: '📋 Tablas',
    sql: `SELECT 'categories' AS tabla, count(*) AS filas FROM categories
UNION ALL SELECT 'products',    count(*) FROM products
UNION ALL SELECT 'customers',   count(*) FROM customers
UNION ALL SELECT 'orders',      count(*) FROM orders
UNION ALL SELECT 'order_items', count(*) FROM order_items;`,
  },
  {
    label: '🧱 Columnas',
    sql: `SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;`,
  },
  { label: '📦 Productos', sql: 'SELECT * FROM products ORDER BY id;' },
  { label: '🧾 Pedidos', sql: 'SELECT * FROM orders ORDER BY created_at DESC;' },
];

/**
 * Consola SQL libre: una base de datos que se MANTIENE entre ejecuciones
 * (puedes crear tablas, insertar y consultar después).
 */
export default function SqlConsole() {
  const [sql, setSql] = useState(SHORTCUTS[2].sql);
  const [outcome, setOutcome] = useState<SqlOutcome | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const dbRef = useRef<Promise<PGlite> | null>(null);

  // Cerrar la base de datos al salir de la página
  useEffect(() => () => void dbRef.current?.then((db) => db.close()), []);

  const run = async (query = sql) => {
    setIsRunning(true);
    dbRef.current ??= createDatabase(); // se crea la primera vez
    setOutcome(await execute(await dbRef.current, query));
    setIsRunning(false);
  };

  const resetDatabase = async () => {
    await dbRef.current?.then((db) => db.close());
    dbRef.current = null;
    setOutcome(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {SHORTCUTS.map((shortcut) => (
          <button
            key={shortcut.label}
            onClick={() => {
              setSql(shortcut.sql);
              run(shortcut.sql);
            }}
            className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      <textarea
        value={sql}
        onChange={(event) => setSql(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) run();
        }}
        spellCheck={false}
        rows={6}
        className="block w-full resize-y rounded-xl border border-zinc-700 bg-black p-4 font-mono text-[13px] leading-relaxed text-sky-200 outline-none focus:border-sky-500"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => run()}
          disabled={isRunning}
          className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {isRunning ? '⏳ Ejecutando…' : '▶ Ejecutar (Ctrl+Enter)'}
        </button>
        <button
          onClick={resetDatabase}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
        >
          ↺ Reiniciar base de datos
        </button>
        <span className="text-xs text-zinc-500">
          {dbRef.current
            ? 'Los cambios se mantienen hasta reiniciar.'
            : 'La primera ejecución descarga PostgreSQL (varios MB, solo esa vez).'}
        </span>
      </div>

      {outcome && <SqlResults outcome={outcome} />}
    </div>
  );
}
