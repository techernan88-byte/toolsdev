import { Suspense, use, useState } from 'react';
import { delay } from '../shared/fakeApi';

const QUOTES = [
  'Primero resuelve el problema. Luego escribe el código.',
  'El código se lee muchas más veces de las que se escribe.',
  'Hazlo funcionar, hazlo correcto, hazlo rápido.',
  'La simplicidad es requisito de la fiabilidad.',
];

async function fetchQuote(): Promise<string> {
  await delay(1000);
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// use(promesa): "espera" la promesa dentro del render.
// Mientras no se resuelve, el <Suspense> más cercano muestra el fallback.
function Quote({ quotePromise }: { quotePromise: Promise<string> }) {
  const quote = use(quotePromise); // tipo: string
  return (
    <blockquote className="border-l-4 border-sky-500 pl-4 text-lg text-zinc-200 italic">"{quote}"</blockquote>
  );
}

export default function UsePromise() {
  // La promesa se crea FUERA del render (en el estado o en un evento)
  const [quotePromise, setQuotePromise] = useState(fetchQuote);

  return (
    <div className="max-w-md space-y-4">
      <Suspense fallback={<p className="animate-pulse text-zinc-500">Cargando frase…</p>}>
        <Quote quotePromise={quotePromise} />
      </Suspense>
      <button
        onClick={() => setQuotePromise(fetchQuote())}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
      >
        🎲 Otra frase
      </button>
    </div>
  );
}
