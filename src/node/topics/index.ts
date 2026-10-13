/**
 * Temas de Node + Express + TypeScript + Prisma, de lo más fácil a lo más complejo.
 * Son snippets (código de servidor que no se ejecuta en el navegador).
 * El menú los agrupa por nivel. Para añadir uno: crea el archivo e impórtalo en su nivel.
 */
import type { Topic } from '../../types';
import { byDifficulty } from '../../utils/byDifficulty';
import setup from './setup';
import express from './express';
import rutas from './rutas';
import middleware from './middleware';
import validacion from './validacion';
import errores from './errores';
import prismaSetup from './prismaSetup';
import prismaCrud from './prismaCrud';
import prismaRelaciones from './prismaRelaciones';
import auth from './auth';
import arquitectura from './arquitectura';
import testing from './testing';
import produccion from './produccion';

const topics = byDifficulty<Topic>({
  // Montar el servidor y responder peticiones
  basico: [setup, express, rutas, middleware],
  // Datos seguros y base de datos
  intermedio: [validacion, errores, prismaSetup, prismaCrud],
  // Funcionalidades reales, arquitectura y despliegue
  avanzado: [prismaRelaciones, auth, arquitectura, testing, produccion],
});

export default topics;
