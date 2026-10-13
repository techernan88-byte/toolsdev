import type { Topic } from '../../types';

export default {
  id: 'agregaciones',
  icon: '📊',
  title: 'Agregaciones y GROUP BY',
  description:
    'Las funciones de agregación resumen muchas filas en un valor: COUNT, SUM, AVG, MIN, MAX. Con GROUP BY se calcula un resumen por grupo, y HAVING filtra esos grupos.',
  tip: 'WHERE filtra FILAS antes de agrupar; HAVING filtra GRUPOS después. Toda columna del SELECT que no esté agregada debe aparecer en el GROUP BY.',

  snippets: [
    {
      title: 'Resumen de todo el catálogo',
      code: `SELECT
  count(*)              AS productos,
  count(*) FILTER (WHERE stock = 0) AS agotados,
  sum(stock)            AS unidades,
  round(avg(price), 2)  AS precio_medio,
  min(price)            AS mas_barato,
  max(price)            AS mas_caro
FROM products;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'GROUP BY: productos y stock por categoría',
      code: `SELECT
  c.name                 AS categoria,
  count(p.id)            AS productos,
  sum(p.stock)           AS unidades,
  round(avg(p.price), 2) AS precio_medio
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.name
ORDER BY productos DESC;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Ventas por cliente con HAVING',
      code: `-- Clientes que han gastado más de 200 € (sin contar cancelados)
SELECT
  cu.name                                AS cliente,
  count(DISTINCT o.id)                   AS pedidos,
  sum(oi.quantity * oi.unit_price)       AS total_gastado
FROM customers cu
JOIN orders o       ON o.customer_id = cu.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'            -- filtra FILAS
GROUP BY cu.name
HAVING sum(oi.quantity * oi.unit_price) > 200   -- filtra GRUPOS
ORDER BY total_gastado DESC;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Ventas por mes y por estado',
      code: `SELECT
  to_char(o.created_at, 'YYYY-MM')                     AS mes,
  count(DISTINCT o.id)                                 AS pedidos,
  sum(oi.quantity * oi.unit_price)                     AS facturado,
  count(DISTINCT o.id) FILTER (WHERE o.status = 'paid') AS pagados
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY mes
ORDER BY mes;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Listas y textos agregados',
      code: `-- Productos de cada categoría en una sola celda
SELECT
  c.name                                         AS categoria,
  string_agg(p.name, ', ' ORDER BY p.name)       AS productos,
  array_agg(p.price ORDER BY p.price)            AS precios
FROM categories c
JOIN products p ON p.category_id = c.id
GROUP BY c.name;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
