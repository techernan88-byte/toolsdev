import type { Topic } from '../../types';

export default {
  id: 'auth',
  icon: '🔐',
  title: 'Autenticación con JWT',
  description:
    'Registro y login con contraseñas hasheadas (bcrypt) y tokens JWT. El cliente envía el token en la cabecera Authorization y un middleware lo verifica en las rutas protegidas.',
  tip: 'Nunca guardes contraseñas en texto plano ni las devuelvas en una respuesta. Y responde "credenciales incorrectas" tanto si falla el email como la contraseña (no reveles qué usuarios existen).',

  snippets: [
    {
      title: 'Módulo de autenticación completo',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken`,
        },
        {
          name: 'auth.schema.ts',
          lang: 'ts',
          code: `import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().toLowerCase(),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;`,
        },
        {
          name: 'auth.service.ts',
          lang: 'ts',
          code: `import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { ConflictError, UnauthorizedError } from '../../lib/errors.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const SALT_ROUNDS = 12;
const publicUser = { id: true, name: true, email: true, role: true } as const;

function signToken(user: { id: string; email: string; role: 'USER' | 'ADMIN' }) {
  return jwt.sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
    subject: user.id,            // "sub" = id del usuario
    expiresIn: '1h',
  });
}

export async function register({ name, email, password }: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new ConflictError('Ese correo ya está registrado');

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, SALT_ROUNDS) },
    select: publicUser,
  });

  return { user, token: signToken(user) };
}

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Mismo mensaje en ambos casos: no revela si el email existe
  const isValid = user && (await bcrypt.compare(password, user.password));
  if (!user || !isValid) throw new UnauthorizedError('Credenciales incorrectas');

  const { password: _password, ...safeUser } = user;
  return { user: safeUser, token: signToken(user) };
}

export async function me(userId: string) {
  return prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { ...publicUser, profile: true } });
}`,
        },
        {
          name: 'auth.controller.ts',
          lang: 'ts',
          code: `import type { Request, Response } from 'express';
import * as authService from './auth.service.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

export async function register(req: Request<{}, {}, RegisterInput>, res: Response) {
  res.status(201).json(await authService.register(req.body));
}

export async function login(req: Request<{}, {}, LoginInput>, res: Response) {
  res.json(await authService.login(req.body));
}

export async function me(req: Request, res: Response) {
  res.json(await authService.me(req.user!.id));   // requireAuth garantiza req.user
}`,
        },
        {
          name: 'auth.routes.ts',
          lang: 'ts',
          code: `import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { requireAuth } from '../../middlewares/auth.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import * as authController from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), authController.register);
authRouter.post('/login', validate({ body: loginSchema }), authController.login);
authRouter.get('/me', requireAuth, authController.me);`,
        },
      ],
    },
    {
      title: 'Probar la autenticación con curl',
      lang: 'bash',
      code: `# Registro
curl -X POST http://localhost:3000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ana","email":"ana@mail.com","password":"Secreta123"}'
# {"user":{"id":"...","name":"Ana","email":"ana@mail.com","role":"USER"},"token":"eyJhbGciOi..."}

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"ana@mail.com","password":"Secreta123"}'

# Ruta protegida con el token
curl http://localhost:3000/api/v1/auth/me -H "Authorization: Bearer eyJhbGciOi..."

# Sin token → 401
# {"code":"UNAUTHORIZED","message":"Falta el token"}`,
    },
    {
      title: 'Token en cookie httpOnly (más seguro para webs)',
      description:
        'El JavaScript del navegador no puede leer una cookie httpOnly, así que un ataque XSS no puede robar el token.',
      lang: 'ts',
      code: `import type { Request, Response } from 'express';
import { env } from '../../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,                              // inaccesible desde JS
  secure: env.NODE_ENV === 'production',       // solo HTTPS en producción
  sameSite: 'lax' as const,                    // protege de CSRF en la mayoría de casos
  maxAge: 60 * 60 * 1000,                      // 1 hora
};

export async function login(req: Request, res: Response) {
  const { user, token } = await authService.login(req.body);
  res.cookie('access_token', token, COOKIE_OPTIONS).json({ user });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('access_token', COOKIE_OPTIONS).status(204).end();
}

// En requireAuth, leer el token de la cookie (necesita cookie-parser):
// const token = req.cookies.access_token ?? bearerToken;

// En el frontend: fetch(url, { credentials: 'include' })
// y en el backend: cors({ origin: env.CORS_ORIGIN, credentials: true })`,
    },
  ],
} satisfies Topic;
