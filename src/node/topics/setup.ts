import type { Topic } from '../../types';

export default {
  id: 'setup',
  icon: '📦',
  title: 'Proyecto con TypeScript',
  description:
    'Crear desde cero una API con Node.js, Express 5 y TypeScript usando módulos ES (import/export). En desarrollo se ejecuta con tsx (recarga al guardar) y para producción se compila con tsc a JavaScript.',
  tip: 'Con "module": "NodeNext" los imports relativos llevan extensión .js aunque el archivo sea .ts: import { app } from \'./app.js\'. Es como funcionará el código compilado.',

  snippets: [
    {
      title: '1. Crear el proyecto e instalar dependencias',
      lang: 'bash',
      code: `mkdir mi-api && cd mi-api
npm init -y

# Dependencias de la app
npm install express zod dotenv cors helmet

# Dependencias de desarrollo (tipos, compilador y ejecutor)
npm install -D typescript tsx @types/node @types/express @types/cors

# Crear tsconfig.json base
npx tsc --init`,
    },
    {
      title: '2. Configuración: package.json, tsconfig.json y .env',
      files: [
        {
          name: 'package.json',
          lang: 'json',
          code: `{
  "name": "mi-api",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "tsx watch --env-file=.env src/server.ts",
    "build": "tsc",
    "start": "node --env-file=.env dist/server.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  }
}`,
        },
        {
          name: 'tsconfig.json',
          lang: 'json',
          code: `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "types": ["node"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
        },
        {
          name: '.env',
          lang: 'env',
          code: `NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mi_api?schema=public"
JWT_SECRET="cambia-esto-por-un-secreto-largo-y-aleatorio"
CORS_ORIGIN=http://localhost:5173`,
        },
        {
          name: '.gitignore',
          lang: 'text',
          code: `node_modules
dist
.env
src/generated`,
        },
      ],
    },
    {
      title: '3. Estructura de carpetas recomendada',
      lang: 'text',
      code: `mi-api/
├── prisma/
│   ├── schema.prisma          # modelos de la base de datos
│   ├── migrations/            # historial de cambios (generado)
│   └── seed.ts                # datos de prueba
├── prisma.config.ts
├── src/
│   ├── server.ts              # arranca el servidor (listen)
│   ├── app.ts                 # crea y configura Express (sin listen → fácil de testear)
│   ├── config/
│   │   └── env.ts             # variables de entorno validadas con Zod
│   ├── lib/
│   │   ├── prisma.ts          # cliente de Prisma (una sola instancia)
│   │   └── errors.ts          # clases de error (AppError, NotFoundError...)
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── validate.ts
│   │   └── error-handler.ts
│   ├── modules/               # una carpeta por recurso
│   │   ├── auth/
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.schema.ts
│   │   └── products/
│   ├── types/
│   │   └── express.d.ts       # amplía Request (req.user)
│   └── generated/prisma/      # cliente generado por Prisma (no se edita)
├── tests/
├── .env
├── package.json
└── tsconfig.json`,
    },
    {
      title: '4. Primer servidor (app.ts + server.ts)',
      files: [
        {
          name: 'src/app.ts',
          lang: 'ts',
          code: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const app = express();

app.use(helmet());                                  // cabeceras de seguridad
app.use(cors({ origin: process.env.CORS_ORIGIN })); // permite peticiones del frontend
app.use(express.json());                            // parsea JSON del body → req.body

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});`,
        },
        {
          name: 'src/server.ts',
          lang: 'ts',
          code: `import { app } from './app.js';   // ⚠️ extensión .js con NodeNext

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(\`🚀 API escuchando en http://localhost:\${PORT}\`);
});`,
        },
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm run dev
# 🚀 API escuchando en http://localhost:3000

curl http://localhost:3000/health
# {"status":"ok","uptime":3.21}`,
        },
      ],
    },
  ],
} satisfies Topic;
