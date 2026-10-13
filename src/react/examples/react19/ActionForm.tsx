import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { delay } from '../shared/fakeApi';

// React 19: las "Actions" gestionan el envío de formularios por ti.
// - useActionState: devuelve el estado que retorna la acción + isPending.
// - useFormStatus: un botón hijo sabe si su <form> se está enviando.
// - <form action={...}> recibe un FormData, sin preventDefault ni useState por campo.

interface SubscribeState {
  email?: string;
  error?: string;
  success?: string;
}

async function subscribe(_previousState: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '');
  await delay(1000); // simula la petición al servidor
  if (!email.includes('@')) return { error: 'Ese correo no es válido', email };
  return { success: `¡Listo! Suscrito como ${email}` };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-lg bg-sky-500 px-4 font-semibold text-white disabled:opacity-50"
    >
      {pending ? 'Enviando…' : 'Suscribirme'}
    </button>
  );
}

export default function ActionForm() {
  const [state, formAction, isPending] = useActionState(subscribe, {});

  return (
    <form action={formAction} className="max-w-md space-y-2">
      <div className="flex gap-2">
        <input
          name="email"
          defaultValue={state.email}
          placeholder="tu@correo.com (prueba sin @)"
          className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        <SubmitButton />
      </div>
      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-400">{state.success}</p>}
      <p className="text-xs text-zinc-500">isPending: {String(isPending)}</p>
    </form>
  );
}
