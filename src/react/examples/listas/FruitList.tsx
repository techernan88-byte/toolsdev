import { useState } from 'react';

interface Fruit {
  id: number;
  name: string;
  emoji: string;
  tropical: boolean;
}

const FRUITS: Fruit[] = [
  { id: 1, name: 'Mango', emoji: '🥭', tropical: true },
  { id: 2, name: 'Manzana', emoji: '🍎', tropical: false },
  { id: 3, name: 'Piña', emoji: '🍍', tropical: true },
  { id: 4, name: 'Uvas', emoji: '🍇', tropical: false },
  { id: 5, name: 'Coco', emoji: '🥥', tropical: true },
];

export default function FruitList() {
  const [onlyTropical, setOnlyTropical] = useState(false);

  // filter + map: el patrón más usado para listas
  const visibleFruits = onlyTropical ? FRUITS.filter((fruit) => fruit.tropical) : FRUITS;

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={onlyTropical}
          onChange={(e) => setOnlyTropical(e.target.checked)}
          className="accent-sky-500"
        />
        Solo tropicales
      </label>

      <ul className="flex flex-wrap gap-2">
        {/* key: identificador ÚNICO y ESTABLE de cada elemento */}
        {visibleFruits.map((fruit) => (
          <li key={fruit.id} className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200">
            {fruit.emoji} {fruit.name}
            {/* Renderizado condicional con && */}
            {fruit.tropical && <span className="ml-1 text-xs text-amber-400">☀</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
