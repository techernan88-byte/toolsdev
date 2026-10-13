import type { Topic } from '../../types';

export default {
  id: 'ventanas',
  icon: '🪟',
  title: 'Funciones de ventana',
  description:
    'Las funciones de ventana (OVER) calculan sobre un grupo de filas SIN agruparlas: cada fila conserva su detalle y además ve el ranking, el acumulado o la fila anterior. Son la herramienta estrella para informes.',
  tip: 'PARTITION BY es como un GROUP BY que no colapsa filas; ORDER BY dentro de OVER define el orden para rankings y acumulados.',

  snippets: [
    {
      title: 'Ranking: los productos más caros de cada categoría',
      code: `SELECT
  c.name                                                         AS categoria,
  p.name                                                         AS producto,
  p.price,
  row_number() OVER (PARTITION BY c.name ORDER BY p.price DESC)  AS puesto,
  rank()       OVER (ORDER BY p.price DESC)                      AS ranking_global
FROM products p
JOIN categories c ON c.id = p.category_id
ORDER BY c.name, puesto;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Top N por grupo (patrón muy usado)',
      code: `-- El producto más caro de cada categoría
WITH ranked AS (
  SELECT
    p.*,
    row_number() OVER (PARTITION BY category_id ORDER BY price DESC) AS rn
  FROM products p
)
SELECT c.name AS categoria, r.name AS producto, r.price
FROM ranked r
JOIN categories c ON c.id = r.category_id
WHERE r.rn = 1;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Total acumulado y porcentaje del total',
      code: `WITH ventas_mes AS (
  SELECT
    date_trunc('month', o.created_at)::date AS mes,
    sum(oi.quantity * oi.unit_price)        AS ventas
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY 1
)
SELECT
  to_char(mes, 'YYYY-MM')                                    AS mes,
  ventas,
  sum(ventas) OVER (ORDER BY mes)                            AS acumulado,
  round(100 * ventas / sum(ventas) OVER (), 1)               AS pct_del_total
FROM ventas_mes
ORDER BY mes;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'LAG y LEAD: comparar con la fila anterior',
      code: `-- Días entre un pedido y el anterior del mismo cliente
SELECT
  c.name                                                        AS cliente,
  o.created_at                                                  AS fecha,
  lag(o.created_at) OVER (PARTITION BY o.customer_id ORDER BY o.created_at) AS pedido_anterior,
  o.created_at - lag(o.created_at) OVER (PARTITION BY o.customer_id ORDER BY o.created_at) AS dias_desde_anterior
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY c.name, o.created_at;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
