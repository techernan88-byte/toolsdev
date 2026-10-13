import { useEffect, useState } from 'react';

// Igual que useState, pero el valor sobrevive a recargar la página.
// Es GENÉRICO: <T> se deduce del valor inicial (string, number, objetos...).
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Inicialización perezosa: solo lee localStorage en el primer render
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue; // modo privado, JSON corrupto...
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // almacenamiento lleno o bloqueado: seguimos funcionando en memoria
    }
  }, [key, value]);

  return [value, setValue] as const;
}
