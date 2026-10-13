import { useCallback, useState } from 'react';

// Un custom hook es una función que empieza por "use" y usa otros hooks.
// "as const" hace que el retorno sea una tupla [boolean, () => void] y no un array mezclado.
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggle] as const;
}
