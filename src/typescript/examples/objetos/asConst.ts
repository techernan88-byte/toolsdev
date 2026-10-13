// ─── enum: conjunto de constantes con nombre ───
export enum Role {
  User = 'USER',
  Editor = 'EDITOR',
  Admin = 'ADMIN',
}

// ─── as const: la alternativa moderna (y más ligera) a los enums ───
export const STATUS = {
  pending: 'pending',
  paid: 'paid',
  shipped: 'shipped',
} as const; // todo readonly y con tipos literales

export type Status = (typeof STATUS)[keyof typeof STATUS]; // 'pending' | 'paid' | 'shipped'

export const SIZES = ['S', 'M', 'L', 'XL'] as const;
export type Size = (typeof SIZES)[number]; // 'S' | 'M' | 'L' | 'XL'

// ─── satisfies: comprueba el tipo SIN perder la información exacta ───
type Colors = Record<string, string | [number, number, number]>;

export const palette = {
  primary: '#0ea5e9',
  danger: [244, 63, 94],
} satisfies Colors;

// Con "satisfies" TS recuerda que primary es string y danger una tupla:
export const primaryUpper = palette.primary.toUpperCase();
export const dangerRed = palette.danger[0];

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  // @ts-expect-error → Type '"XXL"' is not assignable to type 'Size'
  const wrongSize: Size = 'XXL';
  // @ts-expect-error → Cannot assign to 'paid' because it is a read-only property (as const)
  STATUS.paid = 'pagado';
  return wrongSize;
}

// ▶ Demo
export default function demo() {
  const role: Role = Role.Admin;
  console.log('Enum:', role, '| todos los roles:', Object.values(Role));

  const status: Status = STATUS.paid;
  console.log('Estado:', status, '| posibles:', Object.values(STATUS));
  console.log('Tallas:', SIZES);
  console.log('Paleta:', primaryUpper, '| rojo:', dangerRed);
}
