import { useEffect, useState } from 'react';

// Devuelve el valor solo cuando deja de cambiar durante "delay" ms.
// Típico en buscadores: no llamar a la API en cada tecla.
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // si value cambia antes, se cancela
  }, [value, delay]);

  return debouncedValue;
}
