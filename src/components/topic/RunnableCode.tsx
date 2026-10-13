import { useState } from 'react';
import type { CodeFile } from '../../types';
import CodeViewer from './CodeViewer';
import { captureConsole } from '../../utils/inspect';

interface RunnableCodeProps {
  files: CodeFile[];
  run: () => void | Promise<void>;
}

/** Código TypeScript real del proyecto + botón para ejecutarlo y ver su salida por consola. */
export default function RunnableCode({ files, run }: RunnableCodeProps) {
  const [output, setOutput] = useState<string[] | null>(null);
  const [ms, setMs] = useState(0);

  const execute = async () => {
    const start = performance.now();
    setOutput(await captureConsole(run));
    setMs(performance.now() - start);
  };

  return (
    <div className="space-y-2">
      <CodeViewer files={files} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={execute}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
        >
          ▶ Ejecutar
        </button>
        <span className="text-xs text-zinc-500">Muestra lo que imprime console.log</span>
      </div>
      {output && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-black">
          <p className="border-b border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-500">
            Consola · {ms.toFixed(1)} ms
          </p>
          <pre className="max-h-96 overflow-auto p-3 font-mono text-[13px] leading-relaxed text-emerald-300">
            {output.length > 0 ? output.join('\n') : '(sin salida)'}
          </pre>
        </div>
      )}
    </div>
  );
}
