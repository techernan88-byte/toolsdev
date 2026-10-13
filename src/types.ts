import type { ComponentType, ReactNode } from 'react';

/* ───────────── Código ───────────── */

/** Lenguajes que pueden mostrar los bloques de código. */
export type CodeLang =
  | 'tsx'
  | 'ts'
  | 'json'
  | 'bash'
  | 'prisma'
  | 'env'
  | 'yaml'
  | 'dockerfile'
  | 'text'
  | 'sql'
  | 'python'
  | 'toml'
  | 'ini';

export interface CodeFile {
  name?: string;
  code: string;
  lang?: CodeLang;
}

/* ───────────── Categoría Tailwind ───────────── */

/** Grupo de botones del playground: cada opción es una clase ('' = ninguna). */
export interface Control {
  key: string;
  label: string;
  options: string[];
  default?: string;
  hint?: string;
}

/** Clases elegidas: { [control.key]: clase } */
export type Selection = Record<string, string>;

export interface TailwindExample {
  title: string;
  description?: string;
  html: string;
}

export interface TailwindSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  tip?: string;
  /** Lo asigna byDifficulty() en el index de cada categoría */
  difficulty?: Difficulty;
  controls?: Control[];
  template?: (selection: Selection) => string;
  examples?: TailwindExample[];
  /** Clases extra para la caja de vista previa */
  previewClass?: string;
  /** Muestra los botones Móvil / Tablet / Escritorio */
  responsivePreview?: boolean;
  /** Un ejemplo por fila */
  wideExamples?: boolean;
}

/* ───────────── Temas (TypeScript, React, PostgreSQL, Node, Python, Git) ───────────── */

export type Level = 'estudiante' | 'industria';

/** Código para copiar: un solo bloque (code) o varios archivos (files). */
export interface Snippet {
  title: string;
  description?: string;
  code?: string;
  lang?: CodeLang;
  files?: CodeFile[];
  /** Solo SQL: muestra el botón ▶ Ejecutar (corre en PostgreSQL dentro del navegador) */
  runnable?: boolean;
  /** Código TS ejecutable: ▶ Ejecutar llama a esta función y muestra lo que imprime con console.log */
  run?: () => void | Promise<void>;
}

/** Componente que se ejecuta en la página + su código fuente. */
export interface LiveExample {
  title: string;
  level: Level;
  description?: string;
  Component: ComponentType;
  files: CodeFile[];
}

export interface Topic {
  id: string;
  icon: string;
  title: string;
  description: string;
  tip?: string;
  /** Lo asigna byDifficulty() en el index de cada categoría */
  difficulty?: Difficulty;
  snippets?: Snippet[];
  examples?: LiveExample[];
}

/* ───────────── Navegación ───────────── */

/** Nivel de dificultad de una sección (el menú las agrupa en este orden). */
export type Difficulty = 'basico' | 'intermedio' | 'avanzado';

/** Lo mínimo que necesitan el menú y el buscador de cualquier sección. */
export interface SearchableSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  difficulty?: Difficulty;
  controls?: { label: string; options: string[] }[];
  snippets?: { title: string; code?: string; files?: CodeFile[] }[];
  examples?: { title: string; html?: string; files?: CodeFile[] }[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  sections: SearchableSection[];
  /** Pinta la sección con ese id usando la vista propia de la categoría */
  renderSection: (sectionId: string) => ReactNode;
}
