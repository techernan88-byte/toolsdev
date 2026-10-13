// ─── Genérico <T>: una función que sirve para CUALQUIER tipo, sin perder el tipo ───
export function first<T>(items: T[]): T | undefined {
  return items[0];
}

export const firstNumber = first([10, 20, 30]); // number | undefined
export const firstName = first(['Ana', 'Luis']); // string | undefined

// ─── Varios genéricos ───
export function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// ─── Restricciones con "extends": T debe tener al menos estas propiedades ───
export function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// ─── keyof: solo claves que existen en el objeto ───
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ─── Genéricos útiles del día a día ───
export function groupBy<T, K extends PropertyKey>(items: T[], getKey: (item: T) => K): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

export function uniqueBy<T>(items: T[], getKey: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface Employee {
  name: string;
  team: 'frontend' | 'backend';
  salary: number;
}

export const employees: Employee[] = [
  { name: 'Ana', team: 'frontend', salary: 42000 },
  { name: 'Luis', team: 'backend', salary: 45000 },
  { name: 'Marta', team: 'frontend', salary: 48000 },
  { name: 'Ana', team: 'frontend', salary: 42000 },
];

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript() {
  // @ts-expect-error → Argument of type '"age"' is not assignable to parameter of type 'keyof Employee'
  getProperty(employees[0], 'age');
  // @ts-expect-error → number no tiene "length"
  longest(10, 20);
}

// ▶ Demo
export default function demo() {
  console.log('first:', firstNumber, firstName, first([]));
  console.log('pair:', pair('edad', 30));
  console.log('longest:', longest('hola', 'adiós'), longest([1, 2], [1, 2, 3]));
  console.log('getProperty:', getProperty(employees[1], 'salary'));

  const unique = uniqueBy(employees, (employee) => employee.name);
  const uniqueNames = unique.map((employee) => employee.name);
  console.log('Únicos:', uniqueNames);

  const byTeam = groupBy(unique, (employee) => employee.team);
  for (const [team, members] of Object.entries(byTeam)) {
    const names = members.map((member) => member.name);
    console.log(team, '→', names);
  }
}
