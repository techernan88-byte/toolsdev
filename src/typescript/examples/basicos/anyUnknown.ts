// ─── any: desactiva TypeScript (evítalo) ───
export function withAny(value: any) {
  return value.toUpperCase(); // TS no avisa… y explota si value no es un string
}

// ─── unknown: "no sé qué es", pero OBLIGA a comprobarlo antes de usarlo ───
export function withUnknown(value: unknown): string {
  if (typeof value === 'string') return value.toUpperCase(); // aquí TS ya sabe que es string
  if (typeof value === 'number') return value.toFixed(2);
  return String(value);
}

// ─── Datos que vienen de fuera (JSON, APIs…) son unknown hasta validarlos ───
export function parseAge(json: string): number | null {
  const data: unknown = JSON.parse(json);
  if (typeof data === 'object' && data !== null && 'age' in data && typeof data.age === 'number') {
    return data.age;
  }
  return null;
}

// ─── null y undefined con strictNullChecks ───
export function greet(name: string | null) {
  return `Hola, ${name ?? 'invitado'}`; // ?? = valor por defecto si es null/undefined
}

// ─── Errores que TypeScript detecta al compilar (esta función nunca se ejecuta) ───
export function erroresQueDetectaTypeScript(value: unknown, name: string | null) {
  // @ts-expect-error → 'value' is of type 'unknown' (hay que comprobar su tipo antes)
  value.toUpperCase();

  // @ts-expect-error → 'name' is possibly 'null'
  name.length;
}

// ▶ Demo
export default function demo() {
  console.log(withUnknown('hola'), withUnknown(3.14159), withUnknown(true));
  console.log(parseAge('{"age": 30}'), parseAge('{"name": "Ana"}'));
  console.log(greet('Ana'), '|', greet(null));

  try {
    withAny(123); // compila, pero falla al ejecutar
  } catch (error) {
    console.log('any dejó pasar un bug:', (error as Error).message);
  }
}
