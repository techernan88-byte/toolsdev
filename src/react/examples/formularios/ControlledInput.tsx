import { useState } from 'react';

// Input "controlado": React es la única fuente de verdad.
// value viene del estado y onChange lo actualiza en cada tecla.

const COLORS = { sky: 'text-sky-400', pink: 'text-pink-400', lime: 'text-lime-400' };
type ColorName = keyof typeof COLORS; // 'sky' | 'pink' | 'lime'

export default function ControlledInput() {
  const [name, setName] = useState('');
  const [color, setColor] = useState<ColorName>('sky');

  return (
    <div className="max-w-sm space-y-3">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Escribe tu nombre"
        className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
      />
      <select
        value={color}
        // event.target.value es string: lo convertimos al tipo concreto
        onChange={(event) => setColor(event.target.value as ColorName)}
        className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white"
      >
        <option value="sky">Azul</option>
        <option value="pink">Rosa</option>
        <option value="lime">Lima</option>
      </select>
      <p className="text-2xl font-bold text-white">
        Hola, <span className={COLORS[color]}>{name || 'desconocido'}</span>
      </p>
      <p className="text-xs text-zinc-500">{name.length} caracteres</p>
    </div>
  );
}
