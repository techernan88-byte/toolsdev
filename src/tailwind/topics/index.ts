/**
 * Secciones de Tailwind, de lo más fácil a lo más complejo.
 * El menú las agrupa por nivel. Para añadir una: crea el archivo e impórtalo en su nivel.
 */
import type { TailwindSection } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import colores from './colores';
import tipografia from './tipografia';
import espaciado from './espaciado';
import tamano from './tamano';
import bordes from './bordes';
import estados from './estados';
import flexbox from './flexbox';
import grid from './grid';
import posicion from './posicion';
import responsive from './responsive';
import efectos from './efectos';
import animaciones from './animaciones';
import componentes from './componentes';
import layouts from './layouts';
import landing from './landing';

const sections = byDifficulty<TailwindSection>({
  // Propiedades sueltas de un elemento
  basico: [colores, tipografia, espaciado, tamano, bordes],
  // Interacción y cómo se colocan varios elementos
  intermedio: [estados, flexbox, grid, posicion, responsive],
  // Efectos y combinar todo en componentes y páginas completas
  avanzado: [efectos, animaciones, componentes, layouts, landing],
});

export default sections;
