import { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';

// Tabla de administración completa: orden, búsqueda global, paginación y selección.
// Cada "feature" se activa añadiendo su getXxxRowModel() y su estado.

interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'pagado' | 'pendiente' | 'cancelado';
}

const CUSTOMERS = ['Ana', 'Luis', 'Marta', 'Diego', 'Sofía', 'Pablo', 'Elena'];
const STATUSES: Order['status'][] = ['pagado', 'pendiente', 'cancelado'];

const ORDERS: Order[] = Array.from({ length: 23 }, (_, index) => ({
  id: 1000 + index,
  customer: CUSTOMERS[index % CUSTOMERS.length],
  total: ((index * 37) % 400) + 15,
  status: STATUSES[index % 3],
}));

const STATUS_STYLES: Record<Order['status'], string> = {
  pagado: 'bg-emerald-500/15 text-emerald-300',
  pendiente: 'bg-amber-500/15 text-amber-300',
  cancelado: 'bg-rose-500/15 text-rose-300',
};

const columnHelper = createColumnHelper<Order>();

const columns = [
  // Columna sin datos (display) para los checkboxes
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
    ),
  }),
  columnHelper.accessor('id', { header: 'Pedido', cell: (info) => `#${info.getValue()}` }),
  columnHelper.accessor('customer', { header: 'Cliente' }),
  columnHelper.accessor('total', { header: 'Total', cell: (info) => `$${info.getValue()}` }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => (
      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[info.getValue()]}`}>
        {info.getValue()}
      </span>
    ),
  }),
];

export default function AdvancedTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: ORDERS,
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="🔍 Buscar en todas las columnas…"
          className="w-full max-w-xs rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        {selectedCount > 0 && <span className="text-sm text-sky-300">{selectedCount} seleccionado(s)</span>}
      </div>

      <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2">
                    {header.column.getCanSort() ? (
                      <button onClick={header.column.getToggleSortingHandler()} className="hover:text-white">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={row.getIsSelected() ? 'bg-sky-500/10' : 'hover:bg-white/5'}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-white disabled:opacity-40"
        >
          ← Anterior
        </button>
        <span className="text-zinc-400">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} ·{' '}
          {table.getFilteredRowModel().rows.length} pedidos
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-white disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
