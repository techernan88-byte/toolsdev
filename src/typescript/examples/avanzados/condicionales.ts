// ─── Tipos condicionales: "T extends U ? X : Y" (un if para tipos) ───
export type IsString<T> = T extends string ? 'sí' : 'no';
export type A = IsString<'hola'>; // 'sí'
export type B = IsString<42>; // 'no'

// ─── infer: "extraer" un tipo de dentro de otro ───
export type ElementType<T> = T extends (infer Item)[] ? Item : T;
export type C = ElementType<string[]>; // string

export type UnwrapPromise<T> = T extends Promise<infer Value> ? Value : T;
export type D = UnwrapPromise<Promise<number>>; // number

export type FirstArg<F> = F extends (first: infer First, ...rest: never[]) => unknown ? First : never;
export type E = FirstArg<(id: number, name: string) => void>; // number

// ─── Distributivos: se aplican a cada miembro de una unión ───
export type ToArray<T> = T extends unknown ? T[] : never;
export type F = ToArray<string | number>; // string[] | number[]

// ─── Recursivos: DeepPartial y DeepReadonly ───
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// ─── Rutas de un objeto como strings: "theme.colors.primary" ───
export type Paths<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? K | `${K}.${Paths<T[K]>}` : K }[keyof T & string]
  : never;

export interface Config {
  server: { port: number; host: string };
  theme: { colors: { primary: string; secondary: string } };
}

export const defaults: Config = {
  server: { port: 3000, host: 'localhost' },
  theme: { colors: { primary: '#0ea5e9', secondary: '#a855f7' } },
};

/** Mezcla profunda: la configuración del usuario solo sobrescribe lo que define */
export function mergeConfig(base: Config, overrides: DeepPartial<Config>): Config {
  return {
    server: { ...base.server, ...overrides.server },
    theme: { colors: { ...base.theme.colors, ...overrides.theme?.colors } },
  };
}

/** Leer un valor por su ruta, con la ruta comprobada por TypeScript */
export function getByPath(obj: object, path: Paths<Config>): unknown {
  return path.split('.').reduce<unknown>((current, key) => (current as Record<string, unknown>)?.[key], obj);
}

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript(frozen: DeepReadonly<Config>) {
  // @ts-expect-error → readonly en profundidad
  frozen.theme.colors.primary = 'red';
  // @ts-expect-error → la ruta 'theme.font' no existe
  getByPath(defaults, 'theme.font');
}

// ▶ Demo
export default function demo() {
  const finalConfig = mergeConfig(defaults, {
    server: { port: 8080 },
    theme: { colors: { primary: '#f43f5e' } },
  });
  console.log('Config mezclada:', finalConfig);
  console.log('server.port →', getByPath(finalConfig, 'server.port'));
  console.log('theme.colors.secondary →', getByPath(finalConfig, 'theme.colors.secondary'));

  const answers: [A, B] = ['sí', 'no'];
  console.log('IsString<"hola">, IsString<42>:', answers);
}
