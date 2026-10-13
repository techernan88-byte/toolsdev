import { useState } from 'react';
import CodeViewer from '../../components/topic/CodeViewer';
import SqlResults from './SqlResults';
import { runIsolated, type SqlOutcome } from '../db/database';

const button = 'rounded-md px-3 py-1.5 text-xs font-semibold transition';

/**
 * Snippet de SQL ejecutable: muestra el código, permite editarlo
 * y lo ejecuta en un PostgreSQL nuevo con los datos de la tienda.
 */
export default function RunnableSql({ code: initialCode }: { code: string }) {
  const [code, setCode] = useState(initialCode.trim());
  const [isEditing, setIsEditing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [outcome, setOutcome] = useState<SqlOutcome | null>(null);

  const run = async () => {
    setIsRunning(true);
    setOutcome(await runIsolated(code));
    setIsRunning(false);
  };

  return (
    <div className="space-y-2">
      {isEditing ? (
        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) run();
          }}
          spellCheck={false}
          rows={Math.min(Math.max(code.split('\n').length + 1, 4), 24)}
          className="block w-full resize-y rounded-xl border border-sky-500/50 bg-black p-4 font-mono text-[13px] leading-relaxed text-sky-200 outline-none"
        />
      ) : (
        <CodeViewer files={[{ code, lang: 'sql' }]} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={run}
          disabled={isRunning}
          className={`${button} bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50`}
        >
          {isRunning ? '⏳ Ejecutando…' : '▶ Ejecutar'}
        </button>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className={`${button} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
        >
          {isEditing ? '✓ Listo' : '✏️ Editar'}
        </button>
        {code !== initialCode.trim() && (
          <button
            onClick={() => setCode(initialCode.trim())}
            className={`${button} text-zinc-400 hover:text-white`}
          >
            ↺ Restaurar
          </button>
        )}
        <span className="text-xs text-zinc-500">
          {isEditing
            ? 'Ctrl+Enter para ejecutar'
            : 'PostgreSQL real en tu navegador · base de datos de la tienda'}
        </span>
      </div>

      {outcome && <SqlResults outcome={outcome} />}
    </div>
  );
}
