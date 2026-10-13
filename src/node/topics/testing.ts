import type { Topic } from '../../types';

export default {
  id: 'testing',
  icon: '🧪',
  title: 'Tests con Vitest y Supertest',
  description:
    'Tests unitarios para la lógica (servicios, utilidades) y tests de integración que llaman a la API de verdad con Supertest, sin levantar el servidor. Por eso app.ts y server.ts van separados.',
  tip: 'Usa una base de datos SOLO para tests (DATABASE_URL distinta en .env.test) y límpiala antes de cada test para que no dependan unos de otros.',

  snippets: [
    {
      title: 'Configuración',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm install -D vitest supertest @types/supertest

npm test                 # modo watch
npx vitest run           # una sola vez (CI)
npx vitest run --coverage`,
        },
        {
          name: 'vitest.config.ts',
          lang: 'ts',
          code: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,        // los tests de integración comparten la BD
  },
});`,
        },
        {
          name: 'tests/setup.ts',
          lang: 'ts',
          code: `import { afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma.js';

// Vacía las tablas antes de cada test (el orden importa por las claves foráneas)
beforeEach(async () => {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});`,
        },
      ],
    },
    {
      title: 'Test de integración de la API',
      lang: 'ts',
      code: `import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

// Registra un usuario y devuelve su token
async function registerAndGetToken(email = 'user@test.com') {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Test', email, password: 'Password123' });
  return response.body.token as string;
}

// Crea un admin directamente en la BD y hace login para obtener un token con rol ADMIN
async function adminToken() {
  await registerAndGetToken('admin@test.com');
  await prisma.user.update({ where: { email: 'admin@test.com' }, data: { role: 'ADMIN' } });
  const login = await request(app).post('/api/v1/auth/login').send({ email: 'admin@test.com', password: 'Password123' });
  return login.body.token as string;
}

describe('POST /api/v1/auth/register', () => {
  it('crea el usuario y no devuelve la contraseña', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Ana', email: 'ana@test.com', password: 'Password123' });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ name: 'Ana', email: 'ana@test.com', role: 'USER' });
    expect(response.body.user.password).toBeUndefined();
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('responde 409 si el correo ya existe', async () => {
    const body = { name: 'Ana', email: 'ana@test.com', password: 'Password123' };
    await request(app).post('/api/v1/auth/register').send(body);
    const response = await request(app).post('/api/v1/auth/register').send(body);

    expect(response.status).toBe(409);
    expect(response.body.code).toBe('CONFLICT');
  });

  it('responde 400 con los errores de validación', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({ email: 'no-es-un-correo' });

    expect(response.status).toBe(400);
    expect(response.body.details).toHaveProperty('email');
    expect(response.body.details).toHaveProperty('password');
  });
});

describe('POST /api/v1/products', () => {
  it('permite crear a un ADMIN', async () => {
    const category = await prisma.category.create({ data: { name: 'Audio', slug: 'audio' } });
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', \`Bearer \${await adminToken()}\`)
      .send({ name: 'Auriculares', price: 119, categoryId: category.id });

    expect(response.status).toBe(201);
    expect(response.headers.location).toBe(\`/api/v1/products/\${response.body.id}\`);
  });

  it('rechaza a usuarios sin rol ADMIN', async () => {
    const token = await registerAndGetToken();
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', \`Bearer \${token}\`)
      .send({ name: 'X', price: 10, categoryId: crypto.randomUUID() });

    expect(response.status).toBe(403);
  });

  it('responde 401 sin token', async () => {
    const response = await request(app).post('/api/v1/products').send({});
    expect(response.status).toBe(401);
  });
});`,
    },
    {
      title: 'Test unitario con mocks',
      description:
        'Probar un servicio sin base de datos: vi.mock sustituye el módulo de Prisma por funciones falsas.',
      lang: 'ts',
      code: `import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import * as productsService from '../src/modules/products/products.service.js';
import { NotFoundError } from '../src/lib/errors.js';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    product: { findFirst: vi.fn(), update: vi.fn() },
  },
}));

describe('productsService.getById', () => {
  beforeEach(() => vi.clearAllMocks());

  it('devuelve el producto si existe', async () => {
    vi.mocked(prisma.product.findFirst).mockResolvedValue({ id: '1', name: 'Teclado' } as never);

    await expect(productsService.getById('1')).resolves.toMatchObject({ name: 'Teclado' });
    expect(prisma.product.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: '1', deletedAt: null } })
    );
  });

  it('lanza NotFoundError si no existe', async () => {
    vi.mocked(prisma.product.findFirst).mockResolvedValue(null);

    await expect(productsService.getById('nope')).rejects.toBeInstanceOf(NotFoundError);
  });
});`,
    },
  ],
} satisfies Topic;
