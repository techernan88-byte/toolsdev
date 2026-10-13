import type { Topic } from '../../types';

export default {
  id: 'middleware',
  icon: '🧅',
  title: 'Middleware',
  description:
    'Un middleware es una función (req, res, next) que se ejecuta ANTES del controlador. Puede leer o modificar la petición, cortar la respuesta (ej. 401) o llamar a next() para pasar al siguiente. Se ejecutan en el orden en que se registran.',
  tip: 'Orden típico: seguridad (helmet, cors) → parsers (json) → logs → rate limit → rutas → 404 → manejador de errores (siempre el último).',

  snippets: [
    {
      title: 'Middlewares propios: logger, request id y tiempo de respuesta',
      code: `import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

// Asigna un id único a cada petición (útil para seguir logs)
export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = req.get('x-request-id') ?? randomUUID();
  res.set('x-request-id', id);
  res.locals.requestId = id;
  next();
}

// Log de cada petición con su duración
export function logger(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();

  // "finish" se dispara cuando la respuesta ya se envió
  res.on('finish', () => {
    const ms = (performance.now() - start).toFixed(1);
    console.log(\`\${req.method} \${req.originalUrl} → \${res.statusCode} (\${ms} ms) [\${res.locals.requestId}]\`);
  });

  next();
}

// Uso en app.ts
app.use(requestId);
app.use(logger);`,
    },
    {
      title: 'Middlewares de terceros más usados',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm install helmet cors express-rate-limit compression cookie-parser
npm install -D @types/cors @types/compression @types/cookie-parser`,
        },
        {
          name: 'src/app.ts',
          lang: 'ts',
          code: `import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';

export const app = express();

app.set('trust proxy', 1);   // si estás detrás de un proxy (Nginx, Render, Railway...)

app.use(helmet());                                         // cabeceras de seguridad
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());                                    // gzip de las respuestas
app.use(express.json({ limit: '1mb' }));                   // body JSON con límite de tamaño
app.use(express.urlencoded({ extended: true }));           // formularios HTML
app.use(cookieParser());                                   // req.cookies

// Límite de peticiones: 100 cada 15 min por IP
app.use('/api', rateLimit({ windowMs: 15 * 60_000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }));

// Límite más estricto para el login (fuerza bruta)
app.use('/api/v1/auth/login', rateLimit({ windowMs: 15 * 60_000, limit: 5 }));`,
        },
      ],
    },
    {
      title: 'Ampliar el tipo Request (req.user) con declaration merging',
      description: 'Así TypeScript sabe que req.user existe después del middleware de autenticación.',
      files: [
        {
          name: 'src/types/express.d.ts',
          lang: 'ts',
          code: `import type { Role } from '../generated/prisma/client.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};`,
        },
        {
          name: 'src/middlewares/auth.ts',
          lang: 'ts',
          code: `import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ForbiddenError, UnauthorizedError } from '../lib/errors.js';

interface TokenPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

// Exige un token válido en "Authorization: Bearer <token>"
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) throw new UnauthorizedError('Falta el token');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    throw new UnauthorizedError('Token inválido o expirado');
  }
}

// Middleware "fábrica": recibe parámetros y devuelve el middleware
export function requireRole(...roles: Array<'ADMIN' | 'USER'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new ForbiddenError('No tienes permisos');
    next();
  };
}`,
        },
        {
          name: 'users.routes.ts',
          lang: 'ts',
          code: `import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.js';
import * as usersController from './users.controller.js';

export const usersRouter = Router();

// Middleware para TODAS las rutas de este router
usersRouter.use(requireAuth);

usersRouter.get('/me', usersController.me);                                  // cualquier usuario logueado
usersRouter.get('/', requireRole('ADMIN'), usersController.list);            // solo admin
usersRouter.delete('/:id', requireRole('ADMIN'), usersController.remove);`,
        },
      ],
    },
  ],
} satisfies Topic;
