/**
 * Temas de TypeScript, de lo más fácil a lo más complejo.
 * Los ejemplos son archivos .ts reales (carpeta examples/): se comprueban al compilar
 * y se ejecutan con el botón ▶ Ejecutar.
 */
import type { Topic } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import tiposBasicos from './tiposBasicos';
import objetos from './objetos';
import funciones from './funciones';
import uniones from './uniones';
import genericos from './genericos';
import utilitarios from './utilitarios';
import clases from './clases';
import algoritmosBasicos from './algoritmosBasicos';
import estructurasLineales from './estructurasLineales';
import tiposAvanzados from './tiposAvanzados';
import algoritmosAvanzados from './algoritmosAvanzados';
import estructurasAvanzadas from './estructurasAvanzadas';

const topics = byDifficulty<Topic>({
  // Declarar tipos
  basico: [tiposBasicos, objetos, funciones, uniones],
  // Reutilizar tipos y primeros algoritmos y estructuras
  intermedio: [genericos, utilitarios, clases, algoritmosBasicos, estructurasLineales],
  // Tipos calculados, algoritmos eficientes y estructuras no lineales
  avanzado: [tiposAvanzados, algoritmosAvanzados, estructurasAvanzadas],
});

export default topics;
