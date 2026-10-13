import { useState } from 'react';

// Tabla con búsqueda, filtro y orden, como en un panel de administración.
// Solo se guarda en el estado lo que el usuario elige (query, categoría, orden);
// la lista visible se DERIVA de esos valores en cada render.

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

type SortKey = keyof Omit<Product, 'id'>; // 'name' | 'category' | 'price' | 'stock'

interface Sort {
  key: SortKey;
  direction: 'asc' | 'desc';
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Teclado mecánico', category: 'Periféricos', price: 89, stock: 12 },
  { id: 2, name: 'Monitor 27"', category: 'Pantallas', price: 329, stock: 4 },
  { id: 3, name: 'Ratón inalámbrico', category: 'Periféricos', price: 39, stock: 0 },
  { id: 4, name: 'Webcam HD', category: 'Accesorios', price: 59, stock: 22 },
  { id: 5, name: 'Monitor 32" 4K', category: 'Pantallas', price: 549, stock: 2 },
  { id: 6, name: 'Soporte de portátil', category: 'Accesorios', price: 29, stock: 40 },
  { id: 7, name: 'Auriculares', category: 'Periféricos', price: 119, stock: 7 },
];

const CATEGORIES = ['Todas', ...new Set(PRODUCTS.map((product) => product.category))];

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Producto' },
  { key: 'category', label: 'Categoría' },
  { key: 'price', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
];

export default function ProductTable() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState<Sort>({ key: 'name', direction: 'asc' });

  const visibleProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  )
    .filter((product) => category === 'Todas' || product.category === category)
    .toSorted((a, b) => {
      const order = a[sort.key] > b[sort.key] ? 1 : -1;
      return sort.direction === 'asc' ? order : -order;
    });

  const toggleSort = (key: SortKey) =>
    setSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="🔍 Buscar producto…"
          className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg bg-zinc-800 px-3 text-white"
        >
          {CATEGORIES.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} className="px-3 py-2">
                  <button onClick={() => toggleSort(column.key)} className="hover:text-white">
                    {column.label} {sort.key === column.key && (sort.direction === 'asc' ? '▲' : '▼')}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {visibleProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/5">
                <td className="px-3 py-2 text-white">{product.name}</td>
                <td className="px-3 py-2">{product.category}</td>
                <td className="px-3 py-2">${product.price}</td>
                <td className="px-3 py-2">
                  {product.stock === 0 ? (
                    <span className="text-rose-400">Agotado</span>
                  ) : (
                    <span className={product.stock < 5 ? 'text-amber-400' : 'text-emerald-400'}>
                      {product.stock}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleProducts.length === 0 && (
          <p className="p-6 text-center text-zinc-500">Sin resultados para "{query}"</p>
        )}
      </div>
      <p className="text-xs text-zinc-500">
        Mostrando {visibleProducts.length} de {PRODUCTS.length} productos
      </p>
    </div>
  );
}
