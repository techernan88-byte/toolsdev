import type { Topic } from '../../types';
import SqlConsole from '../components/SqlConsole';
import { SEED_SQL } from '../db/seed';

export default {
  id: 'introduccion',
  icon: '🐘',
  title: 'Introducción y consola',
  description:
    'PostgreSQL es una base de datos relacional: guarda los datos en tablas (filas y columnas) relacionadas entre sí, y se consulta con SQL. Aquí tienes un PostgreSQL REAL funcionando dentro de tu navegador con una tienda de ejemplo: clientes, productos, categorías y pedidos.',
  tip: 'Los snippets con ▶ Ejecutar se ejecutan de verdad. Cada ejecución empieza con los datos originales, así que puedes borrar o modificar sin miedo. Pulsa ✏️ Editar para cambiar la consulta.',

  snippets: [
    {
      title: 'Tu primera consulta',
      description: 'SELECT lee datos. El asterisco (*) significa "todas las columnas".',
      code: `SELECT * FROM products;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Elegir columnas y limitar resultados',
      code: `SELECT name, price, stock
FROM products
ORDER BY price DESC
LIMIT 5;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Tipos de datos más usados',
      description: 'El operador :: convierte un valor a un tipo concreto.',
      code: `SELECT
  42::INT                         AS entero,          -- INT, BIGINT, SMALLINT
  19.99::NUMERIC(10, 2)           AS dinero,          -- NUMERIC para importes exactos
  'Hola'::TEXT                    AS texto,           -- TEXT o VARCHAR(n)
  true::BOOLEAN                   AS booleano,
  '2026-10-12'::DATE              AS fecha,
  '2026-10-12 18:30'::TIMESTAMPTZ AS fecha_hora,      -- con zona horaria (recomendado)
  gen_random_uuid()               AS uuid,
  '{"a": 1}'::JSONB               AS json,
  ARRAY['sql', 'pg']              AS arreglo;`,
      lang: 'sql',
      runnable: true,
    },
    {
      title: 'Instalar PostgreSQL en tu ordenador (Docker) y conectarte con psql',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `# Levantar PostgreSQL 17 con Docker
docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17

# Abrir la consola psql dentro del contenedor
docker exec -it pg psql -U postgres

# O, si tienes psql instalado, con una URL de conexión
psql "postgresql://postgres:postgres@localhost:5432/postgres"`,
        },
        {
          name: 'comandos de psql',
          lang: 'text',
          code: `\\l              listar bases de datos
\\c tienda       conectarse a la base de datos "tienda"
\\dt             listar tablas
\\d products     ver la estructura de una tabla
\\du             listar usuarios / roles
\\x              resultados en vertical (útil con muchas columnas)
\\timing         mostrar cuánto tarda cada consulta
\\i archivo.sql  ejecutar un archivo SQL
\\q              salir`,
        },
        {
          name: 'crear la base de datos',
          lang: 'sql',
          code: `CREATE DATABASE tienda;
\\c tienda
-- Aquí pegarías el script de la tienda (pestaña tienda.sql de la consola de abajo)`,
        },
      ],
    },
  ],

  examples: [
    {
      title: 'Consola SQL libre',
      level: 'estudiante',
      description:
        'Escribe cualquier SQL. Aquí los cambios se MANTIENEN entre ejecuciones (crea tablas, inserta y consulta). Abajo tienes el script que crea la base de datos de la tienda.',
      Component: SqlConsole,
      files: [{ name: 'tienda.sql', code: SEED_SQL, lang: 'sql' }],
    },
  ],
} satisfies Topic;
