import { useOptimistic, useRef, useState } from 'react';
import { delay } from '../shared/fakeApi';

// useOptimistic: muestra el resultado ANTES de que el servidor responda
// (como WhatsApp o Instagram). Si la acción falla, React vuelve atrás solo.

interface Message {
  id: string;
  text: string;
  sending?: boolean;
}

export default function OptimisticChat() {
  const [messages, setMessages] = useState<Message[]>([{ id: '1', text: '¡Hola! 👋' }]);
  const [shouldFail, setShouldFail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (current: Message[], newMessage: Message) => [...current, { ...newMessage, sending: true }]
  );

  async function sendMessage(formData: FormData) {
    const text = String(formData.get('text') ?? '').trim();
    if (!text) return;
    setError(null);
    formRef.current?.reset();
    addOptimisticMessage({ id: crypto.randomUUID(), text }); // aparece al instante

    await delay(1500); // "servidor"
    if (shouldFail) {
      setError(`No se pudo enviar "${text}"`); // el mensaje optimista desaparece
      return;
    }
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text }]);
  }

  return (
    <div className="max-w-sm space-y-3">
      <ul className="space-y-2">
        {optimisticMessages.map((message) => (
          <li
            key={message.id}
            className={`ml-auto w-fit rounded-2xl rounded-br-sm px-3 py-1.5 text-white ${message.sending ? 'bg-sky-500/50' : 'bg-sky-500'}`}
          >
            {message.text}
            {message.sending && <span className="ml-2 text-xs opacity-70">enviando…</span>}
          </li>
        ))}
      </ul>
      {error && <p className="text-sm text-rose-400">⚠️ {error}</p>}
      <form ref={formRef} action={sendMessage} className="flex gap-2">
        <input
          name="text"
          placeholder="Mensaje…"
          className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button className="rounded-lg bg-sky-500 px-4 text-white">Enviar</button>
      </form>
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(e) => setShouldFail(e.target.checked)}
          className="accent-rose-500"
        />
        Simular fallo del servidor
      </label>
    </div>
  );
}
