import type { Topic } from '../../types';

export default {
  id: 'validacion',
  icon: '🛡️',
  title: 'Validación con Zod',
  description:
    'Los tipos de TypeScript desaparecen al ejecutar: el cliente puede enviar cualquier cosa. Zod valida los datos en tiempo de ejecución y además GENERA el tipo de TypeScript a partir del esquema, así no escribes lo mismo dos veces.',
  tip: 'Valida SIEMPRE en el backend, aunque el frontend ya valide. El frontend se puede saltar con un simple curl.',

  snippets: [
    {
      title: 'Esquemas y tipos inferidos',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: 'npm install zod',
        },
        {
          name: 'src/modules/products/products.schema.ts',
          lang: 'ts',
          code: `import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(120),
  description: z.string().max(2000).optional(),
  price: z.number().positive('El precio debe ser mayor que 0'),
  stock: z.number().int().min(0).default(0),
  categoryId: z.uuid('Categoría no válida'),
  tags: z.array(z.string()).max(10).default([]),
});

// PATCH: todos los campos opcionales
export const updateProductSchema = createProductSchema.partial();

// Params de la URL
export const productIdSchema = z.object({ id: z.uuid() });

// Query string: llega TODO como string → z.coerce convierte a número
export const listProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sort: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  minPrice: z.coerce.number().optional(),
});

// Los tipos salen del esquema
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsSchema>;`,
        },
      ],
    },
    {
      title: 'Middleware validate reutilizable',
      description:
        'En Express 5 req.query es de solo lectura, así que los datos validados se guardan en res.locals.',
      files: [
        {
          name: 'src/middlewares/validate.ts',
          lang: 'ts',
          code: `import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

// Si falla, parse() lanza un ZodError → lo convierte en 400 el error handler
export function validate(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) req.body = schemas.body.parse(req.body);           // body limpio y con defaults
    if (schemas.params) res.locals.params = schemas.params.parse(req.params);
    if (schemas.query) res.locals.query = schemas.query.parse(req.query);
    next();
  };
}`,
        },
        {
          name: 'products.routes.ts',
          lang: 'ts',
          code: `import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { createProductSchema, listProductsSchema, productIdSchema, updateProductSchema } from './products.schema.js';
import * as productsController from './products.controller.js';

export const productsRouter = Router();

productsRouter.get('/', validate({ query: listProductsSchema }), productsController.list);
productsRouter.get('/:id', validate({ params: productIdSchema }), productsController.getById);
productsRouter.post('/', validate({ body: createProductSchema }), productsController.create);
productsRouter.patch('/:id', validate({ params: productIdSchema, body: updateProductSchema }), productsController.update);`,
        },
        {
          name: 'products.controller.ts',
          lang: 'ts',
          code: `import type { Request, Response } from 'express';
import type { CreateProductInput, ListProductsQuery } from './products.schema.js';
import * as productsService from './products.service.js';

export async function list(_req: Request, res: Response) {
  const query = res.locals.query as ListProductsQuery;   // ya validado y convertido
  res.json(await productsService.list(query));
}

export async function create(req: Request<{}, {}, CreateProductInput>, res: Response) {
  const product = await productsService.create(req.body); // ya validado
  res.status(201).json(product);
}`,
        },
      ],
    },
    {
      title: 'Validaciones avanzadas',
      lang: 'ts',
      code: `import { z } from 'zod';

// Comparar campos entre sí
export const registerSchema = z
  .object({
    email: z.email().toLowerCase(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'Debe tener una mayúscula')
      .regex(/[0-9]/, 'Debe tener un número'),
    confirmPassword: z.string(),
    birthDate: z.coerce.date().max(new Date(), 'Fecha no válida'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Uniones discriminadas: el body cambia según "type"
export const paymentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('card'), cardNumber: z.string().length(16), cvv: z.string().length(3) }),
  z.object({ type: z.literal('paypal'), email: z.email() }),
  z.object({ type: z.literal('transfer'), iban: z.string().min(15) }),
]);

// Transformar al validar
export const searchSchema = z.object({
  tags: z
    .string()
    .optional()
    .transform((value) => (value ? value.split(',').map((tag) => tag.trim()) : [])), // "a, b" → ['a','b']
});

// safeParse: no lanza, devuelve { success, data | error }
const result = registerSchema.safeParse(input);
if (!result.success) {
  console.log(z.flattenError(result.error).fieldErrors);   // { email: ['Invalid email'], ... }
}`,
    },
  ],
} satisfies Topic;
