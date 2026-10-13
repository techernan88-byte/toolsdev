import type { PGlite, Results } from '@electric-sql/pglite';
import { SEED_SQL } from './seed';

/**
 * PostgreSQL REAL dentro del navegador gracias a PGlite (Postgres compilado a WebAssembly).
 * El paquete pesa varios MB, así que se descarga solo la primera vez que se ejecuta SQL.
 */

export interface SqlOutcome {
  results: Results[];
  error?: string;
  ms: number;
}

/** Crea una base de datos en memoria, opcionalmente con los datos de la tienda. */
export async function createDatabase({ seed = true } = {}): Promise<PGlite> {
  const { PGlite } = await import('@electric-sql/pglite');
  const db = await PGlite.create();
  if (seed) await db.exec(SEED_SQL);
  return db;
}

/** Ejecuta uno o varios statements y devuelve los resultados (o el error de PostgreSQL). */
export async function execute(db: PGlite, sql: string): Promise<SqlOutcome> {
  const start = performance.now();
  try {
    const results = await db.exec(sql);
    return { results, ms: performance.now() - start };
  } catch (error) {
    return { results: [], error: (error as Error).message, ms: performance.now() - start };
  }
}

/**
 * Ejecuta SQL en una base de datos NUEVA que se descarta al terminar.
 * Así cada ejemplo empieza con los mismos datos aunque haga INSERT, DELETE o DROP.
 */
export async function runIsolated(sql: string): Promise<SqlOutcome> {
  const db = await createDatabase();
  try {
    return await execute(db, sql);
  } finally {
    await db.close();
  }
}
