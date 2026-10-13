/**
 * Temas de Git, de lo más fácil a lo más complejo.
 * El tema de GitFlow incluye un simulador interactivo (components/GitFlowSimulator.tsx).
 */
import type { Topic } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import introduccion from './introduccion';
import basico from './basico';
import remotos from './remotos';
import ramas from './ramas';
import deshacer from './deshacer';
import conflictos from './conflictos';
import rebase from './rebase';
import commits from './commits';
import gitflow from './gitflow';
import estrategias from './estrategias';
import versiones from './versiones';
import avanzado from './avanzado';

const topics = byDifficulty<Topic>({
  // Guardar cambios, subirlos y trabajar con ramas
  basico: [introduccion, basico, remotos, ramas],
  // Arreglar errores, resolver conflictos y mantener un historial limpio
  intermedio: [deshacer, conflictos, rebase, commits],
  // Trabajo en equipo: modelos de ramas, versiones y herramientas avanzadas
  avanzado: [gitflow, estrategias, versiones, avanzado],
});

export default topics;
