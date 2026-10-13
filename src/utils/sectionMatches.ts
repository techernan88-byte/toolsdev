import type { SearchableSection } from '../types';

/**
 * ¿La sección contiene el texto buscado?
 * Busca en título, descripción, clases de los controles, snippets
 * y código de los ejemplos (HTML de Tailwind o archivos de React/Node).
 */
export function sectionMatches(section: SearchableSection, query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return true;

  const searchableText = [
    section.title,
    section.description,
    ...(section.controls ?? []).flatMap((control) => [control.label, ...control.options]),
    ...(section.snippets ?? []).flatMap((snippet) => [
      snippet.title,
      snippet.code,
      ...(snippet.files ?? []).map((file) => file.code),
    ]),
    ...(section.examples ?? []).flatMap((example) => [
      example.title,
      example.html,
      ...(example.files ?? []).map((file) => file.code),
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchableText.includes(search);
}
