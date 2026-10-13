import { useEffect, useReducer, useRef } from 'react';
import { LANES, gitFlowReducer, hasOwnCommits, initialState, type Lane } from './gitflow';

const LANE_STYLE: Record<Lane, { color: string; label: string }> = {
  main: { color: '#38bdf8', label: 'main' },
  hotfix: { color: '#fb7185', label: 'hotfix/*' },
  release: { color: '#fbbf24', label: 'release/*' },
  develop: { color: '#a78bfa', label: 'develop' },
  feature: { color: '#34d399', label: 'feature/*' },
};

const ROW_HEIGHT = 46;
const STEP_X = 48;
const PADDING_X = 30;

const laneY = (lane: Lane) => 26 + LANES.indexOf(lane) * ROW_HEIGHT;
const commitX = (id: number) => PADDING_X + id * STEP_X;

const button =
  'rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-30';

/** Simulador interactivo de GitFlow: grafo de ramas + comandos equivalentes. */
export default function GitFlowSimulator() {
  const [state, dispatch] = useReducer(gitFlowReducer, initialState);
  const graphRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLPreElement>(null);

  // Al añadir commits, desplazar el grafo y la terminal hasta el final
  useEffect(() => {
    graphRef.current?.scrollTo({ left: graphRef.current.scrollWidth, behavior: 'smooth' });
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight });
  }, [state.commits.length, state.commands.length]);

  const { names, commits } = state;
  const width = commitX(commits.length) + PADDING_X;
  const height = laneY('feature') + 26;

  return (
    <div className="space-y-4">
      {/* ─── Acciones ─── */}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="space-y-1.5 rounded-lg bg-emerald-500/10 p-2 ring-1 ring-emerald-500/20">
          <p className="text-xs font-semibold text-emerald-300">1. Funcionalidades</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => dispatch({ type: 'startFeature' })}
              disabled={!!names.feature}
              className={`${button} bg-emerald-600`}
            >
              Iniciar feature
            </button>
            <button
              onClick={() => dispatch({ type: 'commitFeature' })}
              disabled={!names.feature}
              className={`${button} bg-emerald-700`}
            >
              Commit
            </button>
            <button
              onClick={() => dispatch({ type: 'finishFeature' })}
              disabled={!hasOwnCommits(state, 'feature')}
              className={`${button} bg-emerald-800`}
            >
              Terminar feature
            </button>
          </div>
        </div>
        <div className="space-y-1.5 rounded-lg bg-amber-500/10 p-2 ring-1 ring-amber-500/20">
          <p className="text-xs font-semibold text-amber-300">2. Publicar versión</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => dispatch({ type: 'startRelease' })}
              disabled={!!names.release}
              className={`${button} bg-amber-600`}
            >
              Iniciar release
            </button>
            <button
              onClick={() => dispatch({ type: 'finishRelease' })}
              disabled={!names.release}
              className={`${button} bg-amber-700`}
            >
              Terminar release
            </button>
          </div>
        </div>
        <div className="space-y-1.5 rounded-lg bg-rose-500/10 p-2 ring-1 ring-rose-500/20">
          <p className="text-xs font-semibold text-rose-300">3. Urgencias en producción</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => dispatch({ type: 'startHotfix' })}
              disabled={!!names.hotfix}
              className={`${button} bg-rose-600`}
            >
              Iniciar hotfix
            </button>
            <button
              onClick={() => dispatch({ type: 'finishHotfix' })}
              disabled={!names.hotfix}
              className={`${button} bg-rose-700`}
            >
              Terminar hotfix
            </button>
          </div>
        </div>
      </div>

      {/* ─── Qué acaba de pasar ─── */}
      <p className="rounded-lg bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200">💬 {state.lastAction}</p>

      {/* ─── Grafo ─── */}
      <div className="flex overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-white/10">
        <div className="shrink-0 border-r border-white/10 py-1">
          {LANES.map((lane) => (
            <div key={lane} className="flex flex-col justify-center px-3" style={{ height: ROW_HEIGHT }}>
              <span className="font-mono text-xs font-semibold" style={{ color: LANE_STYLE[lane].color }}>
                {LANE_STYLE[lane].label}
              </span>
              {names[lane] && <span className="font-mono text-[10px] text-zinc-500">{names[lane]}</span>}
            </div>
          ))}
        </div>

        <div ref={graphRef} className="overflow-x-auto">
          <svg width={width} height={height} className="block">
            {/* Líneas de cada rama */}
            {LANES.map((lane) => (
              <line
                key={lane}
                x1={0}
                x2={width}
                y1={laneY(lane)}
                y2={laneY(lane)}
                stroke="#27272a"
                strokeDasharray="4 4"
              />
            ))}

            {/* Conexiones padre → hijo (rectas en la misma rama, curvas al ramificar o hacer merge) */}
            {commits.flatMap((commit) =>
              commit.parents.map((parentId) => {
                const parent = commits[parentId]!;
                const [x1, y1, x2, y2] = [
                  commitX(parent.id),
                  laneY(parent.lane),
                  commitX(commit.id),
                  laneY(commit.lane),
                ];
                const middle = (x1 + x2) / 2;
                const color = LANE_STYLE[parent.lane === commit.lane ? commit.lane : parent.lane].color;
                return (
                  <path
                    key={`${parentId}-${commit.id}`}
                    d={`M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2.5}
                    strokeOpacity={0.8}
                  />
                );
              })
            )}

            {/* Commits */}
            {commits.map((commit) => {
              const x = commitX(commit.id);
              const y = laneY(commit.lane);
              const isMerge = commit.parents.length > 1;
              return (
                <g key={commit.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isMerge ? 8 : 6}
                    fill="#09090b"
                    stroke={LANE_STYLE[commit.lane].color}
                    strokeWidth={3}
                  >
                    <title>{commit.message}</title>
                  </circle>
                  {commit.tag && (
                    <text
                      x={x}
                      y={y - 13}
                      textAnchor="middle"
                      className="fill-sky-300 font-mono text-[10px] font-bold"
                    >
                      {commit.tag}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ─── Terminal con los comandos equivalentes ─── */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
          <span className="text-xs text-zinc-500">
            Comandos de git equivalentes · versión actual v
            {`${state.version.major}.${state.version.minor}.${state.version.patch}`}
          </span>
          <button
            onClick={() => dispatch({ type: 'reset' })}
            className="text-xs text-zinc-400 hover:text-white"
          >
            ↺ Reiniciar
          </button>
        </div>
        <pre ref={terminalRef} className="max-h-56 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
          {state.commands.map((command, index) => {
            const [code, comment] = command.split('#');
            return (
              <div key={index}>
                <span className="text-emerald-400">$ </span>
                <span className="text-zinc-200">{code}</span>
                {comment && <span className="text-zinc-500">#{comment}</span>}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
