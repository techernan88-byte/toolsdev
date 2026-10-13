import { useState } from 'react';

// Estado booleano: el caso más común (mostrar/ocultar, abrir/cerrar, activo/inactivo)
export default function PasswordToggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex max-w-sm gap-2">
      <input
        type={isVisible ? 'text' : 'password'}
        defaultValue="miClaveSecreta123"
        className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        onClick={() => setIsVisible((prev) => !prev)}
        className="rounded-lg bg-zinc-800 px-3 text-white hover:bg-zinc-700"
        aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {isVisible ? '🙈' : '👁️'}
      </button>
    </div>
  );
}
