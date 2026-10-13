import type { Snippet } from '../../types';
import CodeViewer from './CodeViewer';
import RunnableCode from './RunnableCode';
import RunnableSql from '../../postgres/components/RunnableSql';

/** Un snippet puede ser un solo bloque (code) o varios archivos (files). */
const snippetFiles = (snippet: Snippet) =>
  snippet.files ?? [{ code: snippet.code ?? '', lang: snippet.lang }];

/** Elige cómo mostrar el código según el tipo de snippet. */
function SnippetCode({ snippet }: { snippet: Snippet }) {
  if (snippet.run) return <RunnableCode files={snippetFiles(snippet)} run={snippet.run} />; // TypeScript ejecutable
  if (snippet.runnable && snippet.code) return <RunnableSql code={snippet.code} />; // SQL ejecutable (PGlite)
  return <CodeViewer files={snippetFiles(snippet)} />; // solo lectura
}

interface SnippetBlockProps {
  snippet: Snippet;
  /** id del elemento, para poder saltar a él desde el índice del tema */
  id: string;
}

/** Título + descripción + código de un snippet. */
export default function SnippetBlock({ snippet, id }: SnippetBlockProps) {
  return (
    <div id={id} className="min-w-0 scroll-mt-24 space-y-2">
      <h4 className="font-semibold text-zinc-200">{snippet.title}</h4>
      {snippet.description && <p className="text-sm text-zinc-400">{snippet.description}</p>}
      <SnippetCode snippet={snippet} />
    </div>
  );
}
