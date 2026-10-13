import type { Topic } from '../../types';

export default {
  id: 'select',
  icon: '🔍',
  title: 'SELECT y filtros',
  description:
    'SELECT elige columnas, FROM la tabla, WHERE filtra filas, ORDER BY ordena y LIMIT corta. El orden en que se escriben las cláusulas siempre es el mismo.',
  tip: "Orden de escritura: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. Los textos van entre comillas simples: 'Madrid'.",

  snippets: [
    {
      title: 'Columnas, alias y cálculos',
      code: `SELECT
  name                      AS producto,
  price                     AS precio,
  stock,
  price * stock             AS valor_inventario,   -- columna calculada
  price * 1.21              AS precio_con_iva
FROM products;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'WHERE: comparaciones y operadores lógicos',
      code: `-- Productos con stock y que cuestan menos de 100
SELECT name, price, stock
FROM products
WHERE stock > 0
  AND price < 100;

-- Operadores: =  <>  <  <=  >  >=   AND  OR  NOT`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'IN, BETWEEN, LIKE / ILIKE y NULL',
      code: `-- Clientes de varias ciudades
SELECT name, city FROM customers WHERE city IN ('Madrid', 'Valencia');

-- Rango (incluye los extremos)
SELECT name, price FROM products WHERE price BETWEEN 50 AND 150;

-- Texto que contiene "monitor" (ILIKE ignora mayúsculas; % = cualquier texto)
SELECT name FROM products WHERE name ILIKE '%monitor%';

-- NULL no se compara con =, se usa IS NULL / IS NOT NULL
SELECT name, city FROM customers WHERE city IS NULL;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'ORDER BY, LIMIT y OFFSET (paginación)',
      code: `-- Página 2 del catálogo, 4 productos por página, del más caro al más barato
SELECT name, price
FROM products
ORDER BY price DESC, name ASC   -- si empatan en precio, por nombre
LIMIT 4                         -- tamaño de página
OFFSET 4;                       -- saltar la página 1`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'DISTINCT y CASE',
      code: `-- Ciudades sin repetir
SELECT DISTINCT city FROM customers WHERE city IS NOT NULL ORDER BY city;

-- CASE: un "if" dentro de la consulta
SELECT
  name,
  stock,
  CASE
    WHEN stock = 0  THEN '❌ Agotado'
    WHEN stock < 10 THEN '⚠️ Pocas unidades'
    ELSE '✅ Disponible'
  END AS disponibilidad
FROM products
ORDER BY stock;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
