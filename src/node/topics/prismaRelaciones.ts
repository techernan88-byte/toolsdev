import type { Topic } from '../../types';

export default {
  id: 'prisma-relaciones',
  icon: '🔗',
  title: 'Prisma: relaciones y transacciones',
  description:
    'Leer datos relacionados (include/select anidados), crear y conectar relaciones en una sola operación (nested writes), transacciones para operaciones que deben ocurrir juntas y extensiones del cliente.',
  tip: 'Cuidado con el problema N+1: no hagas una consulta por cada elemento de un bucle. Usa include, o trae los ids y haz una sola consulta con { in: ids }.',

  snippets: [
    {
      title: 'Leer relaciones: include y select anidados',
      lang: 'ts',
      code: `// Producto con su categoría y etiquetas
const product = await prisma.product.findUnique({
  where: { id },
  include: {
    category: true,
    tags: { select: { name: true } },
  },
});
// product.category.name, product.tags[0].name → tipados

// Usuario con sus 5 últimos pedidos y los productos de cada pedido
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    profile: { select: { avatarUrl: true } },
    orders: {
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        total: true,
        status: true,
        items: { select: { quantity: true, product: { select: { name: true } } } },
      },
    },
  },
});

// ❌ N+1: una consulta por cada pedido
for (const order of orders) {
  order.user = await prisma.user.findUnique({ where: { id: order.userId } });
}
// ✅ Una sola consulta
const ordersWithUser = await prisma.order.findMany({ include: { user: { select: { name: true } } } });`,
    },
    {
      title: 'Escrituras anidadas: create, connect, connectOrCreate, set',
      lang: 'ts',
      code: `// Crear usuario + perfil en una sola operación (atómica)
const user = await prisma.user.create({
  data: {
    email: 'ana@mail.com',
    name: 'Ana',
    password: hash,
    profile: { create: { bio: 'Hola 👋' } },
  },
  include: { profile: true },
});

// Crear producto conectándolo a una categoría existente y a etiquetas
// (connectOrCreate: si la etiqueta no existe, la crea)
const product = await prisma.product.create({
  data: {
    name: 'Auriculares',
    price: 119,
    category: { connect: { slug: 'audio' } },
    tags: {
      connectOrCreate: ['bluetooth', 'gaming'].map((name) => ({
        where: { name },
        create: { name },
      })),
    },
  },
});

// Reemplazar TODAS las etiquetas de un producto
await prisma.product.update({
  where: { id },
  data: { tags: { set: [{ name: 'oferta' }, { name: 'nuevo' }] } },
});

// Quitar una etiqueta concreta
await prisma.product.update({
  where: { id },
  data: { tags: { disconnect: { name: 'nuevo' } } },
});`,
    },
    {
      title: 'Tipos generados por Prisma',
      lang: 'ts',
      code: `import type { Prisma, Product, User } from '../generated/prisma/client.js';

// Tipo de un modelo tal cual (todas las columnas)
function format(product: Product) {
  return \`\${product.name}: \${product.price.toFixed(2)} €\`;
}

// Tipo de un resultado CON relaciones (lo que devuelve un include)
type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true; tags: true } }>;

// Definir el select una vez y reutilizar el tipo
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

// Tipos de entrada para servicios
type CreateUserData = Prisma.UserCreateInput;
type ProductFilters = Prisma.ProductWhereInput;

// ⚠️ Decimal se serializa en JSON como string ("89.9"). Conviértelo si lo necesitas:
const dto = { ...product, price: product.price.toNumber() };`,
    },
    {
      title: 'Transacción interactiva: crear un pedido (caso real)',
      description:
        'Comprobar stock, descontarlo, calcular el total y crear el pedido: o se hace TODO, o no se hace nada.',
      lang: 'ts',
      code: `import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';

interface OrderLine {
  productId: string;
  quantity: number;
}

export async function createOrder(userId: string, lines: OrderLine[]) {
  return prisma.$transaction(async (tx) => {
    // 1. Traer todos los productos de una vez
    const products = await tx.product.findMany({
      where: { id: { in: lines.map((line) => line.productId) }, deletedAt: null },
    });

    let total = new Prisma.Decimal(0);

    for (const line of lines) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) throw new NotFoundError(\`Producto \${line.productId}\`);

      // 2. Descontar stock SOLO si hay suficiente (atómico, evita vender de más)
      const { count } = await tx.product.updateMany({
        where: { id: product.id, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });
      if (count === 0) throw new BadRequestError(\`Sin stock suficiente de "\${product.name}"\`);

      total = total.plus(product.price.times(line.quantity));
    }

    // 3. Crear el pedido con sus líneas
    return tx.order.create({
      data: {
        userId,
        total,
        items: {
          create: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: products.find((p) => p.id === line.productId)!.price,
          })),
        },
      },
      include: { items: true },
    });
  });
  // Si cualquier paso lanza un error, Prisma hace ROLLBACK de todo
}`,
    },
    {
      title: 'Extensiones del cliente: campos calculados y borrado lógico',
      lang: 'ts',
      code: `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const basePrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

export const prisma = basePrisma.$extends({
  // Campo calculado: product.priceWithTax (tipado)
  result: {
    product: {
      priceWithTax: {
        needs: { price: true },
        compute: (product) => product.price.times(1.21).toDecimalPlaces(2),
      },
    },
  },

  // Métodos propios en los modelos
  model: {
    product: {
      async softDelete(id: string) {
        return basePrisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
      },
    },
  },

  // Interceptar consultas: ocultar siempre los productos borrados
  query: {
    product: {
      async findMany({ args, query }) {
        args.where = { deletedAt: null, ...args.where };
        return query(args);
      },
    },
  },
});

// Uso
await prisma.product.softDelete(id);
const products = await prisma.product.findMany();   // sin los borrados, con priceWithTax`,
    },
  ],
} satisfies Topic;
