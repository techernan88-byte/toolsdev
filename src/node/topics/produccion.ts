import type { Topic } from '../../types';

export default {
  id: 'produccion',
  icon: '🚢',
  title: 'Configuración y producción',
  description:
    'Lo que separa una API de práctica de una lista para producción: variables de entorno validadas, logs estructurados, seguridad, cierre ordenado, Docker y despliegue de migraciones.',
  tip: 'Si falta una variable de entorno, la app debe fallar AL ARRANCAR con un mensaje claro, no a las 3 de la mañana cuando alguien usa esa función.',

  snippets: [
    {
      title: 'Variables de entorno validadas con Zod',
      files: [
        {
          name: 'src/config/env.ts',
          lang: 'ts',
          code: `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

// env.PORT es number, env.NODE_ENV es 'development' | 'test' | 'production'
export const env = parsed.data;`,
        },
      ],
    },
    {
      title: 'Logs estructurados con Pino',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm install pino pino-http
npm install -D pino-pretty`,
        },
        {
          name: 'src/lib/logger.ts',
          lang: 'ts',
          code: `import pino from 'pino';
import { env } from '../config/env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  // En desarrollo: legible. En producción: JSON (lo leen Datadog, Loki, CloudWatch...)
  ...(env.NODE_ENV === 'development' && { transport: { target: 'pino-pretty', options: { colorize: true } } }),
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'],   // nunca loguear secretos
});`,
        },
        {
          name: 'src/app.ts',
          lang: 'ts',
          code: `import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger.js';

app.use(pinoHttp({ logger }));   // log de cada petición con su duración y status

// En cualquier handler: req.log incluye el id de la petición
app.get('/api/v1/orders', async (req, res) => {
  req.log.info({ userId: req.user?.id }, 'Listando pedidos');
  res.json(await ordersService.list());
});`,
        },
      ],
    },
    {
      title: 'Docker: imagen de producción + PostgreSQL en local',
      files: [
        {
          name: 'Dockerfile',
          lang: 'dockerfile',
          code: `# ---- 1. Build: instala todo y compila TypeScript ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ---- 2. Runtime: solo lo necesario para ejecutar ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

USER node
EXPOSE 3000
# Aplica migraciones pendientes y arranca
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]`,
        },
        {
          name: 'docker-compose.yml',
          lang: 'yaml',
          code: `services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mi_api
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/mi_api
      JWT_SECRET: \${JWT_SECRET}
      CORS_ORIGIN: http://localhost:5173
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:`,
        },
        {
          name: 'terminal',
          lang: 'bash',
          code: `docker compose up -d db          # solo la base de datos (desarrollo)
docker compose up --build        # todo: API + base de datos
docker compose logs -f api
docker compose down              # parar (los datos quedan en el volumen pgdata)`,
        },
      ],
    },
    {
      title: 'Checklist antes de desplegar',
      lang: 'text',
      code: `✅ Variables de entorno validadas al arrancar (config/env.ts)
✅ helmet, cors con origen concreto (no "*") y rate limit en login
✅ express.json({ limit }) para evitar bodies gigantes
✅ Validación con Zod en TODAS las rutas que reciben datos
✅ Error handler que no filtra stack traces ni errores de la BD
✅ Contraseñas con bcrypt/argon2, nunca devueltas en las respuestas
✅ Logs en JSON con redact de secretos (pino)
✅ "prisma migrate deploy" en el despliegue (nunca "migrate dev" en producción)
✅ Índices en las columnas por las que filtras u ordenas (@@index)
✅ Endpoint /health para el balanceador o el orquestador
✅ Cierre ordenado: server.close() + prisma.$disconnect() en SIGTERM
✅ "trust proxy" si estás detrás de un proxy (para IPs reales y rate limit)
✅ Tests de integración en CI (Vitest + Supertest)`,
    },
  ],
} satisfies Topic;
