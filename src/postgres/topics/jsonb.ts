import type { Topic } from '../../types';

export default {
  id: 'jsonb',
  icon: '🧬',
  title: 'JSONB y arrays',
  description:
    'PostgreSQL guarda JSON (JSONB) y arrays de forma nativa, con operadores para consultarlos e índices GIN para que sean rápidos. Perfecto para atributos que cambian según el producto, y para construir respuestas JSON de una API directamente en SQL.',
  tip: 'Usa columnas normales para lo que consultas siempre (precio, stock) y JSONB para lo variable (atributos por tipo de producto, configuraciones, metadatos).',

  snippets: [
    {
      title: 'Leer campos de un JSONB',
      code: `SELECT
  name,
  attributes,
  attributes -> 'brand'           AS marca_json,     -- -> devuelve JSON
  attributes ->> 'brand'          AS marca,          -- ->> devuelve TEXT
  (attributes ->> 'dpi')::INT     AS dpi             -- convertir a número
FROM products
WHERE attributes ? 'dpi';                            -- ? = tiene la clave`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Filtrar por JSONB',
      code: `-- Contiene (@>): productos inalámbricos
SELECT name, attributes FROM products WHERE attributes @> '{"wireless": true}';

-- Por valor de un campo
SELECT name FROM products WHERE attributes ->> 'brand' = 'Logitech';

-- Comparación numérica: monitores de más de 100 Hz
SELECT name, (attributes ->> 'hz')::INT AS hz
FROM products
WHERE (attributes ->> 'hz')::INT > 100;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Modificar un JSONB',
      code: `-- Añadir / cambiar una clave (|| fusiona objetos)
UPDATE products
SET attributes = attributes || '{"color": "negro", "warranty_years": 2}'
WHERE id = 1;

-- Cambiar un valor concreto
UPDATE products SET attributes = jsonb_set(attributes, '{dpi}', '8000') WHERE id = 2;

-- Quitar una clave
UPDATE products SET attributes = attributes - 'switch' WHERE id = 1;

SELECT id, name, attributes FROM products WHERE id IN (1, 2);`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Arrays: tags',
      code: `-- Productos con la etiqueta "gaming"
SELECT name, tags FROM products WHERE 'gaming' = ANY (tags);

-- Que tengan TODAS estas etiquetas (@>)  /  ALGUNA de ellas (&&)
SELECT name, tags FROM products WHERE tags @> ARRAY['oficina', 'streaming'];
SELECT name, tags FROM products WHERE tags && ARRAY['música', 'diseño'];

-- unnest: un array → filas (contar productos por etiqueta)
SELECT tag, count(*) AS productos
FROM products, unnest(tags) AS tag
GROUP BY tag
ORDER BY productos DESC;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Construir la respuesta JSON de una API en SQL',
      description:
        'Un pedido con su cliente y sus líneas, listo para enviar al frontend en una sola consulta.',
      code: `SELECT jsonb_build_object(
  'id',       o.id,
  'status',   o.status,
  'date',     o.created_at,
  'customer', jsonb_build_object('name', c.name, 'email', c.email),
  'items',    jsonb_agg(
                jsonb_build_object('product', p.name, 'qty', oi.quantity, 'price', oi.unit_price)
                ORDER BY p.name
              ),
  'total',    sum(oi.quantity * oi.unit_price)
) AS pedido
FROM orders o
JOIN customers c    ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
WHERE o.id IN (1, 8)
GROUP BY o.id, c.name, c.email;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
