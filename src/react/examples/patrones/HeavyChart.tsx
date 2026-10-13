// Componente "pesado" que se carga bajo demanda con lazy()
const DATA: number[] = [40, 65, 30, 80, 55, 90, 70];

export default function HeavyChart() {
  return (
    <div className="flex h-40 items-end gap-2 rounded-lg bg-zinc-800 p-4">
      {DATA.map((value, index) => (
        <div
          key={index}
          className="flex-1 rounded-t bg-linear-to-t from-sky-600 to-sky-400"
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}
