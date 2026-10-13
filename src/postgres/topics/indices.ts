import type { Topic } from '../../types';

export default {
  id: 'indices',
  icon: '⚡',
  title: 'Índices y EXPLAIN',
  description:
    'Un índice es como el índice de un libro: permite encontrar filas sin leer la tabla entera. EXPLAIN ANALYZE muestra cómo ejecuta PostgreSQL una consulta y cuánto tarda, para saber si usa un índice o recorre toda la tabla (Seq Scan).',
  tip: 'Crea índices en las columnas que usas en WHERE, JOIN y ORDER BY. Las claves primarias y UNIQUE ya tienen índice; las claves foráneas NO (créalo tú).',

  snippets: [
    {
      title: 'Antes y después de un índice',
      description:
        'Crea 100.000 pedidos de prueba y compara el plan y el tiempo. Fíjate en "Seq Scan" vs "Index Scan".',
      code: `CREATE TABLE big_orders AS
SELECT
  g                                       AS id,
  (random() * 1000)::INT + 1              AS customer_id,
  current_date - (random() * 365)::INT    AS created_at
FROM generate_series(1, 100000) g;

ANALYZE big_orders;   -- actualiza las estadísticas

-- ❌ Sin índice: recorre las 100.000 filas
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 42;

CREATE INDEX idx_big_orders_customer ON big_orders (customer_id);

-- ✅ Con índice: va directo a las filas de ese cliente
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 42;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Tipos de índices útiles',
      code: `-- Índice normal (B-tree): =, <, >, BETWEEN, ORDER BY
CREATE INDEX idx_orders_customer ON orders (customer_id);

-- Compuesto: para filtros por varias columnas (el orden importa)
CREATE INDEX idx_orders_customer_date ON orders (customer_id, created_at DESC);

-- Único: además impide duplicados
CREATE UNIQUE INDEX idx_customers_email_lower ON customers (lower(email));

-- Parcial: solo indexa las filas que cumplen la condición (más pequeño)
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- GIN: para JSONB, arrays y búsqueda de texto
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Leer un plan de EXPLAIN',
      lang: 'text',
      code: `Seq Scan          → lee la tabla completa (normal en tablas pequeñas, malo en grandes)
Index Scan        → usa el índice y luego lee la fila de la tabla
Index Only Scan   → todo lo necesario está en el índice (lo más rápido)
Bitmap Heap Scan  → usa el índice para muchas filas a la vez
Nested Loop       → JOIN fila a fila (bueno si una de las dos tablas es pequeña)
Hash Join         → JOIN con tabla hash (bueno para tablas grandes)
Sort              → ordenación (un índice en la columna del ORDER BY la puede evitar)

cost=0.29..8.31   → estimación (inicio..total) en unidades internas
rows=10           → filas estimadas  ·  actual time=… rows=… → lo que pasó de verdad
Si "rows" estimado y real son muy distintos → ejecuta ANALYZE en la tabla`,
    },
  ],
} satisfies Topic;
