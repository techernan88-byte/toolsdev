import { Component, useState, type ErrorInfo, type ReactNode } from 'react';

// Error Boundary: atrapa errores de renderizado de sus hijos y muestra
// una interfaz alternativa en vez de dejar la pantalla en blanco.
// Aún hoy solo puede escribirse como componente de clase.
// (En proyectos reales se suele usar la librería react-error-boundary.)

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Aquí se enviaría el error a Sentry, Datadog, etc.
    console.warn('Error capturado:', error.message, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-lg bg-rose-500/10 p-4 text-rose-300 ring-1 ring-rose-500/30">
          <p className="font-semibold">💥 Algo salió mal</p>
          <p className="text-sm">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })} className="mt-2 text-sm underline">
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0);
  if (count === 3) throw new Error('¡El contador llegó a 3 y explotó!');
  return (
    <button onClick={() => setCount((n) => n + 1)} className="rounded-lg bg-zinc-800 px-4 py-2 text-white">
      Clics: {count} (explota en 3)
    </button>
  );
}

export default function ErrorBoundaryDemo() {
  return (
    <div className="space-y-3">
      <ErrorBoundary>
        <BuggyCounter />
      </ErrorBoundary>
      <p className="text-sm text-zinc-500">
        El resto de la página sigue funcionando aunque el contador falle.
      </p>
    </div>
  );
}
