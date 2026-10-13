import type { Topic } from '../../types';

export default {
  id: 'vistas-funciones',
  icon: '🧩',
  title: 'Vistas, funciones y triggers',
  description:
    'Una vista guarda una consulta con nombre para reutilizarla como si fuera una tabla. Las funciones encapsulan lógica en la base de datos (SQL o PL/pgSQL) y los triggers ejecutan una función automáticamente al insertar, actualizar o borrar.',
  tip: 'Los triggers son potentes pero "invisibles": úsalos para reglas que deben cumplirse siempre (updated_at, auditoría) y deja la lógica de negocio en el backend.',

  snippets: [
    {
      title: 'Vista: el resumen de pedidos',
      code: `CREATE VIEW order_summary AS
SELECT
  o.id,
  o.created_at,
  o.status,
  c.name                              AS customer,
  count(oi.product_id)                AS items,
  sum(oi.quantity * oi.unit_price)    AS total
FROM orders o
JOIN customers c         ON c.id = o.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.name;

-- Se consulta como una tabla normal
SELECT * FROM order_summary WHERE status = 'paid' ORDER BY total DESC;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Vista materializada: resultados guardados (dashboards)',
      code: `-- Guarda el RESULTADO: muy rápida de leer, pero hay que refrescarla
CREATE MATERIALIZED VIEW sales_by_category AS
SELECT c.name AS category, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p   ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
GROUP BY c.name;

SELECT * FROM sales_by_category ORDER BY revenue DESC;

-- Tras nuevos pedidos (por ejemplo, cada noche con un cron):
REFRESH MATERIALIZED VIEW sales_by_category;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Funciones en SQL y en PL/pgSQL',
      code: `-- Función SQL simple
CREATE FUNCTION price_with_tax(price NUMERIC, tax NUMERIC DEFAULT 0.21)
RETURNS NUMERIC
LANGUAGE sql IMMUTABLE
AS $$ SELECT round(price * (1 + tax), 2) $$;

-- Función PL/pgSQL con variables y lógica
CREATE FUNCTION customer_level(p_customer_id INT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT coalesce(sum(oi.quantity * oi.unit_price), 0) INTO total
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.customer_id = p_customer_id AND o.status <> 'cancelled';

  IF total >= 500 THEN RETURN '🥇 Oro';
  ELSIF total >= 200 THEN RETURN '🥈 Plata';
  ELSE RETURN '🥉 Bronce';
  END IF;
END;
$$;

SELECT name, customer_level(id) AS nivel FROM customers;
SELECT name, price, price_with_tax(price) AS con_iva FROM products LIMIT 4;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Triggers: updated_at automático y auditoría',
      code: `ALTER TABLE products ADD COLUMN updated_at TIMESTAMPTZ;

-- 1. Trigger que rellena updated_at en cada UPDATE
CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2. Tabla de auditoría: historial de cambios de precio
CREATE TABLE price_history (
  product_id INT,
  old_price  NUMERIC(10, 2),
  new_price  NUMERIC(10, 2),
  changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE FUNCTION log_price_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.price <> OLD.price THEN
    INSERT INTO price_history (product_id, old_price, new_price) VALUES (OLD.id, OLD.price, NEW.price);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_price_audit
AFTER UPDATE OF price ON products
FOR EACH ROW EXECUTE FUNCTION log_price_change();

-- Probarlo
UPDATE products SET price = 79.90 WHERE id = 1;
UPDATE products SET price = 74.90 WHERE id = 1;

SELECT id, name, price, updated_at FROM products WHERE id = 1;
SELECT * FROM price_history;`,
      lang: 'sql',
      runnable: true,
    },
  ],
} satisfies Topic;
