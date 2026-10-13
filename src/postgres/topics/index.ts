/**
 * Temas de PostgreSQL, de lo más fácil a lo más complejo.
 * Los snippets con runnable: true se ejecutan en un PostgreSQL real dentro del navegador (PGlite).
 * El menú los agrupa por nivel. Para añadir uno: crea el archivo e impórtalo en su nivel.
 */
import type { Topic } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import introduccion from './introduccion';
import select from './select';
import modificar from './modificar';
import tablas from './tablas';
import joins from './joins';
import agregaciones from './agregaciones';
import funciones from './funciones';
import subconsultas from './subconsultas';
import indices from './indices';
import ventanas from './ventanas';
import transacciones from './transacciones';
import jsonb from './jsonb';
import vistas from './vistas';
import administracion from './administracion';

const topics = byDifficulty<Topic>({
  // Leer, escribir y crear tablas
  basico: [introduccion, select, modificar, tablas],
  // Combinar tablas, resumir datos y optimizar
  intermedio: [joins, agregaciones, funciones, subconsultas, indices],
  // Análisis, consistencia, datos semiestructurados y producción
  avanzado: [ventanas, transacciones, jsonb, vistas, administracion],
});

export default topics;
