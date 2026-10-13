import { useState, type ReactNode } from 'react';

// Patrón de la industria:
// - Configuración por variante en un objeto tipado con Record<Variant, ...>.
// - Props opcionales: si no hay title u onClose, no se renderizan.
// - onClose es un "callback": el hijo avisa, el padre decide qué hacer.

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANTS: Record<AlertVariant, { icon: string; classes: string }> = {
  info: { icon: 'ℹ️', classes: 'border-sky-500/30 bg-sky-500/10 text-sky-200' },
  success: { icon: '✅', classes: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' },
  warning: { icon: '⚠️', classes: 'border-amber-500/30 bg-amber-500/10 text-amber-200' },
  error: { icon: '⛔', classes: 'border-rose-500/30 bg-rose-500/10 text-rose-200' },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

export function Alert({ variant = 'info', title, onClose, children }: AlertProps) {
  const { icon, classes } = VARIANTS[variant];

  return (
    <div role="alert" className={`flex gap-3 rounded-lg border p-3 ${classes}`}>
      <span>{icon}</span>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Cerrar" className="opacity-60 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}

interface AlertData {
  id: number;
  variant: AlertVariant;
  title?: string;
  text: string;
}

const INITIAL_ALERTS: AlertData[] = [
  { id: 1, variant: 'info', title: 'Nueva versión', text: 'La v2.0 ya está disponible.' },
  { id: 2, variant: 'success', text: 'Tus cambios se guardaron.' },
  { id: 3, variant: 'warning', title: 'Atención', text: 'Tu plan vence en 3 días.' },
  { id: 4, variant: 'error', title: 'Error de pago', text: 'La tarjeta fue rechazada.' },
];

export default function AlertDemo() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const dismiss = (id: number) => setAlerts((prev) => prev.filter((alert) => alert.id !== id));

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={alert.variant} title={alert.title} onClose={() => dismiss(alert.id)}>
          {alert.text}
        </Alert>
      ))}
      {alerts.length === 0 && (
        <button onClick={() => setAlerts(INITIAL_ALERTS)} className="text-sm text-sky-400 hover:underline">
          ↺ Mostrar alertas otra vez
        </button>
      )}
    </div>
  );
}
