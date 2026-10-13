// ─── Unión discriminada: todos los tipos comparten una propiedad "etiqueta" (kind) ───
export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2; // aquí TS sabe que existe radius
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default: {
      // Comprobación exhaustiva: si añades un tipo nuevo a Shape y olvidas
      // su "case", esta línea da ERROR de compilación
      const unreachable: never = shape;
      return unreachable;
    }
  }
}

// ─── Caso real: estado de una petición ───
export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export function render(state: RequestState<string[]>): string {
  switch (state.status) {
    case 'idle':
      return 'Pulsa "buscar"';
    case 'loading':
      return 'Cargando…';
    case 'success':
      return `${state.data.length} resultados: ${state.data.join(', ')}`;
    case 'error':
      return `Error: ${state.message}`;
  }
}

// ─── Caso real: resultado de una operación (sin lanzar excepciones) ───
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function divide(a: number, b: number): Result<number> {
  return b === 0 ? { ok: false, error: 'No se puede dividir entre 0' } : { ok: true, value: a / b };
}

// ▶ Demo
export default function demo() {
  const shapes: Shape[] = [
    { kind: 'circle', radius: 2 },
    { kind: 'rectangle', width: 3, height: 4 },
    { kind: 'triangle', base: 6, height: 2 },
  ];
  for (const shape of shapes) console.log(shape.kind.padEnd(10), '→ área', area(shape).toFixed(2));

  console.log(render({ status: 'loading' }));
  console.log(render({ status: 'success', data: ['ts', 'js'] }));
  console.log(render({ status: 'error', message: 'Timeout' }));

  for (const result of [divide(10, 4), divide(1, 0)]) {
    console.log(result.ok ? `✅ ${result.value}` : `❌ ${result.error}`);
  }
}
