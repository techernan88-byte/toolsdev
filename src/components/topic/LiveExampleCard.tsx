import { useState } from 'react';
import type { LiveExample } from '../../types';
import CodeViewer from './CodeViewer';
import LevelBadge from './LevelBadge';
import DemoErrorBoundary from './DemoErrorBoundary';
import DemoCanvas from '../ui/DemoCanvas';

const smallButton = 'rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700';

/** Ejemplo ejecutable: demo real del componente + su código fuente. */
export default function LiveExampleCard({ example }: { example: LiveExample }) {
  const { title, level, description, Component, files } = example;
  const [resetKey, setResetKey] = useState(0);
  const [showCode, setShowCode] = useState(true);

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-white">{title}</h4>
            <LevelBadge level={level} />
          </div>
          {description && <p className="text-sm text-zinc-400">{description}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setResetKey((key) => key + 1)} className={smallButton}>
            ↺ Reiniciar demo
          </button>
          <button onClick={() => setShowCode((prev) => !prev)} className={smallButton}>
            {showCode ? 'Ocultar código' : '</> Ver código'}
          </button>
        </div>
      </div>

      <DemoCanvas className="p-6">
        {/* key: al cambiarla, React desmonta y vuelve a montar la demo (estado limpio) */}
        <DemoErrorBoundary key={resetKey}>
          <Component />
        </DemoErrorBoundary>
      </DemoCanvas>

      {showCode && <CodeViewer files={files} />}
    </div>
  );
}
