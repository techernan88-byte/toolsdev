import type { Topic } from '../../types';
import { file } from '../source';
import CounterReducer from '../examples/reducer/CounterReducer';
import ShoppingCart from '../examples/reducer/ShoppingCart';

export default {
  id: 'use-reducer',
  icon: '🧮',
  title: 'useReducer',
  description:
    'Alternativa a useState cuando el estado es complejo o tiene muchas formas de cambiar. Toda la lógica vive en una función pura (reducer) y los componentes solo "despachan" acciones.',
  tip: 'Un reducer debe ser puro: sin fetch, sin Math.random, sin mutar el estado. Mismo input → mismo output.',

  snippets: [
    {
      title: 'Formulario por pasos (wizard) con useReducer',
      code: `import { useReducer } from 'react';

interface WizardState {
  step: 1 | 2 | 3;
  data: { name: string; plan: 'free' | 'pro'; card: string };
  status: 'editing' | 'submitting' | 'done';
}

type WizardAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'update'; field: keyof WizardState['data']; value: string }
  | { type: 'submit' }
  | { type: 'success' };

const initialState: WizardState = {
  step: 1,
  data: { name: '', plan: 'free', card: '' },
  status: 'editing',
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'next':
      return { ...state, step: Math.min(state.step + 1, 3) as WizardState['step'] };
    case 'back':
      return { ...state, step: Math.max(state.step - 1, 1) as WizardState['step'] };
    case 'update':
      return { ...state, data: { ...state.data, [action.field]: action.value } };
    case 'submit':
      return { ...state, status: 'submitting' };
    case 'success':
      return { ...state, status: 'done' };
  }
}

export function SignupWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const submit = async () => {
    dispatch({ type: 'submit' });
    await fetch('/api/signup', { method: 'POST', body: JSON.stringify(state.data) });
    dispatch({ type: 'success' });
  };

  if (state.status === 'done') return <p>🎉 ¡Cuenta creada!</p>;

  return (
    <div>
      <p>Paso {state.step} de 3</p>
      {state.step === 1 && (
        <input value={state.data.name} onChange={(e) => dispatch({ type: 'update', field: 'name', value: e.target.value })} />
      )}
      {state.step === 2 && (
        <select value={state.data.plan} onChange={(e) => dispatch({ type: 'update', field: 'plan', value: e.target.value })}>
          <option value="free">Gratis</option>
          <option value="pro">Pro</option>
        </select>
      )}
      {state.step === 3 && <button onClick={submit} disabled={state.status === 'submitting'}>Confirmar</button>}

      <button onClick={() => dispatch({ type: 'back' })} disabled={state.step === 1}>Atrás</button>
      <button onClick={() => dispatch({ type: 'next' })} disabled={state.step === 3}>Siguiente</button>
    </div>
  );
}`,
    },
    {
      title: 'Testear un reducer (Vitest), sin React',
      code: `import { describe, expect, it } from 'vitest';
import { cartReducer, initialCart, selectTotalPrice } from './cartReducer';

const shirt = { id: 'p1', name: 'Camiseta', emoji: '👕', price: 20 };

describe('cartReducer', () => {
  it('añade un producto nuevo con cantidad 1', () => {
    const state = cartReducer(initialCart, { type: 'add', product: shirt });
    expect(state.items).toEqual([{ ...shirt, qty: 1 }]);
  });

  it('suma cantidad si el producto ya existe', () => {
    let state = cartReducer(initialCart, { type: 'add', product: shirt });
    state = cartReducer(state, { type: 'add', product: shirt });
    expect(state.items[0].qty).toBe(2);
    expect(selectTotalPrice(state)).toBe(40);
  });

  it('elimina el producto si la cantidad llega a 0', () => {
    const state = cartReducer({ items: [{ ...shirt, qty: 1 }] }, { type: 'updateQty', id: 'p1', qty: 0 });
    expect(state.items).toHaveLength(0);
  });
});`,
    },
    {
      title: 'useReducer + Context: estado global sin librerías',
      code: `import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { cartReducer, initialCart, type CartAction, type CartState } from './cartReducer';

// Dos contextos separados: quien solo despacha no se re-renderiza cuando cambia el estado
const CartStateContext = createContext<CartState | null>(null);
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartStateContext value={state}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartStateContext>
  );
}

export function useCart() {
  const state = useContext(CartStateContext);
  if (!state) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return state;
}

export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) throw new Error('useCartDispatch debe usarse dentro de <CartProvider>');
  return dispatch;
}

// Uso en cualquier componente
function AddButton({ product }: { product: Product }) {
  const dispatch = useCartDispatch();
  return <button onClick={() => dispatch({ type: 'add', product })}>Añadir</button>;
}`,
    },
  ],

  examples: [
    {
      title: 'Contador con reducer',
      level: 'estudiante',
      description: 'Acciones tipadas con una unión discriminada.',
      Component: CounterReducer,
      files: [file('reducer/CounterReducer.tsx')],
    },
    {
      title: 'Carrito de compras',
      level: 'industria',
      description: 'Reducer en su propio archivo, tipos exportados, acciones con datos y selectores.',
      Component: ShoppingCart,
      files: [file('reducer/ShoppingCart.tsx'), file('reducer/cartReducer.ts')],
    },
  ],
} satisfies Topic;
