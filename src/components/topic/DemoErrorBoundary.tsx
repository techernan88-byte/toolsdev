import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Evita que un error en una demo rompa toda la página. */
export default class DemoErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
          La demo falló: {this.state.error.message}. Pulsa "Reiniciar demo".
        </p>
      );
    }
    return this.props.children;
  }
}
