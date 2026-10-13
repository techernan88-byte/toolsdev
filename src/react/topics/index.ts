/**
 * Temas de React, de lo más fácil a lo más complejo.
 * El menú los agrupa por nivel. Para añadir uno: crea el archivo e impórtalo en su nivel.
 */
import type { Topic } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import fundamentos from './fundamentos';
import props from './props';
import estado from './estado';
import listas from './listas';
import formularios from './formularios';
import typescript from './typescript';
import efectos from './efectos';
import referencias from './referencias';
import contexto from './contexto';
import reducer from './reducer';
import customHooks from './customHooks';
import tanstackQuery from './tanstackQuery';
import tanstackTable from './tanstackTable';
import rendimiento from './rendimiento';
import patrones from './patrones';
import react19 from './react19';
import tanstackEcosistema from './tanstackEcosistema';

const topics = byDifficulty<Topic>({
  // Pintar componentes, pasar datos y reaccionar al usuario
  basico: [fundamentos, props, estado, listas, formularios],
  // Tipos, efectos y estado compartido entre componentes
  intermedio: [typescript, efectos, referencias, contexto, reducer, customHooks],
  // Librerías profesionales, optimización y patrones de arquitectura
  avanzado: [tanstackQuery, tanstackTable, rendimiento, patrones, react19, tanstackEcosistema],
});

export default topics;
