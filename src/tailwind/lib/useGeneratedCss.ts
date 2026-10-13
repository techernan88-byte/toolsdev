import { useEffect, useState } from 'react';
import { getCssForHtml } from './getCssForHtml';

/**
 * Devuelve el CSS generado para las clases de un HTML.
 * Solo calcula cuando `enabled` es true; espera un poco para que
 * el compilador del navegador termine de generar clases nuevas.
 */
export function useGeneratedCss(html: string, enabled: boolean) {
  const [css, setCss] = useState('');

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => setCss(getCssForHtml(html)), 150);
    return () => clearTimeout(timer);
  }, [html, enabled]);

  return css;
}
