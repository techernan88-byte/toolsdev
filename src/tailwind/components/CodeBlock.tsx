import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import { highlightCss, highlightHtml } from '../lib/highlight';
import { loadTailwindRuntime } from '../lib/loadTailwindRuntime';
import { useGeneratedCss } from '../lib/useGeneratedCss';
import CopyButton from '../../components/ui/CopyButton';
import { codeFrame, codeToolbar, tabButton, toolbarButton } from '../../components/ui/styles';

const TABS = ['HTML', 'CSS generado'] as const;
type Tab = (typeof TABS)[number];

interface CodeBlockProps {
  code: string;
  /** Si se pasa, aparece el botón "Editar" */
  onEdit?: (html: string) => void;
  /** Con onReset, muestra "Restaurar" cuando el código fue modificado */
  isEdited?: boolean;
  onReset?: () => void;
}

/** Bloque de código HTML con pestañas HTML / CSS generado, copiar y edición en vivo. */
export default function CodeBlock({ code, onEdit, isEdited, onReset }: CodeBlockProps) {
  const [tab, setTab] = useState<Tab>('HTML');
  const [isEditing, setIsEditing] = useState(false);

  const showCss = tab === 'CSS generado';
  const css = useGeneratedCss(code, showCss);
  const shownCode = showCss ? css : code;
  const tokens = showCss ? highlightCss(css) : highlightHtml(code);
  const isEditorOpen = isEditing && !showCss && onEdit;

  const startEditing = () => {
    loadTailwindRuntime();
    setTab('HTML');
    setIsEditing(true);
  };

  /** Inserta 2 espacios al pulsar Tab dentro del editor. */
  const handleTabKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab' || !onEdit) return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    onEdit(value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd));
    requestAnimationFrame(() => textarea.setSelectionRange(selectionStart + 2, selectionStart + 2));
  };

  return (
    <div className={codeFrame}>
      {/* Barra superior: pestañas + acciones */}
      <div className={codeToolbar}>
        <div className="flex gap-1">
          {TABS.map((name) => (
            <button key={name} onClick={() => setTab(name)} className={tabButton(tab === name)}>
              {name}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {isEdited && onReset && (
            <button onClick={onReset} className={toolbarButton}>
              ↺ Restaurar
            </button>
          )}
          {onEdit && !showCss && (
            <button
              onClick={isEditing ? () => setIsEditing(false) : startEditing}
              className={cx(toolbarButton, isEditing && 'bg-sky-500/20 text-sky-200 ring-sky-500/50')}
            >
              {isEditing ? '✓ Listo' : '✏️ Editar'}
            </button>
          )}
          <CopyButton text={shownCode} />
        </div>
      </div>

      {isEditorOpen ? (
        <>
          <textarea
            value={code}
            onChange={(event) => onEdit(event.target.value)}
            onKeyDown={handleTabKey}
            spellCheck={false}
            autoFocus
            className="block min-h-64 w-full resize-y bg-black p-4 font-mono text-sm leading-relaxed text-sky-200 outline-none"
          />
          <p className="border-t border-zinc-800 px-4 py-2 text-xs text-zinc-500">
            ✨ Escribe cualquier clase de Tailwind: se compila en vivo en el navegador.
          </p>
        </>
      ) : (
        <pre className="max-h-[480px] overflow-auto p-4 text-sm leading-relaxed">
          <code>
            {tokens.map((token, index) => (
              <span key={index} className={token.className}>
                {token.text}
              </span>
            ))}
          </code>
        </pre>
      )}
    </div>
  );
}
