// Lógica del carrito separada del componente:
// se puede testear sin React y reutilizar en otras pantallas.

export interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'updateQty'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

export const initialCart: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const exists = state.items.some((item) => item.id === action.product.id);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id === action.product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return { items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'updateQty':
      return {
        items: state.items
          .map((item) => (item.id === action.id ? { ...item, qty: action.qty } : item))
          .filter((item) => item.qty > 0),
      };
    case 'remove':
      return { items: state.items.filter((item) => item.id !== action.id) };
    case 'clear':
      return initialCart;
  }
}

// Selectores: funciones que calculan datos a partir del estado
export const selectTotalItems = (state: CartState) => state.items.reduce((sum, item) => sum + item.qty, 0);
export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.qty * item.price, 0);
