// ─── Utilitarios para UNIONES ───
export type Status = 'draft' | 'published' | 'archived' | 'deleted';

export type VisibleStatus = Exclude<Status, 'deleted'>; // quita de la unión
export type FinalStatus = Extract<Status, 'archived' | 'deleted' | 'otro'>; // se queda con las comunes
export type MaybeName = string | null | undefined;
export type Name = NonNullable<MaybeName>; // string

// ─── Utilitarios para FUNCIONES ───
export function createOrder(customerId: number, items: string[], express = false) {
  return { id: Math.floor(Math.random() * 1000), customerId, items, express, createdAt: new Date() };
}

export type Order = ReturnType<typeof createOrder>; // el tipo que devuelve la función
export type CreateOrderArgs = Parameters<typeof createOrder>; // [number, string[], boolean?]

export async function fetchSettings() {
  return { theme: 'dark' as const, notifications: true };
}

export type Settings = Awaited<ReturnType<typeof fetchSettings>>; // desenvuelve la Promise

// Ejemplo práctico: reintentar cualquier función con los mismos argumentos
export function withLogging<F extends (...args: never[]) => unknown>(fn: F, label: string) {
  return (...args: Parameters<F>): ReturnType<F> => {
    console.log(`→ ${label}(${args.map(String).join(', ')})`);
    return fn(...args) as ReturnType<F>;
  };
}

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  // @ts-expect-error → '"deleted"' no está en VisibleStatus
  const status: VisibleStatus = 'deleted';
  return status;
}

// ▶ Demo
export default async function demo() {
  const visible: VisibleStatus[] = ['draft', 'published', 'archived'];
  console.log('VisibleStatus:', visible);

  const args: CreateOrderArgs = [7, ['teclado', 'ratón'], true];
  const order: Order = createOrder(...args);
  console.log('Order (ReturnType):', order);

  const settings: Settings = await fetchSettings();
  console.log('Settings (Awaited):', settings);

  const loggedOrder = withLogging(createOrder, 'createOrder');
  console.log('Resultado:', loggedOrder(3, ['monitor']).items);
}
