import type { Topic } from '../../types';

export default {
  id: 'rutas',
  icon: '🛣️',
  title: 'Rutas y controladores',
  description:
    'Con express.Router() cada recurso tiene su propio archivo de rutas. Las funciones que atienden cada ruta (controladores) se separan para que el archivo de rutas sea solo un "índice" legible.',
  tip: 'Convención REST: sustantivos en plural (/products), el método HTTP indica la acción y los ids van en la URL (/products/42).',

  snippets: [
    {
      title: 'CRUD REST completo (en memoria)',
      description:
        'Tres archivos: rutas, controlador y registro en app.ts. Más adelante el controlador usará Prisma.',
      files: [
        {
          name: 'src/modules/tasks/tasks.routes.ts',
          lang: 'ts',
          code: `import { Router } from 'express';
import * as tasksController from './tasks.controller.js';

export const tasksRouter = Router();

tasksRouter.get('/', tasksController.list);          // GET    /api/tasks
tasksRouter.get('/:id', tasksController.getById);    // GET    /api/tasks/:id
tasksRouter.post('/', tasksController.create);       // POST   /api/tasks
tasksRouter.patch('/:id', tasksController.update);   // PATCH  /api/tasks/:id
tasksRouter.delete('/:id', tasksController.remove);  // DELETE /api/tasks/:id`,
        },
        {
          name: 'src/modules/tasks/tasks.controller.ts',
          lang: 'ts',
          code: `import type { Request, Response } from 'express';

interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
}

let tasks: Task[] = [];
let nextId = 1;

type IdParams = { id: string };

export function list(req: Request<{}, {}, {}, { done?: string }>, res: Response) {
  const { done } = req.query;
  const result = done === undefined ? tasks : tasks.filter((t) => t.done === (done === 'true'));
  res.json(result);
}

export function getById(req: Request<IdParams>, res: Response) {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return void res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(task);
}

export function create(req: Request<{}, {}, { title: string }>, res: Response) {
  const task: Task = { id: nextId++, title: req.body.title, done: false, createdAt: new Date() };
  tasks.push(task);
  res.status(201).location(\`/api/tasks/\${task.id}\`).json(task);
}

export function update(req: Request<IdParams, {}, Partial<Pick<Task, 'title' | 'done'>>>, res: Response) {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return void res.status(404).json({ message: 'Tarea no encontrada' });
  Object.assign(task, req.body);
  res.json(task);
}

export function remove(req: Request<IdParams>, res: Response) {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));
  if (tasks.length === before) return void res.status(404).json({ message: 'Tarea no encontrada' });
  res.status(204).end();
}`,
        },
        {
          name: 'src/app.ts',
          lang: 'ts',
          code: `import express from 'express';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { usersRouter } from './modules/users/users.routes.js';

export const app = express();
app.use(express.json());

// Un "prefijo" por recurso
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);`,
        },
      ],
    },
    {
      title: 'Versionado de la API y router principal',
      files: [
        {
          name: 'src/routes.ts',
          lang: 'ts',
          code: `import { Router } from 'express';
import { authRouter } from './modules/auth/auth.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { usersRouter } from './modules/users/users.routes.js';

// Todas las rutas de la v1 en un solo sitio
export const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/products', productsRouter);`,
        },
        {
          name: 'src/app.ts',
          lang: 'ts',
          code: `import express from 'express';
import { v1Router } from './routes.js';

export const app = express();
app.use(express.json());
app.use('/api/v1', v1Router);   // /api/v1/products, /api/v1/auth/login...`,
        },
      ],
    },
    {
      title: 'Rutas anidadas y router con parámetros del padre',
      code: `import { Router } from 'express';

// /api/projects/:projectId/tasks
// mergeParams: el router hijo puede leer :projectId del padre
const projectTasksRouter = Router({ mergeParams: true });

projectTasksRouter.get('/', (req, res) => {
  const { projectId } = req.params as { projectId: string };
  res.json({ projectId, tasks: [] });
});

export const projectsRouter = Router();
projectsRouter.get('/', (_req, res) => res.json([]));
projectsRouter.use('/:projectId/tasks', projectTasksRouter);

// Agrupar varias rutas con el mismo path
projectsRouter
  .route('/:id')
  .get((req, res) => res.json({ id: req.params.id }))
  .patch((req, res) => res.json({ id: req.params.id, ...req.body }))
  .delete((_req, res) => res.status(204).end());`,
    },
  ],
} satisfies Topic;
