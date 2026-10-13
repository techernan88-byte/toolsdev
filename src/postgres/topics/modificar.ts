import type { Topic } from '../../types';

export default {
  id: 'modificar',
  icon: '✏️',
  title: 'INSERT, UPDATE y DELETE',
  description:
    'INSERT añade filas, UPDATE las modifica y DELETE las borra. Con RETURNING PostgreSQL devuelve las filas afectadas (muy útil en una API para responder con el registro creado).',
  tip: '⚠️ Un UPDATE o DELETE sin WHERE afecta a TODA la tabla. Escribe primero el SELECT con el WHERE, compruébalo y luego cámbialo por UPDATE/DELETE.',

  snippets: [
    {
      title: 'INSERT con RETURNING',
      code: `-- Una fila: devuelve el id generado
INSERT INTO customers (name, email, city)
VALUES ('Sofía León', 'sofia@mail.com', 'Granada')
RETURNING id, name, created_at;

-- Varias filas a la vez
INSERT INTO categories (name)
VALUES ('Almacenamiento'), ('Redes')
RETURNING *;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'UPDATE',
      code: `-- Subir un 10 % los monitores
UPDATE products
SET price = price * 1.10
WHERE category_id = 2
RETURNING name, price;

-- Varias columnas a la vez
UPDATE customers
SET city = 'Madrid', email = 'javier.ramos@mail.com'
WHERE id = 8
RETURNING *;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'DELETE',
      code: `-- Borrar pedidos cancelados (sus líneas se borran solas por ON DELETE CASCADE)
DELETE FROM orders
WHERE status = 'cancelled'
RETURNING id, customer_id;

SELECT count(*) AS pedidos_restantes FROM orders;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'UPSERT: insertar o actualizar (ON CONFLICT)',
      description: 'Si ya existe un registro con la misma clave única, se actualiza en lugar de dar error.',
      code: `-- ana@mail.com ya existe → se actualiza su ciudad
INSERT INTO customers (name, email, city)
VALUES ('Ana García', 'ana@mail.com', 'Toledo')
ON CONFLICT (email)
DO UPDATE SET city = EXCLUDED.city      -- EXCLUDED = la fila que intentabas insertar
RETURNING id, name, city;

-- Ignorar los duplicados
INSERT INTO categories (name) VALUES ('Audio'), ('Cámaras')
ON CONFLICT (name) DO NOTHING
RETURNING *;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'UPDATE y DELETE usando otra tabla',
      code: `-- Rebajar un 5 % los productos que nunca se han vendido
UPDATE products p
SET price = round(p.price * 0.95, 2)
WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id)
RETURNING p.name, p.price;

-- Borrar las líneas de pedidos de un cliente concreto
DELETE FROM order_items oi
USING orders o
WHERE oi.order_id = o.id
  AND o.customer_id = 4
RETURNING oi.*;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
