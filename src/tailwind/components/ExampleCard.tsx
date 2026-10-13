import { useState } from 'react';
import type { TailwindExample } from '../../types';
import HtmlPreview from './HtmlPreview';
import CodeBlock from './CodeBlock';
import ViewportToggle, { DEFAULT_VIEWPORT } from './ViewportToggle';

interface ExampleCardProps {
  example: TailwindExample;
  responsive?: boolean;
}

/** Ejemplo de Tailwind: vista previa + código desplegable y editable. */
export default function ExampleCard({ example, responsive }: ExampleCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string | null>(null);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);

  const html = editedHtml ?? example.html;

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-white">{example.title}</h4>
          {example.description && <p className="text-sm text-zinc-400">{example.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {responsive && <ViewportToggle value={viewport} onChange={setViewport} />}
          <button
            onClick={() => setShowCode((prev) => !prev)}
            className="shrink-0 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
          >
            {showCode ? 'Ocultar código' : '</> Ver código'}
          </button>
        </div>
      </div>
      <HtmlPreview html={html} className="p-4" viewport={responsive ? viewport : undefined} />
      {showCode && (
        <CodeBlock
          code={html}
          onEdit={setEditedHtml}
          isEdited={editedHtml !== null}
          onReset={() => setEditedHtml(null)}
        />
      )}
    </div>
  );
}
