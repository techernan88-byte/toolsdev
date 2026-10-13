import type { Topic } from '../../types';

export default {
  id: 'prisma-setup',
  icon: '🔺',
  title: 'Prisma: configuración y modelos',
  description:
    'Prisma es el ORM más usado con TypeScript. Defines los modelos en schema.prisma, Prisma crea las tablas con migraciones y genera un cliente 100% tipado: si una columna no existe, el código ni compila.',
  tip: 'Estos snippets usan Prisma 7 (generator "prisma-client", prisma.config.ts y driver adapter). Si tu proyecto usa Prisma 6, mira el último snippet con las diferencias.',

  snippets: [
    {
      title: '1. Instalación e inicialización',
      lang: 'bash',
      code: `# CLI de Prisma (solo desarrollo) + cliente + adaptador de PostgreSQL
npm install -D prisma
npm install @prisma/client @prisma/adapter-pg dotenv

# Crea prisma/schema.prisma, prisma.config.ts y añade DATABASE_URL al .env
npx prisma init --datasource-provider postgresql

# Base de datos local rápida con Docker
docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17`,
    },
    {
      title: '2. Esquema completo de una tienda',
      description:
        'Usuarios, perfil (1:1), categorías y productos (1:N), etiquetas (N:M) y pedidos con líneas (N:M con datos extra).',
      files: [
        {
          name: 'prisma/schema.prisma',
          lang: 'prisma',
          code: `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  CANCELLED
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  profile   Profile?                     // 1:1 (opcional)
  orders    Order[]                      // 1:N
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")                         // nombre real de la tabla
}

model Profile {
  id        String  @id @default(uuid())
  bio       String?
  avatarUrl String?
  userId    String  @unique
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  slug     String    @unique
  products Product[]

  @@map("categories")
}

model Product {
  id          String      @id @default(uuid())
  name        String
  description String?
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  tags        Tag[]                       // N:M implícita (Prisma crea la tabla intermedia)
  orderItems  OrderItem[]
  deletedAt   DateTime?                   // borrado lógico
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([categoryId])
  @@index([name])
  @@map("products")
}

model Tag {
  id       String    @id @default(uuid())
  name     String    @unique
  products Product[]

  @@map("tags")
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
  total     Decimal     @db.Decimal(10, 2)
  status    OrderStatus @default(PENDING)
  createdAt DateTime    @default(now())

  @@index([userId])
  @@map("orders")
}

// N:M explícita: la tabla intermedia guarda datos propios (cantidad y precio)
model OrderItem {
  orderId   String
  productId String
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2)
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@id([orderId, productId])                // clave primaria compuesta
  @@map("order_items")
}`,
        },
      ],
    },
    {
      title: '3. Configuración y cliente único',
      files: [
        {
          name: 'prisma.config.ts',
          lang: 'ts',
          code: `import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});`,
        },
        {
          name: 'src/lib/prisma.ts',
          lang: 'ts',
          code: `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// UNA sola instancia para toda la app (cada instancia abre su propio pool de conexiones)
export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});`,
        },
        {
          name: 'src/server.ts',
          lang: 'ts',
          code: `import { app } from './app.js';
import { prisma } from './lib/prisma.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => console.log(\`🚀 http://localhost:\${env.PORT}\`));

// Cierre ordenado: deja de aceptar peticiones y cierra la conexión a la BD
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);`,
        },
      ],
    },
    {
      title: '4. Migraciones y comandos del día a día',
      lang: 'bash',
      code: `# Crea una migración a partir de los cambios del schema y la aplica (desarrollo)
npx prisma migrate dev --name init
npx prisma migrate dev --name add_product_tags

# Genera el cliente tipado (tras cambiar el schema)
npx prisma generate

# Aplica las migraciones pendientes en producción / CI (no crea nuevas)
npx prisma migrate deploy

# Ejecuta prisma/seed.ts
npx prisma db seed

# Interfaz web para ver y editar los datos
npx prisma studio

# Borra la BD, reaplica todas las migraciones y ejecuta el seed (¡solo en desarrollo!)
npx prisma migrate reset

# Comprueba y formatea el schema
npx prisma validate
npx prisma format

# Leer una base de datos que ya existe y generar el schema
npx prisma db pull`,
    },
    {
      title: '5. Seed: datos de prueba',
      files: [
        {
          name: 'prisma/seed.ts',
          lang: 'ts',
          code: `import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  // upsert: crea si no existe, actualiza si existe → el seed se puede ejecutar varias veces
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      name: 'Admin',
      password: await bcrypt.hash('Admin1234', 10),
      role: 'ADMIN',
      profile: { create: { bio: 'Administrador de la tienda' } },
    },
  });

  const perifericos = await prisma.category.upsert({
    where: { slug: 'perifericos' },
    update: {},
    create: { name: 'Periféricos', slug: 'perifericos' },
  });

  await prisma.product.createMany({
    data: [
      { name: 'Teclado mecánico', price: 89.9, stock: 25, categoryId: perifericos.id },
      { name: 'Ratón inalámbrico', price: 39.5, stock: 40, categoryId: perifericos.id },
    ],
    skipDuplicates: true,
  });

  console.log('🌱 Seed completado. Admin:', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());`,
        },
      ],
    },
    {
      title: 'Diferencias si usas Prisma 6',
      lang: 'prisma',
      code: `// Prisma 6 (todavía muy común en proyectos existentes)
generator client {
  provider = "prisma-client-js"            // cliente generado dentro de node_modules
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")           // la URL va en el schema
}

// src/lib/prisma.ts (Prisma 6)
// import { PrismaClient } from '@prisma/client';
// export const prisma = new PrismaClient();  // sin adapter

// En package.json (Prisma 6):
// "prisma": { "seed": "tsx prisma/seed.ts" }`,
    },
  ],
} satisfies Topic;
