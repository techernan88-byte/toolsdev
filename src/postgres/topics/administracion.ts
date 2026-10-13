import type { Topic } from '../../types';

export default {
  id: 'administracion',
  icon: '🛡️',
  title: 'Seguridad, backups y buenas prácticas',
  description:
    'Lo que necesitas para llevar PostgreSQL a producción: usuarios con los permisos justos, seguridad a nivel de fila (RLS), copias de seguridad, conexiones desde las aplicaciones y consultas para vigilar el rendimiento.',
  tip: 'Tu aplicación nunca debería conectarse con el superusuario "postgres". Crea un usuario propio con solo los permisos que necesita.',

  snippets: [
    {
      title: 'Usuarios y permisos (roles)',
      lang: 'sql',
      code: `-- Usuario de la aplicación: puede leer y escribir datos, pero no cambiar la estructura
CREATE ROLE app_user WITH LOGIN PASSWORD 'una-contraseña-larga';
GRANT CONNECT ON DATABASE tienda TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Que también aplique a las tablas que se creen en el futuro
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

-- Usuario de solo lectura (para informes / BI)
CREATE ROLE analyst WITH LOGIN PASSWORD 'otra-contraseña';
GRANT pg_read_all_data TO analyst;

-- Quitar permisos
REVOKE DELETE ON orders FROM app_user;`,
    },
    {
      title: 'Row Level Security: cada cliente solo ve sus pedidos',
      lang: 'sql',
      code: `ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- La app indica qué cliente está conectado en cada transacción
CREATE POLICY customer_sees_own_orders ON orders
  FOR SELECT
  USING (customer_id = current_setting('app.customer_id')::INT);

-- En cada petición, desde el backend:
BEGIN;
SET LOCAL app.customer_id = '3';
SELECT * FROM orders;      -- solo devuelve los pedidos del cliente 3
COMMIT;`,
    },
    {
      title: 'Copias de seguridad y restauración',
      lang: 'bash',
      code: `# Backup completo en formato comprimido (-Fc)
pg_dump -h localhost -U postgres -d tienda -Fc -f tienda_2026-10-12.dump

# Solo la estructura (sin datos) / solo los datos
pg_dump -U postgres -d tienda --schema-only -f schema.sql
pg_dump -U postgres -d tienda --data-only   -f data.sql

# Restaurar en otra base de datos
createdb -U postgres tienda_restaurada
pg_restore -U postgres -d tienda_restaurada tienda_2026-10-12.dump

# Con Docker
docker exec pg pg_dump -U postgres -d tienda -Fc > tienda.dump

# Exportar una consulta a CSV desde psql
psql -U postgres -d tienda -c "\\copy (SELECT * FROM customers) TO 'clientes.csv' CSV HEADER"`,
    },
    {
      title: 'Cadenas de conexión desde las aplicaciones',
      lang: 'text',
      code: `postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/BASE_DE_DATOS?opciones

Local          postgresql://postgres:postgres@localhost:5432/tienda
Con SSL        postgresql://app_user:***@db.miempresa.com:5432/tienda?sslmode=require
Prisma (Node)  DATABASE_URL="postgresql://app_user:***@localhost:5432/tienda?schema=public"
SQLAlchemy     postgresql+psycopg://app_user:***@localhost:5432/tienda
Docker Compose postgresql://postgres:postgres@db:5432/tienda   ← "db" = nombre del servicio

💡 Pool de conexiones: cada conexión consume memoria en el servidor.
   Las apps usan un pool (10–20 conexiones) y, con muchas instancias, PgBouncer delante.`,
    },
    {
      title: 'Consultas para vigilar la base de datos',
      lang: 'sql',
      code: `-- Tamaño de cada tabla (con índices)
SELECT relname AS tabla, pg_size_pretty(pg_total_relation_size(relid)) AS tamano
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Consultas activas ahora mismo (y cuánto llevan)
SELECT pid, state, now() - query_start AS duracion, left(query, 80) AS consulta
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY duracion DESC;

-- Cancelar una consulta que se ha quedado colgada
SELECT pg_cancel_backend(12345);

-- Índices que nunca se usan (candidatos a borrar)
SELECT relname AS tabla, indexrelname AS indice, idx_scan AS usos
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Las consultas más lentas (requiere la extensión pg_stat_statements)
SELECT left(query, 80), calls, round(mean_exec_time) AS ms_medio
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;`,
    },
  ],
} satisfies Topic;
