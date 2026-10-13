import { cx } from '../../utils/cx';

/** Anchos simulados para la vista previa. */
export const VIEWPORTS = [
  { label: '📱 Móvil', className: 'max-w-[375px]' },
  { label: '💻 Tablet', className: 'max-w-[640px]' },
  { label: '🖥️ Escritorio', className: 'max-w-full' },
];

export const DEFAULT_VIEWPORT = 'max-w-full';

interface ViewportToggleProps {
  value: string;
  onChange: (className: string) => void;
}

/** Botones para cambiar el ancho de la vista previa. */
export default function ViewportToggle({ value, onChange }: ViewportToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-zinc-900 p-1 ring-1 ring-zinc-800">
      {VIEWPORTS.map((viewport) => (
        <button
          key={viewport.className}
          onClick={() => onChange(viewport.className)}
          className={cx(
            'rounded-md px-3 py-1 text-xs font-medium transition',
            viewport.className === value ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-zinc-100'
          )}
        >
          {viewport.label}
        </button>
      ))}
    </div>
  );
}
