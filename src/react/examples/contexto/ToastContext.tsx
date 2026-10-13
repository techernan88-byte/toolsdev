import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

// Patrón de la industria: Provider + custom hook.
// - El estado y la lógica viven en el Provider.
// - Los componentes solo usan useToast(), sin saber cómo funciona por dentro.
// - El contexto empieza en null y useToast lanza un error claro si falta el Provider.

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-600',
  error: 'bg-rose-600',
  info: 'bg-sky-600',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback(
    (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
    []
  );

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 3000);
    },
    [dismiss]
  );

  // useMemo: el objeto no cambia entre renders → los consumidores no se re-renderizan sin motivo
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white shadow-lg ${STYLES[item.type]}`}
          >
            {item.message}
            <button onClick={() => dismiss(item.id)} className="opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return context; // a partir de aquí TypeScript sabe que no es null
}
