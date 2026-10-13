import type { Topic } from '../../types';

export default {
  id: 'tablas',
  icon: '🧱',
  title: 'Crear y modificar tablas',
  description:
    'CREATE TABLE define las columnas, sus tipos y las reglas (constraints) que protegen los datos: clave primaria, claves foráneas, únicos, no nulos, valores por defecto y CHECK. ALTER TABLE cambia una tabla existente.',
  tip: 'Las reglas en la base de datos son la última línea de defensa: aunque el backend tenga un bug, PostgreSQL no dejará guardar un precio negativo o un email repetido.',

  snippets: [
    {
      title: 'CREATE TABLE con todas las restricciones',
      code: `CREATE TABLE reviews (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- autoincremental
  product_id  INT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  customer_id INT NOT NULL REFERENCES customers (id),
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)          -- una reseña por cliente y producto
);

INSERT INTO reviews (product_id, customer_id, rating, comment) VALUES
  (1, 1, 5, '¡Excelente teclado!'),
  (1, 2, 4, 'Muy bueno, algo ruidoso'),
  (7, 3, 5, 'Gran cancelación de ruido');

SELECT * FROM reviews;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Las restricciones en acción',
      description:
        'Ejecútalo: PostgreSQL rechaza el dato inválido y explica por qué. Prueba a cambiar el 6 por un 3.',
      code: `CREATE TABLE reviews (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products (id),
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5)
);

INSERT INTO reviews (product_id, rating) VALUES (1, 6);   -- ❌ viola el CHECK`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'ALTER TABLE: modificar una tabla existente',
      code: `-- Añadir columnas
ALTER TABLE customers ADD COLUMN phone TEXT;
ALTER TABLE customers ADD COLUMN is_vip BOOLEAN NOT NULL DEFAULT false;

-- Renombrar y cambiar el tipo
ALTER TABLE customers RENAME COLUMN phone TO phone_number;
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(150);

-- Añadir una restricción
ALTER TABLE customers ADD CONSTRAINT email_lowercase CHECK (email = lower(email));

-- Eliminar una columna
ALTER TABLE customers DROP COLUMN phone_number;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Tipos ENUM, valores generados y tablas relacionadas N:M',
      code: `-- Tipo con valores fijos
CREATE TYPE shipping_method AS ENUM ('standard', 'express', 'pickup');

CREATE TABLE shipments (
  id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id  INT NOT NULL UNIQUE REFERENCES orders (id),
  method    shipping_method NOT NULL DEFAULT 'standard',
  weight_kg NUMERIC(6, 2) NOT NULL,
  -- columna calculada automáticamente
  cost      NUMERIC(8, 2) GENERATED ALWAYS AS (CASE WHEN weight_kg > 5 THEN 9.90 ELSE 4.90 END) STORED
);

INSERT INTO shipments (order_id, method, weight_kg) VALUES (1, 'express', 2.5), (2, 'standard', 8);
SELECT * FROM shipments;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Borrar tablas',
      code: `DROP TABLE IF EXISTS reviews;            -- borra la tabla y sus datos
TRUNCATE TABLE order_items;                -- vacía la tabla (más rápido que DELETE)
DROP TABLE orders CASCADE;                 -- borra también lo que depende de ella

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
