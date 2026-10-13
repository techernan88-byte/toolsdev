import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import type { CodeFile, CodeLang } from '../../types';
import { cx } from '../../utils/cx';
import CopyButton from '../ui/CopyButton';
import { codeFrame, codeToolbar, tabButton } from '../ui/styles';

/** Lenguaje de Prism que se usa para colorear cada CodeLang (Prism no trae bash ni prisma). */
const PRISM_LANGUAGE: Record<CodeLang, string> = {
  tsx: 'tsx',
  ts: 'typescript',
  json: 'json',
  yaml: 'yaml',
  prisma: 'graphql', // sintaxis muy parecida: bloques, tipos y @directivas
  bash: 'plain',
  env: 'plain',
  dockerfile: 'plain',
  text: 'plain',
  sql: 'sql',
  python: 'python',
  toml: 'plain',
  ini: 'plain',
};

interface CodeViewerProps {
  files: CodeFile[];
  maxHeight?: string;
}

/** Código con resaltado, números de línea, pestañas (si hay varios archivos) y botón de copiar. */
export default function CodeViewer({ files, maxHeight = 'max-h-[560px]' }: CodeViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { code, lang = 'tsx' } = files[activeIndex];

  return (
    <div className={codeFrame}>
      {/* Barra superior: una pestaña por archivo + copiar */}
      <div className={codeToolbar}>
        <div className="flex gap-1 overflow-x-auto">
          {files.map((file, index) => (
            <button
              key={file.name ?? index}
              onClick={() => setActiveIndex(index)}
              className={cx('font-mono', tabButton(index === activeIndex))}
            >
              {file.name ?? file.lang ?? 'tsx'}
            </button>
          ))}
        </div>
        <CopyButton text={code.trim()} />
      </div>

      <Highlight theme={themes.vsDark} code={code.trim()} language={PRISM_LANGUAGE[lang]}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className={cx('overflow-auto py-3 text-[13px] leading-relaxed text-zinc-200', maxHeight)}>
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })} className="px-4">
                <span className="mr-4 inline-block w-6 text-right text-zinc-600 select-none">
                  {lineIndex + 1}
                </span>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
