/**
 * Convierte cualquier valor en texto legible, como hace la consola del navegador:
 * strings tal cual, y objetos, arrays, Map, Set, clases… en una línea.
 */
export function inspect(value: unknown, depth = 0): string {
  if (typeof value === 'string') return depth === 0 ? value : JSON.stringify(value);
  if (value === null || value === undefined || typeof value !== 'object') {
    if (typeof value === 'function') return `[Function ${value.name || 'anónima'}]`;
    if (typeof value === 'bigint') return `${value}n`;
    return String(value);
  }
  if (depth > 4) return '…';

  if (Array.isArray(value)) return `[${value.map((item) => inspect(item, depth + 1)).join(', ')}]`;
  if (value instanceof Map) {
    const entries = [...value].map(
      ([key, item]) => `${inspect(key, depth + 1)} => ${inspect(item, depth + 1)}`
    );
    return `Map(${value.size}) {${entries.join(', ')}}`;
  }
  if (value instanceof Set)
    return `Set(${value.size}) {${[...value].map((item) => inspect(item, depth + 1)).join(', ')}}`;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;

  const name = value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : '';
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${inspect(item, depth + 1)}`);
  return `${name}{ ${entries.join(', ')} }`;
}

/** Ejecuta una función y devuelve todo lo que imprime por consola (y el error si lo hay). */
export async function captureConsole(run: () => void | Promise<void>): Promise<string[]> {
  const lines: string[] = [];
  const original = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  const capture =
    (prefix: string) =>
    (...args: unknown[]) =>
      lines.push(prefix + args.map((arg) => inspect(arg)).join(' '));

  console.log = capture('');
  console.info = capture('');
  console.warn = capture('⚠️ ');
  console.error = capture('❌ ');
  try {
    await run();
  } catch (error) {
    lines.push(`💥 Error sin capturar: ${inspect(error)}`);
  } finally {
    Object.assign(console, original);
  }
  return lines;
}
