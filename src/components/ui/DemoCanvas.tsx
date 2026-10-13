import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

interface DemoCanvasProps {
  children: ReactNode;
  className?: string;
}

/**
 * Caja con fondo de puntos donde se muestran las demos y vistas previas.
 * Es "relative" para que los elementos "absolute" de una demo no se salgan de ella.
 */
export default function DemoCanvas({ children, className }: DemoCanvasProps) {
  return (
    <div
      className={cx(
        'relative rounded-xl border border-zinc-800 bg-zinc-900 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px]',
        className
      )}
    >
      {children}
    </div>
  );
}
