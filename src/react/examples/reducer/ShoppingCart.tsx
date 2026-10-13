import { useReducer } from 'react';
import { cartReducer, initialCart, selectTotalItems, selectTotalPrice, type Product } from './cartReducer';

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Camiseta', emoji: '👕', price: 19 },
  { id: 'p2', name: 'Zapatillas', emoji: '👟', price: 79 },
  { id: 'p3', name: 'Gorra', emoji: '🧢', price: 15 },
];

export default function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ul className="space-y-2">
        {PRODUCTS.map((product) => (
          <li key={product.id} className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
            <span className="text-zinc-200">
              {product.emoji} {product.name} <span className="text-zinc-500">${product.price}</span>
            </span>
            <button
              onClick={() => dispatch({ type: 'add', product })}
              className="rounded bg-sky-500 px-2 py-1 text-sm text-white"
            >
              Añadir
            </button>
          </li>
        ))}
      </ul>

      <div className="rounded-lg bg-zinc-800/50 p-3 ring-1 ring-white/10">
        <h4 className="mb-2 font-semibold text-white">🛒 Carrito ({selectTotalItems(cart)})</h4>
        {cart.items.length === 0 && <p className="text-sm text-zinc-500">Vacío</p>}
        <ul className="space-y-2">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm text-zinc-300">
              <span className="flex-1">
                {item.emoji} {item.name}
              </span>
              <button
                onClick={() => dispatch({ type: 'updateQty', id: item.id, qty: item.qty - 1 })}
                className="size-6 rounded bg-zinc-700"
              >
                −
              </button>
              <span className="w-5 text-center">{item.qty}</span>
              <button
                onClick={() => dispatch({ type: 'updateQty', id: item.id, qty: item.qty + 1 })}
                className="size-6 rounded bg-zinc-700"
              >
                +
              </button>
              <button
                onClick={() => dispatch({ type: 'remove', id: item.id })}
                className="text-zinc-500 hover:text-rose-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {cart.items.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-bold text-white">Total: ${selectTotalPrice(cart)}</span>
            <button
              onClick={() => dispatch({ type: 'clear' })}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Vaciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
