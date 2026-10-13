import { ToastProvider, useToast } from './ToastContext';

// Cualquier componente, a cualquier profundidad, puede lanzar notificaciones
function SaveButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() => toast('Cambios guardados', 'success')}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
    >
      Guardar
    </button>
  );
}

function DeleteButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() => toast('No tienes permisos', 'error')}
      className="rounded-lg bg-rose-600 px-4 py-2 text-white"
    >
      Eliminar
    </button>
  );
}

export default function ToastDemo() {
  return (
    // En una app real el Provider envuelve a toda la aplicación (en main.tsx)
    <ToastProvider>
      <div className="flex min-h-40 flex-wrap items-start gap-3">
        <SaveButton />
        <DeleteButton />
      </div>
    </ToastProvider>
  );
}
