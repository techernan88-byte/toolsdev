import { useState } from 'react';

export default function Counter() {
  // [valorActual, funciónParaCambiarlo] = useState(valorInicial)
  // TypeScript infiere el tipo desde el valor inicial: number
  const [count, setCount] = useState(0);

  // ✅ Forma funcional (prev => ...) cuando el nuevo valor depende del anterior
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  // ❌ setCount(count + 1) tres veces sumaría solo 1 (count es el mismo en este render)
  // ✅ Con la forma funcional cada llamada recibe el valor actualizado
  const addThree = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className={`text-6xl font-black ${count < 0 ? 'text-rose-400' : 'text-white'}`}>{count}</p>
      <div className="flex gap-2">
        <button onClick={decrement} className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700">
          −1
        </button>
        <button onClick={increment} className="rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-400">
          +1
        </button>
        <button
          onClick={addThree}
          className="rounded-lg bg-violet-500 px-4 py-2 text-white hover:bg-violet-400"
        >
          +3
        </button>
        <button onClick={() => setCount(0)} className="rounded-lg px-4 py-2 text-zinc-400 hover:text-white">
          Reset
        </button>
      </div>
    </div>
  );
}
