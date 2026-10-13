import type { Topic } from '../../types';
import { example } from '../source';

export default {
  id: 'tipos-basicos',
  icon: '🔤',
  title: 'Tipos básicos',
  description:
    'TypeScript es JavaScript con tipos. Se declaran con ": tipo" después del nombre y el compilador avisa de los errores ANTES de ejecutar. Si das un valor inicial, el tipo se deduce solo (inferencia).',
  tip: 'Las líneas con // @ts-expect-error muestran errores reales: el proyecto se compila y TypeScript confirma que esas líneas fallan. Pulsa ▶ Ejecutar para ver la salida.',

  snippets: [
    {
      title: 'Resumen rápido: cómo se declara cada tipo',
      lang: 'ts',
      code: `let texto: string = 'hola';
let numero: number = 42;            // enteros y decimales
let activo: boolean = true;
let nada: null = null;
let sinDefinir: undefined = undefined;
let grande: bigint = 100n;
let id: symbol = Symbol('id');

let lista: number[] = [1, 2, 3];
let otraLista: Array<string> = ['a', 'b'];
let tupla: [string, number] = ['edad', 30];
let objeto: { nombre: string; edad?: number } = { nombre: 'Ana' };
let union: string | number = 'abc';
let literal: 'si' | 'no' = 'si';
let funcion: (a: number) => string = (a) => a.toString();
let cualquiera: unknown = JSON.parse('{}');   // prefiere unknown a any`,
    },
    example('basicos/primitivos.ts', 'Primitivos, arrays, tuplas y literales'),
    example(
      'basicos/anyUnknown.ts',
      'any vs unknown, null y undefined',
      'unknown obliga a comprobar el tipo antes de usarlo; any desactiva TypeScript.'
    ),
  ],
} satisfies Topic;
