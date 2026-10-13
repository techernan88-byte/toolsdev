import type { Topic } from '../../types';

export default {
  id: 'transacciones',
  icon: '🔒',
  title: 'Transacciones y concurrencia',
  description:
    'Una transacción agrupa varias operaciones que deben ocurrir TODAS o NINGUNA (atomicidad). Si algo falla a mitad, ROLLBACK deshace todo. PostgreSQL además aísla cada transacción de las demás que ocurren a la vez.',
  tip: 'Ejemplo clásico: crear un pedido y descontar el stock. Si el pedido se guarda pero el stock no se descuenta (o al revés), los datos quedan inconsistentes.',

  snippets: [
    {
      title: 'BEGIN, COMMIT y ROLLBACK',
      code: `-- ROLLBACK: los cambios se descartan
BEGIN;
  UPDATE products SET stock = 0 WHERE id = 1;
  SELECT name, stock FROM products WHERE id = 1;   -- dentro: stock = 0
ROLLBACK;

SELECT name, stock FROM products WHERE id = 1;     -- fuera: stock original

-- COMMIT: los cambios se guardan
BEGIN;
  UPDATE products SET stock = stock + 10 WHERE id = 3;
COMMIT;

SELECT name, stock FROM products WHERE id = 3;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Crear un pedido de forma atómica',
      code: `BEGIN;

-- 1. Crear el pedido
INSERT INTO orders (customer_id, status) VALUES (7, 'paid');

-- 2. Añadir las líneas (currval = id que se acaba de generar en orders)
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT currval(pg_get_serial_sequence('orders', 'id')), id, 2, price
FROM products WHERE id = 7;

-- 3. Descontar stock (CHECK stock >= 0 haría fallar todo si no hay suficiente)
UPDATE products SET stock = stock - 2 WHERE id = 7;

COMMIT;

SELECT o.id, c.name, p.name AS producto, oi.quantity, p.stock AS stock_restante
FROM orders o
JOIN customers c    ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
WHERE o.customer_id = 7;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'SAVEPOINT: deshacer solo una parte',
      code: `BEGIN;
  INSERT INTO categories (name) VALUES ('Gaming');
  SAVEPOINT antes_de_borrar;
  DELETE FROM categories WHERE name = 'Gaming';
  ROLLBACK TO SAVEPOINT antes_de_borrar;   -- deshace solo el DELETE
COMMIT;

SELECT * FROM categories;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Concurrencia: SELECT … FOR UPDATE y niveles de aislamiento',
      description:
        'Con dos usuarios comprando la última unidad a la vez, sin bloqueo ambos podrían "ver" stock = 1.',
      code: `-- Sesión A                                   -- Sesión B (a la vez)
BEGIN;                                         BEGIN;
SELECT stock FROM products
WHERE id = 6 FOR UPDATE;   -- 🔒 bloquea la fila
                                               SELECT stock FROM products
                                               WHERE id = 6 FOR UPDATE;  -- ⏳ espera…
UPDATE products SET stock = stock - 1
WHERE id = 6;
COMMIT;                    -- 🔓 libera
                                               -- ahora B ve el stock ACTUALIZADO
                                               COMMIT;

-- Alternativa sin bloqueo explícito: actualización condicional atómica
UPDATE products SET stock = stock - 1
WHERE id = 6 AND stock >= 1
RETURNING stock;            -- 0 filas = no quedaba stock

-- Niveles de aislamiento
BEGIN ISOLATION LEVEL READ COMMITTED;   -- por defecto: ve los commits de otros
BEGIN ISOLATION LEVEL REPEATABLE READ;  -- "foto" fija de los datos durante la transacción
BEGIN ISOLATION LEVEL SERIALIZABLE;     -- como si fueran en fila (puede pedir reintentar)`,
      lang: 'sql',
    },
  ],
} satisfies Topic;
