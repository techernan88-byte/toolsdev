export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  bio?: string;
}

// Partial<T>: todas las propiedades opcionales (ideal para "actualizar")
export type UserUpdate = Partial<User>;

// Required<T>: todas obligatorias
export type CompleteUser = Required<User>;

// Readonly<T>: nada se puede modificar
export type FrozenUser = Readonly<User>;

// Pick<T, K>: quedarse solo con algunas
export type UserPreview = Pick<User, 'id' | 'name'>;

// Omit<T, K>: quitar algunas (¡nunca envíes la contraseña!)
export type PublicUser = Omit<User, 'password'>;

// Combinados: para crear, sin id y con bio opcional
export type CreateUserInput = Omit<User, 'id'>;

// Record<K, V>: objeto con esas claves y ese tipo de valor
export type Role = User['role']; // 'user' | 'admin'  (tipo de una propiedad)
export const permissions: Record<Role, string[]> = {
  user: ['read'],
  admin: ['read', 'write', 'delete'],
};

export function updateUser(user: User, changes: UserUpdate): User {
  return { ...user, ...changes };
}

export function toPublic({ password: _password, ...rest }: User): PublicUser {
  return rest;
}

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript(frozen: FrozenUser, preview: UserPreview) {
  // @ts-expect-error → Cannot assign to 'name' because it is a read-only property
  frozen.name = 'Otro';
  // @ts-expect-error → Property 'email' does not exist on type 'UserPreview'
  return preview.email;
}

// ▶ Demo
export default function demo() {
  const ana: User = { id: 1, name: 'Ana', email: 'ana@mail.com', password: 's3cr3t', role: 'admin' };

  const updated = updateUser(ana, { bio: 'Frontend dev', name: 'Ana G.' });
  console.log('Partial →', updated);

  const preview: UserPreview = { id: ana.id, name: ana.name };
  console.log('Pick →', preview);

  console.log('Omit (sin password) →', toPublic(ana));
  console.log('Record → permisos de admin:', permissions[ana.role]);
}
