import type { Topic } from '../../types';
import { file } from '../source';
import BasicTable from '../examples/tanstack/BasicTable';
import AdvancedTable from '../examples/tanstack/AdvancedTable';

export default {
  id: 'tanstack-table',
  icon: '📊',
  title: 'TanStack Table',
  description:
    'Librería "headless" para tablas: te da la lógica (orden, filtros, paginación, selección, agrupación, columnas visibles…) y tú pones el HTML y los estilos. Funciona con miles de filas y es totalmente tipada.',
  tip: 'Define "columns" y "data" fuera del componente o con useMemo: si cambian en cada render, la tabla se recalcula entera. (Estos ejemplos usan la v8.)',

  snippets: [
    {
      title: 'Instalación',
      lang: 'bash',
      code: 'npm install @tanstack/react-table',
    },
    {
      title: 'Columnas: accessor, celdas personalizadas y acciones',
      code: `import { createColumnHelper } from '@tanstack/react-table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  status: 'activo' | 'bloqueado';
}

const columnHelper = createColumnHelper<User>();

export const userColumns = [
  // Columna calculada a partir de varios campos (accessor con función)
  columnHelper.accessor((row) => \`\${row.firstName} \${row.lastName}\`, {
    id: 'fullName',
    header: 'Nombre',
  }),
  columnHelper.accessor('email', {
    header: 'Correo',
    cell: (info) => <a href={\`mailto:\${info.getValue()}\`}>{info.getValue()}</a>,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Alta',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('es'),
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    filterFn: 'equals',
  }),
  // Columna sin datos para botones
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => <button onClick={() => console.log('Editar', row.original.id)}>✏️</button>,
  }),
];`,
    },
    {
      title: 'Mostrar / ocultar columnas',
      code: `const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ email: false });

const table = useReactTable({
  data,
  columns,
  state: { columnVisibility },
  onColumnVisibilityChange: setColumnVisibility,
  getCoreRowModel: getCoreRowModel(),
});

// Menú con un checkbox por columna
{table.getAllLeafColumns().map((column) => (
  <label key={column.id}>
    <input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} />
    {column.id}
  </label>
))}`,
    },
    {
      title: 'Paginación del lado del SERVIDOR (con TanStack Query)',
      description:
        'Para tablas con millones de filas: el servidor ordena y pagina; la tabla solo muestra la página actual.',
      code: `import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  flexRender, getCoreRowModel, useReactTable,
  type PaginationState, type SortingState,
} from '@tanstack/react-table';
import { userColumns } from './columns';

export function UsersTable() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data } = useQuery({
    queryKey: ['users', pagination, sorting],
    queryFn: () => fetchUsers({ page: pagination.pageIndex + 1, size: pagination.pageSize, sort: sorting[0] }),
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data: data?.items ?? [],
    columns: userColumns,
    rowCount: data?.total ?? 0,          // total de filas en el servidor
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,              // el servidor pagina
    manualSorting: true,                 // el servidor ordena
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>←</button>
      <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
      <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>→</button>
    </>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'Tabla básica',
      level: 'estudiante',
      description: 'createColumnHelper, useReactTable, getCoreRowModel y flexRender.',
      Component: BasicTable,
      files: [file('tanstack/BasicTable.tsx')],
    },
    {
      title: 'Tabla de administración completa',
      level: 'industria',
      description: 'Orden por columna, búsqueda global, paginación y selección de filas con estado tipado.',
      Component: AdvancedTable,
      files: [file('tanstack/AdvancedTable.tsx')],
    },
  ],
} satisfies Topic;
