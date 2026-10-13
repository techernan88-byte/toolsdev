export interface IndexItem {
  id: string;
  label: string;
}

/** Desplaza la página hasta un elemento (el margen superior lo deja por debajo de la cabecera fija). */
const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/**
 * "En esta página": índice para saltar a cada snippet del tema.
 * Usa botones con scroll en vez de enlaces #ancla porque el # de la URL ya se usa para la navegación.
 */
export default function TopicIndex({ items }: { items: IndexItem[] }) {
  if (items.length < 3) return null; // en temas cortos no hace falta

  return (
    <nav aria-label="En esta página" className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">📑 En esta página</p>
      <ol className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToId(item.id)}
              className="text-left text-zinc-400 hover:text-sky-300"
            >
              <span className="mr-2 font-mono text-xs text-zinc-600">{index + 1}.</span>
              {item.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
