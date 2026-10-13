import { useEffect, type RefObject } from 'react';

// Ejecuta "handler" cuando se hace clic fuera del elemento de "ref".
// Útil para cerrar menús, dropdowns y popovers.
export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: PointerEvent) => void
) {
  useEffect(() => {
    const listener = (event: PointerEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [ref, handler]);
}
