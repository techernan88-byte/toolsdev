import type { Topic } from '../../types';

export default {
  id: 'funciones',
  icon: '🧰',
  title: 'Funciones de texto, fechas y nulos',
  description:
    'PostgreSQL trae cientos de funciones. Las del día a día: manipular texto, trabajar con fechas e intervalos, sustituir nulos (COALESCE) y generar series de datos.',
  tip: 'Guarda las fechas con hora como TIMESTAMPTZ (con zona horaria): PostgreSQL las convierte a UTC y evita errores con horarios de verano y usuarios de otros países.',

  snippets: [
    {
      title: 'Texto',
      code: `SELECT
  name,
  upper(name)                          AS mayusculas,
  length(name)                         AS letras,
  split_part(name, ' ', 1)             AS primera_palabra,
  left(name, 3) || '…'                 AS abreviado,      -- || concatena
  replace(name, ' ', '-')              AS slug_simple,
  lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) AS slug
FROM products
LIMIT 5;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Fechas e intervalos',
      code: `SELECT
  now()                                       AS ahora,
  current_date                                AS hoy,
  current_date + INTERVAL '7 days'            AS en_una_semana,
  date_trunc('month', current_date)::date     AS inicio_de_mes,
  extract(year FROM current_date)             AS anio,
  to_char(current_date, 'DD/MM/YYYY')         AS formato_es,
  age(DATE '2026-12-25', current_date)        AS falta_para_navidad;

-- Antigüedad de cada cliente
SELECT name, created_at, current_date - created_at AS dias_como_cliente
FROM customers
ORDER BY created_at;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'COALESCE y NULLIF: trabajar con nulos',
      code: `-- COALESCE: devuelve el primer valor que no sea NULL
SELECT name, coalesce(city, 'Sin ciudad') AS ciudad
FROM customers;

-- NULLIF(a, b): devuelve NULL si a = b
-- Uso típico: evitar "división entre cero" cuando el stock es 0
SELECT
  name,
  stock,
  nullif(stock, 0)                          AS stock_o_null,
  round(price * 100 / nullif(stock, 0), 2)  AS indice_precio_stock
FROM products
ORDER BY stock;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'generate_series: rellenar huecos (meses sin ventas)',
      code: `-- Todos los meses del año, aunque no haya pedidos
SELECT
  to_char(mes, 'YYYY-MM')        AS mes,
  count(o.id)                    AS pedidos
FROM generate_series(DATE '2026-01-01', DATE '2026-12-01', INTERVAL '1 month') AS mes
LEFT JOIN orders o ON date_trunc('month', o.created_at) = mes
GROUP BY mes
ORDER BY mes;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
