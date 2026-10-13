import type { Topic } from '../../types';

export default {
  id: 'prisma-crud',
  icon: '🗃️',
  title: 'Prisma: consultas CRUD',
  description:
    'Crear, leer, actualizar y borrar con el cliente de Prisma: filtros, ordenación, paginación, selección de campos, conteos, agregaciones y agrupaciones. Todo con autocompletado y tipos en el resultado.',
  tip: 'select y include cambian el TIPO del resultado: si haces select: { name: true }, TypeScript sabe que solo existe "name".',

  snippets: [
    {
      title: 'Leer: findMany, findUnique, findFirst',
      lang: 'ts',
      code: `import { prisma } from '../lib/prisma.js';

// Todos
const products = await prisma.product.findMany();

// Por clave única (id o campo @unique) → Product | null
const product = await prisma.product.findUnique({ where: { id } });
const user = await prisma.user.findUnique({ where: { email: 'ana@mail.com' } });

// Lanza error P2025 si no existe (útil con el error handler → 404)
const productOrThrow = await prisma.product.findUniqueOrThrow({ where: { id } });

// El primero que cumpla un filtro
const cheapest = await prisma.product.findFirst({
  where: { stock: { gt: 0 } },
  orderBy: { price: 'asc' },
});

// Elegir columnas (no envíes la contraseña al cliente)
const publicUsers = await prisma.user.findMany({
  select: { id: true, name: true, email: true, role: true },
});

// Omitir columnas concretas
const safeUser = await prisma.user.findUnique({
  where: { id },
  omit: { password: true },
});`,
    },
    {
      title: 'Crear, actualizar y borrar',
      lang: 'ts',
      code: `// Crear uno
const product = await prisma.product.create({
  data: { name: 'Monitor 27"', price: 329, stock: 5, categoryId },
});

// Crear muchos (devuelve { count })
await prisma.tag.createMany({
  data: [{ name: 'gaming' }, { name: 'oficina' }],
  skipDuplicates: true,
});

// Actualizar por id (lanza P2025 si no existe)
const updated = await prisma.product.update({
  where: { id },
  data: { price: 299, stock: { decrement: 1 } },     // operaciones atómicas: increment, decrement, multiply
});

// Actualizar muchos
await prisma.product.updateMany({
  where: { stock: 0 },
  data: { deletedAt: new Date() },
});

// Crear o actualizar (upsert)
await prisma.category.upsert({
  where: { slug: 'audio' },
  create: { name: 'Audio', slug: 'audio' },
  update: { name: 'Audio' },
});

// Borrar
await prisma.product.delete({ where: { id } });
await prisma.product.deleteMany({ where: { deletedAt: { lt: new Date('2025-01-01') } } });`,
    },
    {
      title: 'Filtros (where) y ordenación',
      lang: 'ts',
      code: `const results = await prisma.product.findMany({
  where: {
    deletedAt: null,                                       // IS NULL
    price: { gte: 10, lte: 100 },                          // entre 10 y 100
    stock: { gt: 0 },
    name: { contains: 'teclado', mode: 'insensitive' },    // ILIKE %teclado%
    categoryId: { in: ['cat-1', 'cat-2'] },
    createdAt: { gte: new Date('2026-01-01') },

    // Combinar condiciones
    OR: [{ name: { startsWith: 'Pro' } }, { description: { contains: 'oferta' } }],
    NOT: { stock: 0 },

    // Filtrar por una relación
    category: { slug: 'perifericos' },                     // 1:N
    tags: { some: { name: 'gaming' } },                    // N:M: al menos una etiqueta
  },
  orderBy: [{ price: 'desc' }, { name: 'asc' }],           // varios criterios
});

// Usuarios que NUNCA han hecho un pedido
const withoutOrders = await prisma.user.findMany({ where: { orders: { none: {} } } });

// Usuarios cuyos pedidos están TODOS pagados
const goodCustomers = await prisma.user.findMany({ where: { orders: { every: { status: 'PAID' } } } });`,
    },
    {
      title: 'Paginación con total (offset y cursor)',
      description: 'Servicio completo para un listado con búsqueda: la respuesta típica de una API real.',
      lang: 'ts',
      code: `import type { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import type { ListProductsQuery } from './products.schema.js';

export async function listProducts({ page, limit, search, sort, order, minPrice }: ListProductsQuery) {
  // Prisma.ProductWhereInput: el tipo del filtro, generado por Prisma
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(minPrice !== undefined && { price: { gte: minPrice } }),
  };

  // $transaction con un array: ambas consultas en una sola ida a la BD
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: { select: { name: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

// Paginación por CURSOR (mejor para scroll infinito y tablas enormes)
export async function listAfter(cursor?: string, take = 20) {
  const items = await prisma.product.findMany({
    take: take + 1,                                  // uno extra para saber si hay más
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
  });
  const hasMore = items.length > take;
  return { items: items.slice(0, take), nextCursor: hasMore ? items[take - 1]!.id : null };
}`,
    },
    {
      title: 'Agregaciones y agrupaciones (estadísticas para un dashboard)',
      lang: 'ts',
      code: `// Total vendido, pedido medio, máximo y número de pedidos pagados
const stats = await prisma.order.aggregate({
  where: { status: 'PAID' },
  _sum: { total: true },
  _avg: { total: true },
  _max: { total: true },
  _count: { _all: true },
});
// stats._sum.total → Decimal | null

// Pedidos por estado: [{ status: 'PAID', _count: { _all: 12 } }, ...]
const byStatus = await prisma.order.groupBy({
  by: ['status'],
  _count: { _all: true },
  _sum: { total: true },
  orderBy: { _count: { status: 'desc' } },
});

// Contar relaciones sin traerlas
const categories = await prisma.category.findMany({
  select: { name: true, _count: { select: { products: true } } },
});
// [{ name: 'Periféricos', _count: { products: 12 } }]

// SQL a mano cuando lo necesites (seguro contra inyección con plantillas)
const minPrice = 50;
const rows = await prisma.$queryRaw<{ month: Date; revenue: number }[]>\`
  SELECT date_trunc('month', "createdAt") AS month, SUM(total)::float AS revenue
  FROM orders
  WHERE total > \${minPrice}
  GROUP BY 1 ORDER BY 1
\`;`,
    },
  ],
} satisfies Topic;
