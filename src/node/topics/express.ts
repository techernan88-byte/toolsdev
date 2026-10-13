import type { Topic } from '../../types';

export default {
  id: 'express',
  icon: '🚂',
  title: 'Express básico',
  description:
    'Express recibe peticiones HTTP y responde. Cada ruta es método + ruta + función (req, res). req trae lo que envía el cliente (params, query, body, headers) y res sirve para responder (status, json, send).',
  tip: 'Express 5 captura automáticamente los errores de las funciones async: si un handler lanza o una promesa falla, el error llega al middleware de errores sin try/catch.',

  snippets: [
    {
      title: 'Métodos HTTP y lectura de datos',
      code: `import express from 'express';

const app = express();
app.use(express.json());

// GET con parámetro de ruta → /users/42
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  res.json({ id, name: 'Ana' });
});

// GET con query string → /search?q=teclado&page=2
app.get('/search', (req, res) => {
  const q = String(req.query.q ?? '');
  const page = Number(req.query.page ?? 1);
  res.json({ q, page });
});

// POST con body JSON
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 1, name, email });       // 201 Created
});

// PUT reemplaza / PATCH modifica parcialmente
app.patch('/users/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// DELETE → 204 sin contenido
app.delete('/users/:id', (_req, res) => {
  res.status(204).end();
});

// Cabeceras, cookies y otros tipos de respuesta
app.get('/demo', (req, res) => {
  const agent = req.get('user-agent');
  res.set('X-Powered-By', 'mi-api');
  res.type('text').send(\`Tu navegador: \${agent}\`);
});

app.listen(3000);`,
    },
    {
      title: 'Códigos de estado HTTP más usados',
      lang: 'text',
      code: `200 OK                 GET / PATCH correcto
201 Created            POST que crea un recurso (devuelve el recurso creado)
204 No Content         DELETE correcto (sin body)
400 Bad Request        datos inválidos (validación)
401 Unauthorized       falta el token o es inválido (no autenticado)
403 Forbidden          autenticado pero sin permisos
404 Not Found          el recurso no existe
409 Conflict           duplicado (ej. email ya registrado)
422 Unprocessable      datos con formato correcto pero reglas de negocio no cumplidas
429 Too Many Requests  límite de peticiones (rate limit)
500 Internal Error     error inesperado del servidor`,
    },
    {
      title: 'Archivos estáticos y descargas',
      code: `import express from 'express';
import path from 'node:path';

const app = express();

// Sirve todo lo que haya en /public → /logo.png, /docs/index.html
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));

// Forzar la descarga de un archivo
app.get('/reports/:name', (req, res) => {
  const file = path.join(import.meta.dirname, '..', 'reports', path.basename(req.params.name));
  res.download(file);   // basename evita rutas tipo ../../etc/passwd
});`,
    },
    {
      title: 'Tipar req y res con genéricos',
      description:
        'Request<Params, ResBody, ReqBody, Query> y Response<ResBody> dan autocompletado y detectan errores.',
      code: `import type { Request, Response } from 'express';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductParams {
  id: string;                 // los params SIEMPRE llegan como string
}

interface CreateProductBody {
  name: string;
  price: number;
}

interface ListQuery {
  page?: string;
  search?: string;
}

const products: Product[] = [];

// Request<Params, ResBody, ReqBody, Query>
export function getProduct(req: Request<ProductParams>, res: Response<Product | { message: string }>) {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado' });
    return;
  }
  res.json(product);
}

export function createProduct(req: Request<{}, Product, CreateProductBody>, res: Response<Product>) {
  const product: Product = { id: products.length + 1, ...req.body };
  products.push(product);
  res.status(201).json(product);
}

export function listProducts(req: Request<{}, Product[], {}, ListQuery>, res: Response<Product[]>) {
  const search = req.query.search?.toLowerCase() ?? '';
  res.json(products.filter((p) => p.name.toLowerCase().includes(search)));
}

// ⚠️ Los tipos NO validan en tiempo de ejecución: el cliente puede enviar cualquier cosa.
//    Para eso se usa Zod → ver "Validación con Zod".`,
    },
  ],
} satisfies Topic;
