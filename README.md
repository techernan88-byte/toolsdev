# ⚡ Dev Playground

Página interactiva para aprender, con siete categorías en la cabecera:

- 🎨 **Tailwind CSS** — eliges clases con botones, ves el resultado en vivo, editas el código y ves el CSS generado.
- 🔷 **TypeScript** — 12 temas: cómo se declaran los tipos (de lo básico a genéricos y tipos
  avanzados), algoritmos (búsqueda, ordenación, técnicas) y estructuras de datos (pila, cola, lista
  enlazada, árbol, heap, LRU, grafo). Cada ejemplo tiene **▶ Ejecutar** y muestra su salida por consola.
- ⚛️ **React + TypeScript** — 17 temas (de JSX a React 19 y TanStack) con snippets completos y
  ejemplos que se ejecutan en la página, marcados como 🎓 Estudiante o 🏢 Industria.
- 🐘 **PostgreSQL** — 14 temas de SQL. Los snippets tienen botón **▶ Ejecutar**: corren en un
  PostgreSQL REAL dentro del navegador (PGlite) con una base de datos de tienda de ejemplo.
- 🟢 **Node + Express + TypeScript + Prisma** — 13 temas con mini-proyectos en varios archivos:
  desde el setup hasta autenticación, arquitectura por capas, producción y tests.
- 🐍 **Python + FastAPI** — 14 temas: Python esencial, FastAPI, Pydantic, SQLAlchemy + PostgreSQL,
  Alembic, JWT, arquitectura por capas, async, pytest y Docker.
- 🌿 **Git** — 12 temas: desde add/commit hasta rebase, conflictos y Conventional Commits, con un
  **simulador interactivo de GitFlow** (feature, release y hotfix con su grafo y sus comandos),
  además de GitHub Flow, trunk-based, Pull Requests, CI, tags y SemVer.

## Tecnologías

| Herramienta                                                  | Uso                                                                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **React 19** + **TypeScript** (estricto)                     | Toda la aplicación                                                                                    |
| **Vite 6**                                                   | Servidor de desarrollo y build                                                                        |
| **Tailwind CSS 4** (`@tailwindcss/vite`)                     | Estilos                                                                                               |
| **prism-react-renderer**                                     | Resaltado de sintaxis (TSX, TS, JSON, YAML…)                                                          |
| **@tailwindcss/browser**                                     | Compilador de Tailwind para el editor en vivo (se carga bajo demanda)                                 |
| **@tanstack/react-query · react-table (v8) · react-virtual** | Ejemplos en vivo de TanStack                                                                          |
| **@electric-sql/pglite**                                     | PostgreSQL compilado a WebAssembly: ejecuta el SQL en el navegador (se descarga al pulsar ▶ Ejecutar) |

## Cómo ejecutarlo

```bash
npm install
npm run dev           # http://localhost:5173
npm run typecheck     # comprobar tipos
npm run format        # formatear todo el código con Prettier (y ordenar las clases de Tailwind)
npm run build         # typecheck + build de producción
```

## Estructura

Cada categoría tiene su propia carpeta con su contenido (`topics/`) y, si los necesita, sus
componentes. En `components/` solo están las piezas compartidas por todas.

```
src/
├── main.tsx
├── App.tsx                  # cabecera con categorías + menú + sección activa
├── categories.tsx           # ⭐ registro de categorías (Tailwind, TypeScript, React, PostgreSQL, Node, Python, Git)
├── types.ts                 # ⭐ tipos compartidos: TailwindSection, Topic, Snippet, LiveExample…
├── components/              # piezas COMPARTIDAS
│   ├── layout/              # Sidebar (menú + buscador Ctrl+K), SectionHeader, SectionPager
│   ├── ui/                  # CopyButton, DemoCanvas y styles.ts (clases que se repiten)
│   └── topic/               # vista de un tema (todas las categorías menos Tailwind)
│       ├── TopicView.tsx    # cabecera + índice + snippets + ejemplos en vivo
│       ├── TopicIndex.tsx   # "En esta página"
│       ├── SnippetBlock.tsx # elige cómo mostrar cada snippet (código, TS ejecutable o SQL ejecutable)
│       ├── CodeViewer.tsx   # código con pestañas por archivo y números de línea
│       ├── RunnableCode.tsx # código TS + ▶ Ejecutar + consola
│       └── LiveExampleCard.tsx, LevelBadge.tsx, DemoErrorBoundary.tsx
├── hooks/                   # useHashRoute (URL), useCopyToClipboard
├── utils/                   # cx, byDifficulty, sectionMatches (buscador), inspect (salida de consola)
├── tailwind/
│   ├── topics/              # ⭐ contenido de Tailwind (un archivo por tema)
│   ├── components/          # SectionView, Playground, CodeBlock, HtmlPreview, ExampleCard…
│   └── lib/                 # resaltado HTML/CSS, CSS generado, compilador de Tailwind en vivo
├── typescript/
│   ├── topics/              # ⭐ contenido de TypeScript
│   ├── examples/            # archivos .ts REALES: se comprueban con tsc y se ejecutan con ▶
│   └── source.ts            # example(ruta, título) → snippet ejecutable
├── react/
│   ├── topics/              # ⭐ contenido de React (textos + snippets)
│   ├── examples/            # componentes REALES que se ejecutan en la página (.tsx)
│   └── source.ts            # lee el código de examples/ como texto (?raw)
├── postgres/
│   ├── topics/              # ⭐ contenido de PostgreSQL (snippets ejecutables)
│   ├── db/seed.ts           # base de datos de la tienda (tablas + datos)
│   ├── db/database.ts       # crea/ejecuta PGlite (una BD nueva por ejecución)
│   └── components/          # RunnableSql, SqlConsole, SqlResults
├── node/topics/             # ⭐ contenido de Node (snippets)
├── python/topics/           # ⭐ contenido de Python + FastAPI (snippets)
└── git/
    ├── topics/              # ⭐ contenido de Git
    └── components/          # simulador de GitFlow (gitflow.ts = lógica, GitFlowSimulator.tsx = vista)
```

## Orden de los temas: de lo más fácil a lo más complejo

Cada categoría se agrupa en 🟢 Básico → 🟡 Intermedio → 🔴 Avanzado. El nivel se decide en el
`index.ts` de cada categoría con `byDifficulty()`:

```ts
const topics = byDifficulty<Topic>({
  basico: [fundamentos, props, estado, listas, formularios],
  intermedio: [typescript, efectos, referencias, contexto, reducer, customHooks],
  avanzado: [tanstackQuery, tanstackTable, rendimiento, patrones, react19, tanstackEcosistema],
});
```

Para mover un tema de nivel o de posición, solo cambia este objeto. Dentro de cada tema, los
snippets van también de simple a complejo y los ejemplos 🎓 Estudiante antes que los 🏢 Industria.

## Añadir contenido

### Un tema nuevo (TypeScript, React, PostgreSQL, Node, Python o Git)

Crea un archivo en la carpeta `topics/` de la categoría e impórtalo en su `index.ts`, dentro del nivel
que le corresponda. Si el tema tiene 3 o más snippets, el índice "En esta página" aparece solo.

```ts
import type { Topic } from '../../types';

export default {
  id: 'mi-tema',
  icon: '🧪',
  title: 'Mi tema',
  description: 'Qué se aprende aquí.',
  tip: 'Consejo opcional.',
  snippets: [
    // Un solo bloque…
    { title: 'Snippet simple', code: `const x = 1;`, lang: 'ts' },
    // …o varios archivos en pestañas
    {
      title: 'Snippet con varios archivos',
      files: [
        { name: 'app.ts', lang: 'ts', code: `...` },
        { name: 'terminal', lang: 'bash', code: `npm install express` },
      ],
    },
  ],
  examples: [], // ejemplos en vivo (solo React)
} satisfies Topic;
```

Lenguajes disponibles (`lang`): `tsx` (por defecto), `ts`, `json`, `yaml`, `prisma`, `sql`, `python`,
`toml`, `ini`, `bash`, `env`, `dockerfile`, `text`.

### Un ejemplo de TypeScript ejecutable

1. Crea `src/typescript/examples/<carpeta>/miEjemplo.ts` con una función `export default function demo()`
   que imprima con `console.log` (es lo que ejecuta el botón ▶).
2. Añádelo al tema: `example('carpeta/miEjemplo.ts', 'Título', 'Descripción opcional')`.

Para mostrar un error de tipos, ponlo dentro de una función que no se llame y precédelo de
`// @ts-expect-error`: el build comprueba que ese error existe de verdad. Exporta lo que declares
(el proyecto usa `noUnusedLocals`).

### Un snippet de SQL ejecutable

Añade `runnable: true` a un snippet con `lang: 'sql'`. Se ejecuta en un PostgreSQL nuevo con los datos
de `src/postgres/db/seed.ts` (cada ejecución empieza limpia, así que puede hacer INSERT, DELETE o DROP):

```ts
{ title: 'Clientes de Madrid', code: `SELECT * FROM customers WHERE city = 'Madrid';`, lang: 'sql', runnable: true }
```

> En los snippets, escapa `` ` `` y `${` como `` \` `` y `\${` (van dentro de un template string).

### Un ejemplo en vivo de React

1. Crea el componente en `src/react/examples/<tema>/MiEjemplo.tsx` (con `export default`).
2. Añádelo a `examples` del tema:

```ts
import { file } from '../source';
import MiEjemplo from '../examples/estado/MiEjemplo';

examples: [
  {
    title: 'Mi ejemplo',
    level: 'estudiante', // o 'industria'
    description: 'Qué enseña.',
    Component: MiEjemplo,
    files: [file('estado/MiEjemplo.tsx')], // código mostrado = archivo real
  },
],
```

### Una sección de Tailwind

Crea un archivo en `src/tailwind/topics/` (tipo `TailwindSection`) e impórtalo en su `index.ts`.
`template(selección)` recibe las clases elegidas en los controles y devuelve el HTML.

| Campo                     | Para qué                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `controls`                | Grupos de botones; cada opción es una clase (`''` = ninguna)                       |
| `template`                | `(s) => string` con el HTML a mostrar                                              |
| `previewClass`            | Clases extra para la caja de vista previa                                          |
| `responsivePreview: true` | Botones 📱 Móvil / 💻 Tablet / 🖥️ Escritorio (usa `@xl:` ≈ `md:`, `@3xl:` ≈ `lg:`) |
| `wideExamples: true`      | Un ejemplo por fila                                                                |

> ⚠️ Escribe siempre las clases **completas** (`'bg-red-500'`), nunca armadas por partes
> (`'bg-' + color`): Tailwind busca los nombres de clase en el código para generar el CSS.
