import type { Topic } from '../../types';

export default {
  id: 'arquitectura',
  icon: '🏛️',
  title: 'Arquitectura por capas',
  description:
    'Un módulo completo como en un proyecto profesional: rutas → controlador (HTTP) → servicio (reglas de negocio) → Prisma (datos). Cada capa tiene una sola responsabilidad y se puede testear por separado.',
  tip: 'El controlador NO conoce Prisma y el servicio NO conoce req/res. Así puedes reutilizar el servicio desde un job, un script o un test sin Express.',

  snippets: [
    {
      title: 'Flujo de una petición',
      lang: 'text',
      code: `PATCH /api/v1/products/7c9e…   { "price": 79 }
        │
        ▼
 ┌──────────────┐  helmet, cors, json, logger, rateLimit
 │ Middlewares  │
 └──────┬───────┘
        ▼
 ┌──────────────┐  products.routes.ts
 │    Router    │  requireAuth → requireRole('ADMIN') → validate({ params, body })
 └──────┬───────┘
        ▼
 ┌──────────────┐  products.controller.ts
 │ Controlador  │  lee req, llama al servicio, responde res.json()
 └──────┬───────┘
        ▼
 ┌──────────────┐  products.service.ts
 │   Servicio   │  reglas de negocio: ¿existe?, ¿precio válido?, ¿quién puede?
 └──────┬───────┘
        ▼
 ┌──────────────┐  lib/prisma.ts
 │    Prisma    │  SQL tipado contra PostgreSQL
 └──────────────┘
        │  si algo lanza un error en cualquier capa…
        ▼
 ┌──────────────┐
 │ errorHandler │  → { code, message } con el status HTTP correcto
 └──────────────┘`,
    },
    {
      title: 'Respuestas que devuelve la API',
      lang: 'json',
      code: `// GET /api/v1/products?search=teclado&page=1&limit=2
{
  "items": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Teclado mecánico",
      "description": null,
      "price": "89.9",
      "stock": 25,
      "category": { "id": "…", "name": "Periféricos", "slug": "perifericos" },
      "tags": [{ "name": "gaming" }],
      "createdAt": "2026-10-12T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 2, "total": 1, "totalPages": 1 }
}

// POST /api/v1/products con price negativo → 400
{
  "code": "VALIDATION_ERROR",
  "message": "Datos inválidos",
  "details": { "price": ["Too small: expected number to be >0"] }
}`,
    },
    {
      title: 'Módulo "products" completo',
      files: [
        {
          name: 'products.schema.ts',
          lang: 'ts',
          code: `import { z } from 'zod';

export const productIdSchema = z.object({ id: z.uuid() });

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(0),
  categoryId: z.uuid(),
  tags: z.array(z.string().trim().toLowerCase()).max(10).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: z.string().optional(),
  sort: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsSchema>;`,
        },
        {
          name: 'products.service.ts',
          lang: 'ts',
          code: `import type { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from './products.schema.js';

// Qué devolvemos al cliente (definido una vez)
const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  category: { select: { id: true, name: true, slug: true } },
  tags: { select: { name: true } },
  createdAt: true,
} satisfies Prisma.ProductSelect;

export async function list({ page, limit, search, category, sort, order }: ListProductsQuery) {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(category && { category: { slug: category } }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, select: productSelect, orderBy: { [sort]: order }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ]);

  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getById(id: string) {
  const product = await prisma.product.findFirst({ where: { id, deletedAt: null }, select: productSelect });
  if (!product) throw new NotFoundError('Producto');
  return product;
}

export async function create({ tags, ...data }: CreateProductInput) {
  return prisma.product.create({
    data: {
      ...data,
      tags: { connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })) },
    },
    select: productSelect,
  });
}

export async function update(id: string, { tags, ...data }: UpdateProductInput) {
  await getById(id); // 404 si no existe o está borrado
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(tags && { tags: { set: [], connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })) } }),
    },
    select: productSelect,
  });
}

export async function remove(id: string) {
  await getById(id);
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } }); // borrado lógico
}`,
        },
        {
          name: 'products.controller.ts',
          lang: 'ts',
          code: `import type { Request, Response } from 'express';
import * as productsService from './products.service.js';
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from './products.schema.js';

type IdParams = { id: string };

export async function list(_req: Request, res: Response) {
  res.json(await productsService.list(res.locals.query as ListProductsQuery));
}

export async function getById(req: Request<IdParams>, res: Response) {
  res.json(await productsService.getById(req.params.id));
}

export async function create(req: Request<{}, {}, CreateProductInput>, res: Response) {
  const product = await productsService.create(req.body);
  res.status(201).location(\`/api/v1/products/\${product.id}\`).json(product);
}

export async function update(req: Request<IdParams, {}, UpdateProductInput>, res: Response) {
  res.json(await productsService.update(req.params.id, req.body));
}

export async function remove(req: Request<IdParams>, res: Response) {
  await productsService.remove(req.params.id);
  res.status(204).end();
}`,
        },
        {
          name: 'products.routes.ts',
          lang: 'ts',
          code: `import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as productsController from './products.controller.js';
import { createProductSchema, listProductsSchema, productIdSchema, updateProductSchema } from './products.schema.js';

export const productsRouter = Router();

// Públicas
productsRouter.get('/', validate({ query: listProductsSchema }), productsController.list);
productsRouter.get('/:id', validate({ params: productIdSchema }), productsController.getById);

// Solo administradores
const adminOnly = [requireAuth, requireRole('ADMIN')];

productsRouter.post('/', ...adminOnly, validate({ body: createProductSchema }), productsController.create);
productsRouter.patch('/:id', ...adminOnly, validate({ params: productIdSchema, body: updateProductSchema }), productsController.update);
productsRouter.delete('/:id', ...adminOnly, validate({ params: productIdSchema }), productsController.remove);`,
        },
        {
          name: 'app.ts',
          lang: 'ts',
          code: `import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { v1Router } from './routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', v1Router);

app.use(notFoundHandler);
app.use(errorHandler);`,
        },
      ],
    },
  ],
} satisfies Topic;
