import type { Control } from '../../types';
import { cx } from '../../utils/cx';

interface ControlGroupProps {
  control: Control;
  value: string;
  onChange: (value: string) => void;
}

/** Grupo de "chips": cada opción es una clase de Tailwind ('' = ninguna). */
export default function ControlGroup({ control, value, onChange }: ControlGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        {control.label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {control.options.map((option) => (
          <button
            key={option || 'none'}
            onClick={() => onChange(option)}
            className={cx(
              'rounded-md border px-2 py-1 font-mono text-xs transition',
              option === value
                ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                : 'border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-sky-500/60'
            )}
          >
            {option || 'ninguno'}
          </button>
        ))}
      </div>
      {control.hint && <p className="mt-1.5 text-xs text-zinc-500">{control.hint}</p>}
    </fieldset>
  );
}
