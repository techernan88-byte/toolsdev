import { useState } from 'react';
import type { Control, Selection, TailwindSection } from '../../types';
import ControlGroup from './ControlGroup';
import CodeBlock from './CodeBlock';
import HtmlPreview from './HtmlPreview';
import ViewportToggle, { DEFAULT_VIEWPORT } from './ViewportToggle';

interface PlaygroundProps {
  controls: Control[];
  template: NonNullable<TailwindSection['template']>;
  previewClass?: string;
  responsivePreview?: boolean;
}

/** Estado inicial: { [control.key]: valor por defecto } */
const getInitialSelection = (controls: Control[]): Selection =>
  Object.fromEntries(controls.map((control) => [control.key, control.default ?? control.options[0]]));

/**
 * Panel interactivo: el usuario elige clases en los controles,
 * template(selección) genera el HTML y se muestra en vivo + su código.
 * Si el usuario edita el código a mano, se muestra su versión (editedHtml).
 */
export default function Playground({ controls, template, previewClass, responsivePreview }: PlaygroundProps) {
  const [selection, setSelection] = useState(() => getInitialSelection(controls));
  const [editedHtml, setEditedHtml] = useState<string | null>(null);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);

  const html = editedHtml ?? template(selection);

  const handleChange = (key: string, value: string) => {
    setSelection((prev) => ({ ...prev, [key]: value }));
    setEditedHtml(null); // los controles vuelven a mandar sobre el código
  };

  const handleReset = () => {
    setSelection(getInitialSelection(controls));
    setEditedHtml(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* Controles */}
      <div className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        {controls.map((control) => (
          <ControlGroup
            key={control.key}
            control={control}
            value={selection[control.key]}
            onChange={(value) => handleChange(control.key, value)}
          />
        ))}
        <button
          onClick={handleReset}
          className="w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        >
          ↺ Reiniciar
        </button>
      </div>

      {/* Vista previa + código (se queda fija al hacer scroll en escritorio) */}
      <div className="min-w-0 space-y-4 lg:sticky lg:top-20 lg:self-start">
        {responsivePreview && <ViewportToggle value={viewport} onChange={setViewport} />}
        <HtmlPreview
          html={html}
          className={previewClass}
          viewport={responsivePreview ? viewport : undefined}
        />
        <CodeBlock
          code={html}
          onEdit={setEditedHtml}
          isEdited={editedHtml !== null}
          onReset={() => setEditedHtml(null)}
        />
      </div>
    </div>
  );
}
