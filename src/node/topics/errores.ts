import type { Topic } from '../../types';

export default {
  id: 'errores',
  icon: '🚨',
  title: 'Manejo de errores',
  description:
    'En vez de responder errores en cada controlador, se lanzan errores con significado (NotFoundError, ConflictError...) y un único middleware de errores, al final de app.ts, decide el código HTTP y el formato de la respuesta.',
  tip: 'Nunca envíes el stack trace ni mensajes internos (de la base de datos) al cliente en producción: regístralos en los logs y responde un mensaje genérico.',

  snippets: [
    {
      title: 'Clases de error de la aplicación',
      files: [
        {
          name: 'src/lib/errors.ts',
          lang: 'ts',
          code: `export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string = 'APP_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Petición inválida', details?: unknown) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Sin permisos') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(404, \`\${resource} no encontrado\`, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(409, message, 'CONFLICT');
  }
}`,
        },
        {
          name: 'uso en un servicio',
          lang: 'ts',
          code: `import { NotFoundError, ConflictError } from '../../lib/errors.js';

export async function getById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError('Producto');   // → 404 automáticamente
  return product;
}

export async function register(email: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new ConflictError('Ese correo ya está registrado');  // → 409
  // ...
}`,
        },
      ],
    },
    {
      title: 'Express 5: errores async sin try/catch',
      lang: 'ts',
      code: `// ✅ Express 5: si getById lanza NotFoundError, va directo al errorHandler
router.get('/:id', async (req, res) => {
  const product = await productsService.getById(req.params.id);
  res.json(product);
});

// ❌ Express 4 necesitaba esto en CADA ruta async (o la librería express-async-errors)
router.get('/:id', async (req, res, next) => {
  try {
    const product = await productsService.getById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Respuesta de error consistente en toda la API:
// { "code": "NOT_FOUND", "message": "Producto no encontrado" }
// { "code": "VALIDATION_ERROR", "message": "Datos inválidos", "details": { "price": ["..."] } }`,
    },
    {
      title: 'Middleware de errores (Zod, Prisma, JWT y errores propios)',
      files: [
        {
          name: 'src/middlewares/error-handler.ts',
          lang: 'ts',
          code: `import type { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';
import { Prisma } from '../generated/prisma/client.js';
import { AppError } from '../lib/errors.js';
import { env } from '../config/env.js';

// 404 para rutas que no existen (va DESPUÉS de todas las rutas)
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ code: 'ROUTE_NOT_FOUND', message: \`No existe \${req.method} \${req.originalUrl}\` });
}

// Los middlewares de error tienen 4 parámetros: (err, req, res, next)
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // 1. Errores de validación de Zod → 400 con el detalle por campo
  if (err instanceof ZodError) {
    return void res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Datos inválidos',
      details: z.flattenError(err).fieldErrors,
    });
  }

  // 2. Nuestros errores
  if (err instanceof AppError) {
    return void res.status(err.statusCode).json({ code: err.code, message: err.message, details: err.details });
  }

  // 3. Errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return void res.status(409).json({ code: 'CONFLICT', message: 'Ya existe un registro con esos datos', details: err.meta });
    }
    if (err.code === 'P2025') {
      return void res.status(404).json({ code: 'NOT_FOUND', message: 'Registro no encontrado' });
    }
    if (err.code === 'P2003') {
      return void res.status(400).json({ code: 'INVALID_RELATION', message: 'La relación indicada no existe' });
    }
  }

  // 4. Cualquier otro error: 500 sin filtrar detalles internos
  console.error(\`[\${res.locals.requestId}]\`, err);
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Error interno del servidor',
    ...(env.NODE_ENV === 'development' && { stack: (err as Error).stack }),
  });
}`,
        },
        {
          name: 'src/app.ts',
          lang: 'ts',
          code: `import express from 'express';
import { v1Router } from './routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

export const app = express();
app.use(express.json());

app.use('/api/v1', v1Router);

// ⚠️ Siempre al final y en este orden
app.use(notFoundHandler);
app.use(errorHandler);`,
        },
      ],
    },
  ],
} satisfies Topic;
