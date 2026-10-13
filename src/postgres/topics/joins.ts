import type { Topic } from '../../types';

export default {
  id: 'joins',
  icon: '🔗',
  title: 'JOINs: unir tablas',
  description:
    'Los datos se reparten en varias tablas para no repetirlos. JOIN las vuelve a unir usando las claves: INNER JOIN solo las filas que coinciden; LEFT JOIN todas las de la izquierda aunque no tengan pareja.',
  tip: 'Usa alias cortos (p para products, c para customers…) y escribe la condición de unión con ON tabla_a.id = tabla_b.tabla_a_id.',

  snippets: [
    {
      title: 'Diagrama de la base de datos de la tienda',
      lang: 'text',
      code: `customers   (id, name, email, city, created_at)
    │ 1
    │        un cliente tiene muchos pedidos
    ▼ N
orders      (id, customer_id → customers.id, status, created_at)
    │ 1
    │        un pedido tiene muchas líneas
    ▼ N
order_items (order_id → orders.id, product_id → products.id, quantity, unit_price)
    ▲ N
    │        un producto aparece en muchas líneas
    │ 1
products    (id, name, category_id → categories.id, price, stock, attributes, tags)
    ▲ N
    │        una categoría tiene muchos productos
    │ 1
categories  (id, name)`,
    },
    {
      title: 'INNER JOIN: productos con su categoría',
      code: `SELECT p.name AS producto, c.name AS categoria, p.price
FROM products p
INNER JOIN categories c ON c.id = p.category_id
ORDER BY c.name, p.price;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'LEFT JOIN: clientes y sus pedidos (aunque no tengan)',
      code: `-- Los clientes sin pedidos aparecen con NULL
SELECT cu.name, o.id AS pedido, o.status
FROM customers cu
LEFT JOIN orders o ON o.customer_id = cu.id
ORDER BY cu.name, o.id;

-- Patrón "anti-join": clientes que NUNCA han comprado
SELECT cu.name, cu.email
FROM customers cu
LEFT JOIN orders o ON o.customer_id = cu.id
WHERE o.id IS NULL;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Varios JOINs: el detalle completo de los pedidos',
      code: `SELECT
  o.id                          AS pedido,
  o.created_at                  AS fecha,
  cu.name                       AS cliente,
  p.name                        AS producto,
  oi.quantity                   AS cantidad,
  oi.unit_price * oi.quantity   AS subtotal
FROM orders o
JOIN customers   cu ON cu.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products    p  ON p.id = oi.product_id
WHERE o.status <> 'cancelled'
ORDER BY o.id, p.name;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Tipos de JOIN',
      lang: 'text',
      code: `INNER JOIN   →  solo filas con coincidencia en las DOS tablas
LEFT JOIN    →  todas las de la izquierda (+ coincidencias, o NULL)
RIGHT JOIN   →  todas las de la derecha (poco usado: se reescribe como LEFT)
FULL JOIN    →  todas las de ambas tablas
CROSS JOIN   →  todas las combinaciones posibles (producto cartesiano)
JOIN ... USING (columna)  →  atajo cuando la columna se llama igual en las dos tablas`,
    },
  ],
} satisfies Topic;
