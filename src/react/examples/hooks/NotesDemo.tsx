import { useLocalStorage } from './useLocalStorage';
import { useToggle } from './useToggle';

export default function NotesDemo() {
  const [note, setNote] = useLocalStorage('playground-nota', ''); // T = string
  const [isPreview, togglePreview] = useToggle(false);

  return (
    <div className="max-w-md space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-zinc-400">📝 Escribe y recarga la página: la nota sigue aquí</span>
        <button onClick={togglePreview} className="rounded bg-zinc-800 px-2 py-1 text-xs text-white">
          {isPreview ? 'Editar' : 'Vista previa'}
        </button>
      </div>
      {isPreview ? (
        <p className="min-h-24 rounded-lg bg-zinc-800/50 p-3 whitespace-pre-wrap text-zinc-200">
          {note || 'Sin contenido'}
        </p>
      ) : (
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
      )}
    </div>
  );
}
