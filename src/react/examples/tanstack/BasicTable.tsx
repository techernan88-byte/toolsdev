import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// TanStack Table es "headless": te da la LÓGICA (filas, columnas, orden...)
// y tú decides el HTML y los estilos.

interface Person {
  name: string;
  age: number;
  city: string;
}

const DATA: Person[] = [
  { name: 'Ana', age: 28, city: 'Madrid' },
  { name: 'Luis', age: 34, city: 'Lima' },
  { name: 'Marta', age: 22, city: 'Bogotá' },
  { name: 'Diego', age: 41, city: 'CDMX' },
];

// columnHelper da autocompletado y tipos: 'name' solo puede ser una clave de Person
const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('name', { header: 'Nombre' }),
  columnHelper.accessor('age', { header: 'Edad', cell: (info) => `${info.getValue()} años` }),
  columnHelper.accessor('city', { header: 'Ciudad' }),
];

export default function BasicTable() {
  const table = useReactTable({ data: DATA, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <table className="w-full max-w-md overflow-hidden rounded-lg text-left text-sm ring-1 ring-white/10">
      <thead className="bg-zinc-800 text-zinc-400">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="px-3 py-2">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-white/5 text-zinc-300">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-3 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
