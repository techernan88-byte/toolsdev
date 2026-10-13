import type { Results } from '@electric-sql/pglite';
import type { SqlOutcome } from '../db/database';

const MAX_ROWS = 100;

/** Convierte un valor de PostgreSQL en texto legible. */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) {
    const iso = value.toISOString();
    // DATE llega como medianoche UTC; TIMESTAMP/TIMESTAMPTZ se muestran en hora local
    return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : value.toLocaleString('sv-SE');
  }
  if (Array.isArray(value)) return `{${value.map(formatValue).join(',')}}`; // formato de arrays de PostgreSQL
  if (typeof value === 'object') return JSON.stringify(value); // JSONB
  return String(value);
}

function ResultTable({ result }: { result: Results }) {
  const rows = result.rows.slice(0, MAX_ROWS);

  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
      <table className="w-full text-left font-mono text-xs">
        <thead className="bg-zinc-800 text-zinc-400">
          <tr>
            {result.fields.map((field, index) => (
              <th key={index} className="px-3 py-2 font-semibold whitespace-nowrap">
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-zinc-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-white/5">
              {result.fields.map((field, index) => {
                const value = row[field.name];
                return (
                  <td
                    key={index}
                    className={`px-3 py-1.5 whitespace-nowrap ${value === null ? 'text-zinc-600 italic' : ''}`}
                  >
                    {formatValue(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-white/5 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-500">
        {result.rows.length} fila(s){result.rows.length > MAX_ROWS && ` · mostrando las primeras ${MAX_ROWS}`}
      </p>
    </div>
  );
}

/** Muestra el resultado de cada statement: tabla si devuelve filas, o el comando ejecutado. */
export default function SqlResults({ outcome }: { outcome: SqlOutcome }) {
  return (
    <div className="space-y-2">
      {outcome.results.map((result, index) =>
        result.fields.length > 0 ? (
          <ResultTable key={index} result={result} />
        ) : (
          <p key={index} className="font-mono text-xs text-emerald-400">
            ✓ {result.command ?? 'OK'}
            {result.rowCount !== undefined && ` · ${result.rowCount} fila(s)`}
          </p>
        )
      )}
      {outcome.error && (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-xs text-rose-300">
          ❌ ERROR: {outcome.error}
        </p>
      )}
      <p className="text-xs text-zinc-600">⏱️ {outcome.ms.toFixed(0)} ms</p>
    </div>
  );
}
