import { useState } from 'react';

export type CopyStatus = 'idle' | 'copied' | 'error';

/**
 * Copia un texto al portapapeles y devuelve el estado para dar feedback en el botón.
 * El navegador puede rechazar la copia (sin permiso, pestaña sin foco, HTTP sin seguridad…):
 * en ese caso el estado pasa a 'error' en lugar de fallar en silencio.
 */
export function useCopyToClipboard(resetAfterMs = 1500) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), resetAfterMs);
  };

  return { status, copy };
}
