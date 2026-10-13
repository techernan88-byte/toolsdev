import type { ReactNode } from 'react';

// Las props se tipan con una interface.
// - "?" marca una prop opcional (aquí con valor por defecto).
// - ReactNode acepta cualquier cosa que React pueda pintar (texto, JSX, listas...).
interface TarjetaProps {
  titulo: string;
  emoji?: string;
  children: ReactNode;
}

function Tarjeta({ titulo, emoji = '📦', children }: TarjetaProps) {
  return (
    <div className="rounded-xl bg-zinc-800 p-4 ring-1 ring-white/10">
      <h4 className="font-semibold text-white">
        {emoji} {titulo}
      </h4>
      <div className="mt-1 text-sm text-zinc-400">{children}</div>
    </div>
  );
}

export default function TarjetaDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tarjeta titulo="HTML" emoji="📄">
        La estructura de la página.
      </Tarjeta>
      <Tarjeta titulo="CSS" emoji="🎨">
        Los estilos. <strong className="text-sky-400">children</strong> puede tener cualquier JSX.
      </Tarjeta>
      <Tarjeta titulo="Sin emoji">Usa el valor por defecto 📦</Tarjeta>
    </div>
  );
}
