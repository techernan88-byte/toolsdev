/**
 * Temas de Python + FastAPI, de lo más fácil a lo más complejo.
 * Son snippets (código de servidor que no se ejecuta en el navegador).
 * El menú los agrupa por nivel. Para añadir uno: crea el archivo e impórtalo en su nivel.
 */
import type { Topic } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import esencial from './esencial';
import tipos from './tipos';
import inicio from './inicio';
import rutas from './rutas';
import pydantic from './pydantic';
import errores from './errores';
import dependencias from './dependencias';
import sqlalchemy from './sqlalchemy';
import alembic from './alembic';
import auth from './auth';
import arquitectura from './arquitectura';
import asyncTopic from './async';
import testing from './testing';
import produccion from './produccion';

const topics = byDifficulty<Topic>({
  // El lenguaje y tu primera API
  basico: [esencial, tipos, inicio],
  // Recibir y validar datos, y guardarlos en PostgreSQL
  intermedio: [rutas, pydantic, errores, dependencias, sqlalchemy],
  // Proyecto profesional: migraciones, seguridad, arquitectura, tests y despliegue
  avanzado: [alembic, auth, arquitectura, asyncTopic, testing, produccion],
});

export default topics;
