import type { Topic } from '../../types';

export default {
  id: 'subconsultas',
  icon: '🪆',
  title: 'Subconsultas y CTEs (WITH)',
  description:
    'Una subconsulta es un SELECT dentro de otro. Las CTEs (WITH nombre AS (...)) hacen lo mismo pero con nombre, de arriba abajo, como pasos de una receta: mucho más legibles.',
  tip: 'Cuando una consulta empiece a tener subconsultas dentro de subconsultas, pásala a CTEs: cada paso con un nombre que explique qué calcula.',

  snippets: [
    {
      title: 'Subconsulta en WHERE',
      code: `-- Productos más caros que la media
SELECT name, price
FROM products
WHERE price > (SELECT avg(price) FROM products)
ORDER BY price DESC;

-- Clientes de Madrid que han hecho algún pedido
SELECT name
FROM customers
WHERE city = 'Madrid'
  AND id IN (SELECT customer_id FROM orders);`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'EXISTS y NOT EXISTS',
      code: `-- Productos que nunca se han vendido
SELECT p.name, p.stock
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM order_items oi WHERE oi.product_id = p.id
);`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'CTE: un informe paso a paso',
      code: `WITH ventas AS (                 -- paso 1: importe de cada línea válida
  SELECT o.customer_id, oi.quantity * oi.unit_price AS importe
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status IN ('paid', 'shipped')
),
por_cliente AS (                 -- paso 2: total por cliente
  SELECT customer_id, sum(importe) AS total
  FROM ventas
  GROUP BY customer_id
),
media AS (                       -- paso 3: gasto medio
  SELECT avg(total) AS gasto_medio FROM por_cliente
)
SELECT                           -- resultado: quién gasta más que la media
  c.name,
  pc.total,
  round(m.gasto_medio, 2) AS gasto_medio
FROM por_cliente pc
JOIN customers c ON c.id = pc.customer_id
CROSS JOIN media m
WHERE pc.total > m.gasto_medio
ORDER BY pc.total DESC;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'CTE recursiva: árbol de categorías',
      description:
        'Para jerarquías (categorías con subcategorías, comentarios con respuestas, organigramas…).',
      code: `CREATE TABLE menu (
  id        INT PRIMARY KEY,
  name      TEXT NOT NULL,
  parent_id INT REFERENCES menu (id)
);

INSERT INTO menu VALUES
  (1, 'Informática', NULL),
  (2, 'Periféricos', 1),
  (3, 'Teclados', 2),
  (4, 'Ratones', 2),
  (5, 'Monitores', 1),
  (6, 'Gaming', 5);

WITH RECURSIVE arbol AS (
  SELECT id, name, parent_id, 1 AS nivel, name::TEXT AS ruta
  FROM menu
  WHERE parent_id IS NULL                      -- caso base: la raíz
  UNION ALL
  SELECT m.id, m.name, m.parent_id, a.nivel + 1, a.ruta || ' › ' || m.name
  FROM menu m
  JOIN arbol a ON m.parent_id = a.id           -- paso recursivo: los hijos
)
SELECT repeat('    ', nivel - 1) || name AS categoria, nivel, ruta
FROM arbol
ORDER BY ruta;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
