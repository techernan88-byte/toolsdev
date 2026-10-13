import { useReducer } from 'react';

// Tipos del estado y de las acciones (unión discriminada por "type")
interface State {
  count: number;
  step: number;
}

type Action =
  { type: 'increment' } | { type: 'decrement' } | { type: 'setStep'; step: number } | { type: 'reset' };

const initialState: State = { count: 0, step: 1 };

// Un reducer es una función pura: (estadoActual, acción) => nuevoEstado
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.step }; // TS sabe que aquí existe action.step
    case 'reset':
      return initialState;
  }
}

export default function CounterReducer() {
  // dispatch({ type: '...' }) "envía" una acción al reducer
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-5xl font-black text-white">{state.count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'decrement' })}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-white"
        >
          −{state.step}
        </button>
        <button
          onClick={() => dispatch({ type: 'increment' })}
          className="rounded-lg bg-sky-500 px-4 py-2 text-white"
        >
          +{state.step}
        </button>
        <button onClick={() => dispatch({ type: 'reset' })} className="px-3 text-zinc-400 hover:text-white">
          Reset
        </button>
      </div>
      <label className="text-sm text-zinc-400">
        Paso:{' '}
        <select
          value={state.step}
          onChange={(e) => dispatch({ type: 'setStep', step: Number(e.target.value) })}
          className="rounded bg-zinc-800 px-2 py-1 text-white"
        >
          <option>1</option>
          <option>5</option>
          <option>10</option>
        </select>
      </label>
    </div>
  );
}
